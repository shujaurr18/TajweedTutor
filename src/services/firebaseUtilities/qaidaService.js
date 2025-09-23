import { 
  setDocument, 
  getDocumentById, 
  updateDocument, 
  getDocuments,
  getDocumentSnapshotById 
} from './firestore';
import { qaidaLessons, userProgressStructure } from '../qaidaData';

// Collection names
const COLLECTIONS = {
  QAIDA_LESSONS: 'qaida_lessons',
  USER_PROGRESS: 'user_progress'
};

// Qaida Lessons Service
export const qaidaService = {
  // Get all Qaida lessons
  getAllLessons: async () => {
    try {
      const lessons = await getDocuments({ collection: COLLECTIONS.QAIDA_LESSONS });
      return lessons;
    } catch (error) {
      console.error('Error getting Qaida lessons:', error);
      return [];
    }
  },

  // Get a specific lesson by ID
  getLessonById: async (lessonId) => {
    try {
      const lesson = await getDocumentById({ 
        collection: COLLECTIONS.QAIDA_LESSONS, 
        id: lessonId 
      });
      return lesson;
    } catch (error) {
      console.error('Error getting lesson by ID:', error);
      return null;
    }
  },

  // Get lesson with real-time updates
  getLessonSnapshot: (lessonId, callback) => {
    try {
      getDocumentSnapshotById({ 
        collection: COLLECTIONS.QAIDA_LESSONS, 
        id: lessonId, 
        callback 
      });
    } catch (error) {
      console.error('Error getting lesson snapshot:', error);
    }
  },

  // Initialize Qaida lessons in Firestore (for first time setup)
  initializeLessons: async () => {
    try {
      const promises = qaidaLessons.map(lesson => 
        setDocument({ 
          collection: COLLECTIONS.QAIDA_LESSONS, 
          id: lesson.id, 
          data: lesson 
        })
      );
      
      await Promise.all(promises);
      console.log('Qaida lessons initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Qaida lessons:', error);
      return false;
    }
  },

  // Update lesson (for admin purposes)
  updateLesson: async (lessonId, data) => {
    try {
      const result = await updateDocument({ 
        collection: COLLECTIONS.QAIDA_LESSONS, 
        id: lessonId, 
        data 
      });
      return result;
    } catch (error) {
      console.error('Error updating lesson:', error);
      return null;
    }
  }
};

