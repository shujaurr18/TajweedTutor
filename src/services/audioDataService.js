// import storage from '@react-native-firebase/storage';
// import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';

class AudioDataService {
  constructor() {
    this.baseStoragePath = 'audio';
    this.localAudioPath = `${RNFS.DocumentDirectoryPath}/audio`;
    this.ensureLocalDirectory();
  }

  // Ensure local audio directory exists
  async ensureLocalDirectory() {
    try {
      const dirExists = await RNFS.exists(this.localAudioPath);
      if (!dirExists) {
        await RNFS.mkdir(this.localAudioPath);
        console.log('Created local audio directory:', this.localAudioPath);
      }
    } catch (error) {
      console.error('Error creating local audio directory:', error);
    }
  }

  // Audio data structure definitions
  getAudioDataStructure() {
    return {
      // Qaida Audio Structure
      qaida: {
        basePath: `${this.baseStoragePath}/qaida`,
        lessons: {
          // Lesson 1: Arabic Letters - Alif to Haa (First 6 letters)
          lesson_1: {
            id: 'lesson_1',
            title: 'Arabic Letters - Alif to Haa',
            segments: {
              alif: {
                id: 'alif',
                text: 'ا',
                transliteration: 'Alif',
                audioUrl: 'https://www.equranschool.com/learn-quran-online-free/snd/0201.mp3',
                localPath: `${this.localAudioPath}/qaida/lesson_1/alif.mp3`,
                duration: 3.0,
                tajweedRules: ['Makharij: Throat'],
                features: {
                  mfcc: [],
                  formants: [800, 1200, 2500, 3500],
                  energy: [],
                  pitch: [150],
                },
                expectedFeatures: {
                  // These will be extracted from the actual audio file
                  mfcc: [],
                  formants: [],
                  energy: [],
                  pitch: [],
                },
              },
              ba: {
                id: 'ba',
                text: 'ب',
                transliteration: 'Ba',
                audioUrl: 'https://www.equranschool.com/learn-quran-online-free/snd/0202.mp3',
                localPath: `${this.localAudioPath}/qaida/lesson_1/ba.mp3`,
                duration: 2.5,
                tajweedRules: ['Makharij: Lips'],
                features: {
                  mfcc: [],
                  formants: [600, 1000, 2400, 3400],
                  energy: [],
                  pitch: [200],
                },
                expectedFeatures: {
                  mfcc: [],
                  formants: [],
                  energy: [],
                  pitch: [],
                },
              },
              ta: {
                id: 'ta',
                text: 'ت',
                transliteration: 'Ta',
                audioUrl: 'https://www.equranschool.com/learn-quran-online-free/snd/0203.mp3',
                localPath: `${this.localAudioPath}/qaida/lesson_1/ta.mp3`,
                duration: 2.5,
                tajweedRules: ['Makharij: Tongue tip'],
                features: {
                  mfcc: [],
                  formants: [700, 1100, 2300, 3300],
                  energy: [],
                  pitch: [180],
                },
                expectedFeatures: {
                  mfcc: [],
                  formants: [],
                  energy: [],
                  pitch: [],
                },
              },
              tha: {
                id: 'tha',
                text: 'ث',
                transliteration: 'Tha',
                audioUrl: 'https://www.equranschool.com/learn-quran-online-free/snd/0204.mp3',
                localPath: `${this.localAudioPath}/qaida/lesson_1/tha.mp3`,
                duration: 2.5,
                tajweedRules: ['Makharij: Tongue tip'],
                features: {
                  mfcc: [],
                  formants: [750, 1150, 2350, 3350],
                  energy: [],
                  pitch: [190],
                },
                expectedFeatures: {
                  mfcc: [],
                  formants: [],
                  energy: [],
                  pitch: [],
                },
              },
              jeem: {
                id: 'jeem',
                text: 'ج',
                transliteration: 'Jeem',
                audioUrl: 'https://www.equranschool.com/learn-quran-online-free/snd/0205.mp3',
                localPath: `${this.localAudioPath}/qaida/lesson_1/jeem.mp3`,
                duration: 2.5,
                tajweedRules: ['Makharij: Middle of tongue'],
                features: {
                  mfcc: [],
                  formants: [650, 1050, 2450, 3450],
                  energy: [],
                  pitch: [170],
                },
                expectedFeatures: {
                  mfcc: [],
                  formants: [],
                  energy: [],
                  pitch: [],
                },
              },
              haa: {
                id: 'haa',
                text: 'ح',
                transliteration: 'Haa',
                audioUrl: 'https://www.equranschool.com/learn-quran-online-free/snd/0206.mp3',
                localPath: `${this.localAudioPath}/qaida/lesson_1/haa.mp3`,
                duration: 2.5,
                tajweedRules: ['Makharij: Throat'],
                features: {
                  mfcc: [],
                  formants: [900, 1300, 2600, 3600],
                  energy: [],
                  pitch: [160],
                },
                expectedFeatures: {
                  mfcc: [],
                  formants: [],
                  energy: [],
                  pitch: [],
                },
              },
            },
          },
          // Add more lessons...
        },
      },

      // Quran Audio Structure
      quran: {
        basePath: `${this.baseStoragePath}/quran`,
        reciters: {
          abdul_rahman_al_sudais: {
            id: 'abdul_rahman_al_sudais',
            name: 'Abdul Rahman Al-Sudais',
            nameArabic: 'عبد الرحمن السديس',
            surahs: {
              al_fatiha: {
                id: 'al_fatiha',
                surahNumber: 1,
                name: 'Al-Fatiha',
                nameArabic: 'الفاتحة',
                ayahs: {
                  ayah_1: {
                    id: 'ayah_1',
                    ayahNumber: 1,
                    text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
                    transliteration: 'Bismillahi ar-Rahman ar-Raheem',
                    audioUrl: `${this.baseStoragePath}/quran/abdul_rahman_al_sudais/surah_1/ayah_1.mp3`,
                    localPath: `${this.localAudioPath}/quran/abdul_rahman_al_sudais/surah_1/ayah_1.mp3`,
                    duration: 4.2,
                    segments: {
                      bismillah: {
                        text: 'بِسْمِ',
                        startTime: 0.0,
                        endTime: 1.2,
                        tajweedRules: ['Basmalah'],
                      },
                      allah: {
                        text: 'اللَّهِ',
                        startTime: 1.2,
                        endTime: 2.1,
                        tajweedRules: ['Allah'],
                      },
                      ar_rahman: {
                        text: 'الرَّحْمَٰنِ',
                        startTime: 2.1,
                        endTime: 3.0,
                        tajweedRules: ['Madd Asli'],
                      },
                      ar_raheem: {
                        text: 'الرَّحِيمِ',
                        startTime: 3.0,
                        endTime: 4.2,
                        tajweedRules: ['Madd Asli'],
                      },
                    },
                    features: {
                      mfcc: [],
                      formants: [],
                      energy: [],
                      pitch: [],
                    },
                  },
                  // Add more ayahs...
                },
              },
              // Add more surahs...
            },
          },
          // Add more reciters...
        },
      },

      // Reference Audio Sources
      referenceSources: {
        // Open source Quran audio
        quran_com: {
          name: 'Quran.com',
          baseUrl: 'https://verses.quran.com/',
          reciters: {
            abdul_rahman_al_sudais: 'Abdurrahmaan_As-Sudais_128kbps',
            mishary_rashid_alafasy: 'Alafasy_128kbps',
            saad_al_ghamdi: 'Saad_Al_Ghamdi_128kbps',
          },
          format: 'mp3',
          quality: '128kbps',
        },
        // Another source
        everyayah: {
          name: 'EveryAyah',
          baseUrl: 'https://everyayah.com/data/',
          reciters: {
            abdul_rahman_al_sudais: 'Abdurrahmaan_As-Sudais_128kbps',
            mishary_rashid_alafasy: 'Alafasy_128kbps',
          },
          format: 'mp3',
          quality: '128kbps',
        },
        // Qaida audio sources
        qaida_sources: {
          noorani_qaida: {
            name: 'Noorani Qaida Audio',
            baseUrl: 'https://example.com/qaida/',
            format: 'mp3',
            quality: '128kbps',
          },
        },
      },
    };
  }

