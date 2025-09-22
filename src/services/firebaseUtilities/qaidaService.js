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
  // Get user progress
  getUserProgress: async (userId) => {
    try {
      const progress = await getDocumentById({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId 
      });
      return progress;
    } catch (error) {
      console.error('Error getting user progress:', error);
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
      const progress = await userProgressService.getUserProgress(userId);
      if (!progress) return null;

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

      const result = await updateDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: updateData 
      });
      return result;
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      return null;
    }
  },

  // Update segment progress
  updateSegmentProgress: async (userId, lessonId, segmentId, score = 0, errors = []) => {
    try {
      const progress = await userProgressService.getUserProgress(userId);
      if (!progress) return null;

      const currentProgress = progress.qaidaProgress || {};
      const lessonsProgress = currentProgress.lessonsProgress || {};
      const lessonProgress = lessonsProgress[lessonId] || {};
      const segmentsProgress = lessonProgress.segmentsProgress || {};
      const segmentProgress = segmentsProgress[segmentId] || {};

      const updateData = {
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.isCompleted`]: score >= 70, // 70% threshold
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.bestScore`]: Math.max(segmentProgress.bestScore || 0, score),
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.attempts`]: (segmentProgress.attempts || 0) + 1,
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.lastAttempted`]: new Date().toISOString(),
        [`qaidaProgress.lessonsProgress.${lessonId}.segmentsProgress.${segmentId}.errors`]: errors,
        updatedAt: new Date().toISOString()
      };

      const result = await updateDocument({ 
        collection: COLLECTIONS.USER_PROGRESS, 
        id: userId, 
        data: updateData 
      });
      return result;
    } catch (error) {
      console.error('Error updating segment progress:', error);
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