// User Progress Service
export const userProgressService = {
  // Get user progress with retry logic
  getUserProgress: async (userId, retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    try {
      console.log(`Getting user progress for ${userId} (attempt ${retryCount + 1})`);
      const progress = await getDocumentById({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId 
      });
      console.log('User progress retrieved successfully:', progress);
      return progress;
    } catch (error) {
      console.error(`Error getting user progress (attempt ${retryCount + 1}):`, error);
      
      // If it's a transient error and we haven't exceeded max retries, retry
      if (error.code === 'firestore/unavailable' && retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return userProgressService.getUserProgress(userId, retryCount + 1);
      }
      
      // If it's not a transient error or we've exceeded retries, return null
      console.error('Failed to get user progress after retries');
      return null;
    }
  },

  // Get user progress with real-time updates
  getUserProgressSnapshot: (userId, callback) => {
    try {
      getDocumentSnapshotById({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        callback 
      });
    } catch (error) {
      console.error('Error getting user progress snapshot:', error);
    }
  },

  // Initialize user progress (for new users)
  initializeUserProgress: async (userId) => {
    try {
      const progressData = {
        ...userProgressStructure,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await setDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: progressData 
      });
      return result;
    } catch (error) {
      console.error('Error initializing user progress:', error);
      return null;
    }
  },

  // Update user's current lesson
  updateCurrentLesson: async (userId, lessonId) => {
    try {
      const updateData = {
        'qaidaProgress.currentLesson': lessonId,
        'qaidaProgress.lastAttemptedLesson': lessonId,
        updatedAt: new Date().toISOString()
      };

      const result = await updateDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: updateData 
      });
      return result;
    } catch (error) {
      console.error('Error updating current lesson:', error);
      return null;
    }
  },

  // Mark lesson as completed
  markLessonCompleted: async (userId, lessonId, score = 0) => {
    try {
      console.log('markLessonCompleted called with:', { userId, lessonId, score });
      
      let progress = await userProgressService.getUserProgress(userId);
      console.log('Existing progress for lesson completion:', progress);
      
      // If no progress exists, create it with lesson completion data
      if (!progress) {
        console.log('No progress found for lesson completion, creating new progress document...');
        
        const newProgressData = {
          ...userProgressStructure,
          userId,
          qaidaProgress: {
            ...userProgressStructure.qaidaProgress,
            completedLessons: [lessonId],
            lessonsProgress: {
              [lessonId]: {
                isCompleted: true,
                attempts: 1,
                bestScore: score,
                lastAttempted: new Date().toISOString(),
                timeSpent: 0,
                segmentsProgress: {}
              }
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('Creating new progress document for lesson completion:', newProgressData);

        const result = await setDocument({ 
          collection: COLLECTIONS.USER_PROGRESS, 
          id: userId, 
          data: newProgressData 
        });
        
        console.log('New progress document created for lesson completion:', result);
        return result;
      }

      // If progress exists, update it
      const currentProgress = progress.qaidaProgress || {};
      const completedLessons = currentProgress.completedLessons || [];
      
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      const lessonsProgress = currentProgress.lessonsProgress || {};
      const lessonProgress = lessonsProgress[lessonId] || {};
      
      const updateData = {
        [`qaidaProgress.completedLessons`]: completedLessons,
        [`qaidaProgress.lessonsProgress.${lessonId}.isCompleted`]: true,
        [`qaidaProgress.lessonsProgress.${lessonId}.bestScore`]: Math.max(lessonProgress.bestScore || 0, score),
        [`qaidaProgress.lessonsProgress.${lessonId}.lastAttempted`]: new Date().toISOString(),
        [`qaidaProgress.lessonsProgress.${lessonId}.attempts`]: (lessonProgress.attempts || 0) + 1,
        updatedAt: new Date().toISOString()
      };

      console.log('Lesson completion update data:', updateData);

      const result = await updateDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: updateData 
      });
      
      console.log('Lesson completion result:', result);
      return result;
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      return null;
    }
  },

  // Update segment progress with retry logic
  updateSegmentProgress: async (userId, lessonId, segmentId, score = 0, errors = [], retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 1000;
    
    try {
      console.log('updateSegmentProgress called with:', { userId, lessonId, segmentId, score });
      
      let progress = await userProgressService.getUserProgress(userId);
      console.log('Existing progress:', progress);
      
      // If no progress exists, create it with the segment data
      if (!progress) {
        console.log('No progress found, creating new progress document...');
        
        const newProgressData = {
          ...userProgressStructure,
          userId,
          qaidaProgress: {
            ...userProgressStructure.qaidaProgress,
            lessonsProgress: {
              [lessonId]: {
                isCompleted: false,
                attempts: 1,
                bestScore: score,
                lastAttempted: new Date().toISOString(),
                timeSpent: 0,
                segmentsProgress: {
                  [segmentId]: {
                    isCompleted: true,
                    attempts: 1,
                    bestScore: score,
                    lastAttempted: new Date().toISOString(),
                    errors: errors
                  }
                }
              }
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('Creating new progress document:', newProgressData);

        const result = await setDocument({ 
          collection: COLLECTIONS.USER_PROGRESS, 
          id: userId, 
          data: newProgressData 
        });
        
        console.log('New progress document created:', result);
        return result;
      }

      // If progress exists, update it
      const currentProgress = progress.qaidaProgress || {};
      const lessonsProgress = currentProgress.lessonsProgress || {};
      const lessonProgress = lessonsProgress[lessonId] || {};
      const segmentsProgress = lessonProgress.segmentsProgress || {};
      const segmentProgress = segmentsProgress[segmentId] || {};

      const updateData = {
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.isCompleted`]: true,
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.bestScore`]: Math.max(segmentProgress.bestScore || 0, score),
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.attempts`]: (segmentProgress.attempts || 0) + 1,
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.lastAttempted`]: new Date().toISOString(),
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.errors`]: errors,
        updatedAt: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      const result = await updateDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: updateData 
      });
      
      console.log('Update result:', result);
      return result;
    } catch (error) {
      console.error(`Error updating segment progress (attempt ${retryCount + 1}):`, error);
      
      // If it's a transient error and we haven't exceeded max retries, retry
      if (error.code === 'firestore/unavailable' && retryCount < maxRetries) {
        console.log(`Retrying segment progress update in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return userProgressService.updateSegmentProgress(userId, lessonId, segmentId, score, errors, retryCount + 1);
      }
      
      console.error('Failed to update segment progress after retries');
      return null;
    }
  },

  // Update total time spent
  updateTimeSpent: async (userId, timeSpent) => {
    try {
      const updateData = {
        'qaidaProgress.totalTimeSpent': timeSpent,
        updatedAt: new Date().toISOString()
      };

      const result = await updateDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: updateData 
      });
      return result;
    } catch (error) {
      console.error('Error updating time spent:', error);
      return null;
    }
  },

  // Get user's next lesson
  getNextLesson: async (userId) => {
    try {
      const progress = await userProgressService.getUserProgress(userId);
      if (!progress) return null;

      const currentLesson = progress.qaidaProgress?.currentLesson || 'lesson_1';
      const completedLessons = progress.qaidaProgress?.completedLessons || [];
      
      // Find the next lesson that's not completed
      const currentIndex = qaidaLessons.findIndex(lesson => lesson.id === currentLesson);
      const nextLesson = qaidaLessons.find((lesson, index) => 
        index > currentIndex && !completedLessons.includes(lesson.id)
      );

      return nextLesson || null;
    } catch (error) {
      console.error('Error getting next lesson:', error);
      return null;
    }
  },

  // Get user's progress statistics
  getProgressStats: async (userId) => {
    try {
      const progress = await userProgressService.getUserProgress(userId);
      if (!progress) return null;

      const qaidaProgress = progress.qaidaProgress || {};
      const completedLessons = qaidaProgress.completedLessons || [];
      const totalLessons = qaidaLessons.length;
      const completionPercentage = (completedLessons.length / totalLessons) * 100;

      return {
        totalLessons,
        completedLessons: completedLessons.length,
        completionPercentage: Math.round(completionPercentage),
        currentLesson: qaidaProgress.currentLesson,
        totalTimeSpent: qaidaProgress.totalTimeSpent || 0,
        averageScore: qaidaProgress.averageScore || 0
      };
    } catch (error) {
      console.error('Error getting progress stats:', error);
      return null;
    }
  }
};

export default {
  qaidaService,
  userProgressService,
  COLLECTIONS
};