  // Download audio from Firebase Storage (commented out for now)
  async downloadAudioFromFirebase(storagePath, localPath) {
    try {
      // For now, we'll use external URLs directly
      // const reference = storage().ref(storagePath);
      // const downloadUrl = await reference.getDownloadURL();
      
      // Since we're using external URLs, we'll skip Firebase Storage for now
      throw new Error('Firebase Storage not configured, using external URLs');
    } catch (error) {
      console.error('Error downloading audio from Firebase:', error);
      throw error;
    }
  }

  // Download audio from external source
  async downloadAudioFromSource(sourceUrl, localPath) {
    try {
      // Ensure the directory exists before downloading
      const dirPath = localPath.substring(0, localPath.lastIndexOf('/'));
      const dirExists = await RNFS.exists(dirPath);
      if (!dirExists) {
        await RNFS.mkdir(dirPath, { recursive: true });
        console.log('Created directory:', dirPath);
      }

      const downloadResult = await RNFS.downloadFile({
        fromUrl: sourceUrl,
        toFile: localPath,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(2)}%`);
        },
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('Audio downloaded successfully:', localPath);
        return localPath;
      } else {
        throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      console.error('Error downloading audio from source:', error);
      throw error;
    }
  }

  // Generate audio URL for external sources
  generateAudioUrl(reciter, surahNumber, ayahNumber, source = 'quran_com') {
    const sources = this.getAudioDataStructure().referenceSources;
    const sourceConfig = sources[source];
    
    if (!sourceConfig) {
      throw new Error(`Unknown audio source: ${source}`);
    }

    const reciterPath = sourceConfig.reciters[reciter];
    if (!reciterPath) {
      throw new Error(`Reciter ${reciter} not found in source ${source}`);
    }

    // Format: https://verses.quran.com/Abdurrahmaan_As-Sudais_128kbps/001001.mp3
    const ayahId = `${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}`;
    return `${sourceConfig.baseUrl}${reciterPath}/${ayahId}.${sourceConfig.format}`;
  }

  // Generate Qaida audio URL
  generateQaidaAudioUrl(lessonId, segmentId, source = 'qaida_sources') {
    const sources = this.getAudioDataStructure().referenceSources;
    const sourceConfig = sources[source];
    
    if (!sourceConfig) {
      throw new Error(`Unknown audio source: ${source}`);
    }

    // Format: https://example.com/qaida/lesson_1/alif.mp3
    return `${sourceConfig.baseUrl}${lessonId}/${segmentId}.${sourceConfig.format}`;
  }

  // Check if audio file exists locally
  async isAudioDownloaded(localPath) {
    try {
      return await RNFS.exists(localPath);
    } catch (error) {
      console.error('Error checking if audio exists:', error);
      return false;
    }
  }

  // Get local audio path
  getLocalAudioPath(type, ...pathSegments) {
    return `${this.localAudioPath}/${type}/${pathSegments.join('/')}.mp3`;
  }

  // Download Qaida lesson audio
  async downloadQaidaLesson(lessonId, segmentIds = []) {
    const audioStructure = this.getAudioDataStructure();
    const lesson = audioStructure.qaida.lessons[lessonId];
    
    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const downloadedFiles = [];
    const segmentsToDownload = segmentIds.length > 0 ? segmentIds : Object.keys(lesson.segments);

    for (const segmentId of segmentsToDownload) {
      const segment = lesson.segments[segmentId];
      if (!segment) continue;

      const localPath = segment.localPath;
      const isDownloaded = await this.isAudioDownloaded(localPath);

      if (!isDownloaded) {
        try {
          // Try to download from Firebase first
          await this.downloadAudioFromFirebase(segment.audioUrl, localPath);
          downloadedFiles.push(localPath);
        } catch (firebaseError) {
          console.log('Firebase download failed, trying external source...');
          try {
            // Fallback to external source
            const externalUrl = this.generateQaidaAudioUrl(lessonId, segmentId);
            await this.downloadAudioFromSource(externalUrl, localPath);
            downloadedFiles.push(localPath);
          } catch (externalError) {
            console.error(`Failed to download ${segmentId}:`, externalError);
          }
        }
      } else {
        console.log(`Audio already downloaded: ${segmentId}`);
        downloadedFiles.push(localPath);
      }
    }

    return downloadedFiles;
  }

  // Download Quran Surah audio
  async downloadQuranSurah(reciterId, surahId, ayahNumbers = []) {
    const audioStructure = this.getAudioDataStructure();
    const reciter = audioStructure.quran.reciters[reciterId];
    
    if (!reciter) {
      throw new Error(`Reciter ${reciterId} not found`);
    }

    const surah = reciter.surahs[surahId];
    if (!surah) {
      throw new Error(`Surah ${surahId} not found`);
    }

    const downloadedFiles = [];
    const ayahsToDownload = ayahNumbers.length > 0 ? ayahNumbers : Object.keys(surah.ayahs);

    for (const ayahId of ayahsToDownload) {
      const ayah = surah.ayahs[ayahId];
      if (!ayah) continue;

      const localPath = ayah.localPath;
      const isDownloaded = await this.isAudioDownloaded(localPath);

      if (!isDownloaded) {
        try {
          // Try to download from Firebase first
          await this.downloadAudioFromFirebase(ayah.audioUrl, localPath);
          downloadedFiles.push(localPath);
        } catch (firebaseError) {
          console.log('Firebase download failed, trying external source...');
          try {
            // Fallback to external source
            const externalUrl = this.generateAudioUrl(reciterId, surah.surahNumber, ayah.ayahNumber);
            await this.downloadAudioFromSource(externalUrl, localPath);
            downloadedFiles.push(localPath);
          } catch (externalError) {
            console.error(`Failed to download ${ayahId}:`, externalError);
          }
        }
      } else {
        console.log(`Audio already downloaded: ${ayahId}`);
        downloadedFiles.push(localPath);
      }
    }

    return downloadedFiles;
  }

  // Get audio file info
  async getAudioFileInfo(localPath) {
    try {
      const stats = await RNFS.stat(localPath);
      return {
        path: localPath,
        size: stats.size,
        isFile: stats.isFile(),
        mtime: stats.mtime,
        exists: true,
      };
    } catch (error) {
      return {
        path: localPath,
        exists: false,
        error: error.message,
      };
    }
  }

  // Clear downloaded audio cache
  async clearAudioCache() {
    try {
      const dirExists = await RNFS.exists(this.localAudioPath);
      if (dirExists) {
        await RNFS.unlink(this.localAudioPath);
        await this.ensureLocalDirectory();
        console.log('Audio cache cleared');
      }
    } catch (error) {
      console.error('Error clearing audio cache:', error);
    }
  }

  // Get cache size
  async getCacheSize() {
    try {
      const dirExists = await RNFS.exists(this.localAudioPath);
      if (!dirExists) return 0;

      const files = await RNFS.readDir(this.localAudioPath);
      let totalSize = 0;

      const calculateSize = async (items) => {
        for (const item of items) {
          if (item.isFile()) {
            totalSize += item.size;
          } else if (item.isDirectory()) {
            const subFiles = await RNFS.readDir(item.path);
            await calculateSize(subFiles);
          }
        }
      };

      await calculateSize(files);
      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new AudioDataService();
