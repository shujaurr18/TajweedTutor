import { EventEmitter } from 'events';
import AudioDataService from './audioDataService';
import TajweedAudioModule from './nativeModules/TajweedAudioModule';

class AudioDownloadManager extends EventEmitter {
  constructor() {
    super();
    this.downloadQueue = [];
    this.activeDownloads = new Map();
    this.maxConcurrentDownloads = 3;
    this.downloadProgress = new Map();
    this.isProcessing = false;
  }

  // Add audio to download queue
  addToQueue(audioItem) {
    const queueItem = {
      id: audioItem.id,
      type: audioItem.type, // 'qaida' or 'quran'
      reciterId: audioItem.reciterId,
      lessonId: audioItem.lessonId,
      surahId: audioItem.surahId,
      segmentIds: audioItem.segmentIds || [],
      ayahNumbers: audioItem.ayahNumbers || [],
      priority: audioItem.priority || 'normal', // 'high', 'normal', 'low'
      timestamp: Date.now(),
    };

    // Insert based on priority
    if (queueItem.priority === 'high') {
      this.downloadQueue.unshift(queueItem);
    } else {
      this.downloadQueue.push(queueItem);
    }

    this.emit('queueUpdated', {
      queueLength: this.downloadQueue.length,
      item: queueItem,
    });

    this.processQueue();
  }

  // Process download queue
  async processQueue() {
    if (this.isProcessing || this.activeDownloads.size >= this.maxConcurrentDownloads) {
      return;
    }

    this.isProcessing = true;

    while (this.downloadQueue.length > 0 && this.activeDownloads.size < this.maxConcurrentDownloads) {
      const item = this.downloadQueue.shift();
      this.startDownload(item);
    }

    this.isProcessing = false;
  }

  // Start downloading an item
  async startDownload(item) {
    const downloadId = `${item.type}_${item.id}_${Date.now()}`;
    
    this.activeDownloads.set(downloadId, {
      ...item,
      downloadId,
      startTime: Date.now(),
      status: 'downloading',
    });

    this.emit('downloadStarted', {
      downloadId,
      item,
    });

    try {
      let downloadedFiles = [];

      if (item.type === 'qaida') {
        downloadedFiles = await AudioDataService.downloadQaidaLesson(
          item.lessonId,
          item.segmentIds
        );
      } else if (item.type === 'quran') {
        downloadedFiles = await AudioDataService.downloadQuranSurah(
          item.reciterId,
          item.surahId,
          item.ayahNumbers
        );
      }

      // Process downloaded files with native module
      for (const filePath of downloadedFiles) {
        try {
          // Extract audio features using native module
          const features = await TajweedAudioModule.extractFeatures(filePath);
          
          // Get audio info
          const audioInfo = await TajweedAudioModule.getAudioInfo(filePath);
          
          // Store features and info (you might want to save this to a local database)
          this.storeAudioFeatures(filePath, features, audioInfo);
          
        } catch (error) {
          console.error('Error processing audio file:', filePath, error);
        }
      }

      this.activeDownloads.delete(downloadId);
      
      this.emit('downloadCompleted', {
        downloadId,
        item,
        downloadedFiles,
        duration: Date.now() - this.activeDownloads.get(downloadId)?.startTime,
      });

    } catch (error) {
      this.activeDownloads.delete(downloadId);
      
      this.emit('downloadFailed', {
        downloadId,
        item,
        error: error.message,
      });
    }

    // Continue processing queue
    this.processQueue();
  }

  // Store audio features locally
  storeAudioFeatures(filePath, features, audioInfo) {
    // This would typically save to a local database
    // For now, we'll just log it
    console.log('Storing audio features for:', filePath);
    console.log('Features:', features);
    console.log('Audio Info:', audioInfo);
  }

  // Download Qaida lesson with progress tracking
  async downloadQaidaLessonWithProgress(lessonId, segmentIds = [], onProgress = null) {
    const audioStructure = AudioDataService.getAudioDataStructure();
    const lesson = audioStructure.qaida.lessons[lessonId];
    
    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const segmentsToDownload = segmentIds.length > 0 ? segmentIds : Object.keys(lesson.segments);
    const totalSegments = segmentsToDownload.length;
    let completedSegments = 0;
    const downloadedFiles = [];

    for (const segmentId of segmentsToDownload) {
      const segment = lesson.segments[segmentId];
      if (!segment) continue;

      const localPath = segment.localPath;
      const isDownloaded = await AudioDataService.isAudioDownloaded(localPath);

      if (!isDownloaded) {
        try {
          // Download with progress tracking
          await this.downloadWithProgress(segment.audioUrl, localPath, (progress) => {
            const overallProgress = ((completedSegments + progress) / totalSegments) * 100;
            if (onProgress) {
              onProgress({
                segmentId,
                progress: overallProgress,
                currentSegment: segmentId,
                totalSegments,
                completedSegments,
              });
            }
          });
          
          downloadedFiles.push(localPath);
        } catch (error) {
          console.error(`Failed to download ${segmentId}:`, error);
        }
      } else {
        downloadedFiles.push(localPath);
      }

      completedSegments++;
      
      if (onProgress) {
        onProgress({
          segmentId,
          progress: (completedSegments / totalSegments) * 100,
          currentSegment: segmentId,
          totalSegments,
          completedSegments,
        });
      }
    }

    return downloadedFiles;
  }

