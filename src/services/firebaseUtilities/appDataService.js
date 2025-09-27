import firestore from '@react-native-firebase/firestore';

// Collection names
const COLLECTIONS = {
  QAIDA_LESSONS: 'qaidaLessons',
  QURAN_SURAHS: 'quranSurahs',
  QURAN_AYAHS: 'quranAyahs',
  APP_CONFIG: 'appConfig',
  RECITERS: 'reciters',
};

class AppDataService {
  // Qaida Lessons
  async getQaidaLessons() {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.QAIDA_LESSONS)
        .orderBy('order', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching Qaida lessons:', error);
      throw error;
    }
  }

  async getQaidaLesson(lessonId) {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.QAIDA_LESSONS)
        .doc(lessonId)
        .get();
      
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Qaida lesson:', error);
      throw error;
    }
  }

  async createQaidaLesson(lessonData) {
    try {
      const docRef = await firestore()
        .collection(COLLECTIONS.QAIDA_LESSONS)
        .add({
          ...lessonData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating Qaida lesson:', error);
      throw error;
    }
  }

  async updateQaidaLesson(lessonId, updateData) {
    try {
      await firestore()
        .collection(COLLECTIONS.QAIDA_LESSONS)
        .doc(lessonId)
        .update({
          ...updateData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error updating Qaida lesson:', error);
      throw error;
    }
  }

  // Quran Surahs
  async getQuranSurahs() {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.QURAN_SURAHS)
        .orderBy('surahNumber', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching Quran Surahs:', error);
      throw error;
    }
  }

  async getQuranSurah(surahId) {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.QURAN_SURAHS)
        .doc(surahId)
        .get();
      
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Quran Surah:', error);
      throw error;
    }
  }

  // Quran Ayahs
  async getQuranAyahs(surahId) {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.QURAN_SURAHS)
        .doc(surahId)
        .collection(COLLECTIONS.QURAN_AYAHS)
        .orderBy('ayahNumber', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching Quran Ayahs:', error);
      throw error;
    }
  }

  async getQuranAyah(surahId, ayahNumber) {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.QURAN_SURAHS)
        .doc(surahId)
        .collection(COLLECTIONS.QURAN_AYAHS)
        .where('ayahNumber', '==', ayahNumber)
        .limit(1)
        .get();
      
      if (!doc.empty) {
        const ayahDoc = doc.docs[0];
        return {
          id: ayahDoc.id,
          ...ayahDoc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Quran Ayah:', error);
      throw error;
    }
  }

  // Reciters
  async getReciters() {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.RECITERS)
        .orderBy('name', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching reciters:', error);
      throw error;
    }
  }

  // App Configuration
  async getAppConfig() {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.APP_CONFIG)
        .doc('main')
        .get();
      
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching app config:', error);
      throw error;
    }
  }

  // Initialize sample data (for development)
  async initializeSampleData() {
    try {
      // Initialize Qaida lessons
      await this.initializeQaidaLessons();
      
      // Initialize Quran data
      await this.initializeQuranData();
      
      // Initialize reciters
      await this.initializeReciters();
      
      // Initialize app config
      await this.initializeAppConfig();
      
      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }

  async initializeQaidaLessons() {
    const qaidaLessons = [
      {
        title: 'Arabic Letters - Alif to Kha',
        description: 'Learn the first group of Arabic letters with proper pronunciation',
        order: 1,
        level: 1,
        arabicText: 'ا ب ت ث ج ح خ',
        transliteration: 'Alif, Ba, Ta, Tha, Jeem, Haa, Khaa',
        segments: [
          {
            id: 'segment_1',
            text: 'ا',
            transliteration: 'Alif',
            audioUrl: 'https://example.com/audio/qaida/lesson1/segment1.mp3',
            tajweedRules: ['Makharij: Throat'],
            order: 1,
          },
          {
            id: 'segment_2',
            text: 'ب',
            transliteration: 'Ba',
            audioUrl: 'https://example.com/audio/qaida/lesson1/segment2.mp3',
            tajweedRules: ['Makharij: Lips'],
            order: 2,
          },
          // Add more segments...
        ],
        isActive: true,
      },
      {
        title: 'Arabic Letters - Dal to Zay',
        description: 'Learn the second group of Arabic letters',
        order: 2,
        level: 1,
        arabicText: 'د ذ ر ز',
        transliteration: 'Dal, Dhal, Ra, Zay',
        segments: [
          {
            id: 'segment_1',
            text: 'د',
            transliteration: 'Dal',
            audioUrl: 'https://example.com/audio/qaida/lesson2/segment1.mp3',
            tajweedRules: ['Makharij: Tongue tip'],
            order: 1,
          },
          // Add more segments...
        ],
        isActive: true,
      },
      // Add more lessons...
    ];

    for (const lesson of qaidaLessons) {
      await this.createQaidaLesson(lesson);
    }
  }

  async initializeQuranData() {
    const surahs = [
      {
        surahNumber: 1,
        name: 'Al-Fatiha',
        nameArabic: 'الفاتحة',
        ayahCount: 7,
        juz: 1,
        revelationType: 'Meccan',
        description: 'The Opening - The first chapter of the Quran',
        isActive: true,
      },
      {
        surahNumber: 2,
        name: 'Al-Baqarah',
        nameArabic: 'البقرة',
        ayahCount: 286,
        juz: 1,
        revelationType: 'Medinan',
        description: 'The Cow - The longest chapter of the Quran',
        isActive: true,
      },
      // Add more Surahs...
    ];

    for (const surah of surahs) {
      const surahRef = await firestore()
        .collection(COLLECTIONS.QURAN_SURAHS)
        .add({
          ...surah,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Add sample Ayahs for each Surah
      if (surah.surahNumber === 1) {
        const ayahs = [
          {
            ayahNumber: 1,
            arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
            transliteration: 'Bismillahi ar-Rahman ar-Raheem',
            audioUrl: 'https://example.com/audio/quran/surah1/ayah1.mp3',
            tajweedRules: ['Basmalah'],
            segments: [
              {
                text: 'بِسْمِ',
                startTime: 0,
                endTime: 1.5,
                tajweedRules: ['Basmalah'],
              },
              {
                text: 'اللَّهِ',
                startTime: 1.5,
                endTime: 3.0,
                tajweedRules: ['Allah'],
              },
              // Add more segments...
            ],
          },
          // Add more Ayahs...
        ];

        for (const ayah of ayahs) {
          await surahRef.collection(COLLECTIONS.QURAN_AYAHS).add({
            ...ayah,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }
  }

  async initializeReciters() {
    const reciters = [
      {
        name: 'Abdul Rahman Al-Sudais',
        nameArabic: 'عبد الرحمن السديس',
        country: 'Saudi Arabia',
        style: 'Traditional',
        audioQuality: 'High',
        isActive: true,
        description: 'Imam of the Grand Mosque in Mecca',
      },
      {
        name: 'Mishary Rashid Alafasy',
        nameArabic: 'مشاري راشد العفاسي',
        country: 'Kuwait',
        style: 'Modern',
        audioQuality: 'High',
        isActive: true,
        description: 'Popular contemporary reciter',
      },
      // Add more reciters...
    ];

    for (const reciter of reciters) {
      await firestore()
        .collection(COLLECTIONS.RECITERS)
        .add({
          ...reciter,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    }
  }

  async initializeAppConfig() {
    const appConfig = {
      version: '1.0.0',
      features: {
        qaidaEnabled: true,
        quranEnabled: true,
        tajweedFeedback: true,
        offlineMode: true,
        subscriptionRequired: false,
      },
      settings: {
        defaultReciter: 'Abdul Rahman Al-Sudais',
        defaultLanguage: 'English',
        feedbackSensitivity: 'medium',
        autoPlay: false,
      },
      limits: {
        freeQaidaLessons: 5,
        freeQuranSurahs: 3,
        maxOfflineDownloads: 10,
      },
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    };

    await firestore()
      .collection(COLLECTIONS.APP_CONFIG)
      .doc('main')
      .set(appConfig);
  }
}

export default new AppDataService();