  // Download with progress tracking
  async downloadWithProgress(url, localPath, onProgress) {
    // This would use RNFS.downloadFile with progress callback
    // For now, we'll simulate progress
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve(localPath);
        }
        if (onProgress) {
          onProgress(progress);
        }
      }, 100);
    });
  }

  // Get download status
  getDownloadStatus() {
    return {
      queueLength: this.downloadQueue.length,
      activeDownloads: this.activeDownloads.size,
      maxConcurrent: this.maxConcurrentDownloads,
      isProcessing: this.isProcessing,
    };
  }

  // Get active downloads
  getActiveDownloads() {
    return Array.from(this.activeDownloads.values());
  }

  // Cancel download
  cancelDownload(downloadId) {
    if (this.activeDownloads.has(downloadId)) {
      this.activeDownloads.delete(downloadId);
      this.emit('downloadCancelled', { downloadId });
      return true;
    }
    return false;
  }

  // Clear download queue
  clearQueue() {
    this.downloadQueue = [];
    this.emit('queueCleared');
  }

  // Pause all downloads
  pauseDownloads() {
    this.isProcessing = false;
    this.emit('downloadsPaused');
  }

  // Resume downloads
  resumeDownloads() {
    this.processQueue();
    this.emit('downloadsResumed');
  }

  // Set max concurrent downloads
  setMaxConcurrentDownloads(max) {
    this.maxConcurrentDownloads = Math.max(1, Math.min(10, max));
    this.emit('maxConcurrentUpdated', this.maxConcurrentDownloads);
  }

  // Download popular content (pre-download commonly used audio)
  async downloadPopularContent() {
    const popularContent = [
      // Popular Qaida lessons
      {
        type: 'qaida',
        id: 'lesson_1',
        lessonId: 'lesson_1',
        segmentIds: ['alif', 'ba', 'ta'],
        priority: 'high',
      },
      {
        type: 'qaida',
        id: 'lesson_2',
        lessonId: 'lesson_2',
        segmentIds: ['dal', 'dhal'],
        priority: 'normal',
      },
      
      // Popular Quran Surahs
      {
        type: 'quran',
        id: 'al_fatiha',
        reciterId: 'abdul_rahman_al_sudais',
        surahId: 'al_fatiha',
        ayahNumbers: ['ayah_1', 'ayah_2'],
        priority: 'high',
      },
      {
        type: 'quran',
        id: 'al_baqarah_start',
        reciterId: 'abdul_rahman_al_sudais',
        surahId: 'al_baqarah',
        ayahNumbers: ['ayah_1', 'ayah_2', 'ayah_3'],
        priority: 'normal',
      },
    ];

    for (const content of popularContent) {
      this.addToQueue(content);
    }
  }

  // Download offline content for specific user preferences
  async downloadOfflineContent(userPreferences) {
    const { preferredReciter, qaidaProgress, quranProgress } = userPreferences;
    
    // Download next Qaida lessons
    if (qaidaProgress && qaidaProgress.currentLesson) {
      const nextLessons = this.getNextQaidaLessons(qaidaProgress.currentLesson, 3);
      for (const lesson of nextLessons) {
        this.addToQueue({
          type: 'qaida',
          id: lesson.id,
          lessonId: lesson.id,
          priority: 'normal',
        });
      }
    }

    // Download Quran Surahs based on progress
    if (quranProgress && quranProgress.currentSurah) {
      const nextSurahs = this.getNextQuranSurahs(quranProgress.currentSurah, 2);
      for (const surah of nextSurahs) {
        this.addToQueue({
          type: 'quran',
          id: surah.id,
          reciterId: preferredReciter || 'abdul_rahman_al_sudais',
          surahId: surah.id,
          priority: 'normal',
        });
      }
    }
  }

  // Get next Qaida lessons to download
  getNextQaidaLessons(currentLesson, count) {
    const lessons = [];
    const audioStructure = AudioDataService.getAudioDataStructure();
    const qaidaLessons = audioStructure.qaida.lessons;
    
    let currentIndex = -1;
    const lessonIds = Object.keys(qaidaLessons);
    
    // Find current lesson index
    for (let i = 0; i < lessonIds.length; i++) {
      if (lessonIds[i] === currentLesson) {
        currentIndex = i;
        break;
      }
    }
    
    // Get next lessons
    for (let i = 1; i <= count && currentIndex + i < lessonIds.length; i++) {
      lessons.push({
        id: lessonIds[currentIndex + i],
        title: qaidaLessons[lessonIds[currentIndex + i]].title,
      });
    }
    
    return lessons;
  }

  // Get next Quran Surahs to download
  getNextQuranSurahs(currentSurah, count) {
    const surahs = [];
    const audioStructure = AudioDataService.getAudioDataStructure();
    const quranSurahs = audioStructure.quran.reciters.abdul_rahman_al_sudais.surahs;
    
    let currentIndex = -1;
    const surahIds = Object.keys(quranSurahs);
    
    // Find current surah index
    for (let i = 0; i < surahIds.length; i++) {
      if (surahIds[i] === currentSurah) {
        currentIndex = i;
        break;
      }
    }
    
    // Get next surahs
    for (let i = 1; i <= count && currentIndex + i < surahIds.length; i++) {
      surahs.push({
        id: surahIds[currentIndex + i],
        name: quranSurahs[surahIds[currentIndex + i]].name,
      });
    }
    
    return surahs;
  }

  // Cleanup old downloads
  async cleanupOldDownloads(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    try {
      const cacheSize = await AudioDataService.getCacheSize();
      const maxCacheSize = 500 * 1024 * 1024; // 500MB
      
      if (cacheSize > maxCacheSize) {
        console.log('Cache size exceeded, cleaning up old files...');
        // Implement cleanup logic here
        // This would remove old, unused audio files
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export default new AudioDownloadManager();
