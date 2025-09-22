// Noorani Qaida Sample Data Structure
// This file contains sample data for Noorani Qaida lessons

export const qaidaLessons = [
  {
    id: 'lesson_1',
    title: 'Lesson 1: Arabic Letters - Alif to Tha',
    description: 'Learn the first 8 Arabic letters with proper pronunciation',
    level: 1,
    order: 1,
    arabicText: 'ا ب ت ث ج ح خ د',
    transliteration: 'Alif Ba Ta Tha Jeem Ha Kha Dal',
    audioUrl: 'qaida/lesson_1_full.mp3', // Full lesson audio
    segments: [
      {
        id: 'seg_1_1',
        text: 'ا',
        transliteration: 'Alif',
        audioUrl: 'qaida/lesson_1_alif.mp3',
        startTime: 0,
        endTime: 2,
        tajweedRules: ['Makharij: From the throat']
      },
      {
        id: 'seg_1_2',
        text: 'ب',
        transliteration: 'Ba',
        audioUrl: 'qaida/lesson_1_ba.mp3',
        startTime: 2,
        endTime: 4,
        tajweedRules: ['Makharij: From the lips']
      },
      {
        id: 'seg_1_3',
        text: 'ت',
        transliteration: 'Ta',
        audioUrl: 'qaida/lesson_1_ta.mp3',
        startTime: 4,
        endTime: 6,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_1_4',
        text: 'ث',
        transliteration: 'Tha',
        audioUrl: 'qaida/lesson_1_tha.mp3',
        startTime: 6,
        endTime: 8,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_1_5',
        text: 'ج',
        transliteration: 'Jeem',
        audioUrl: 'qaida/lesson_1_jeem.mp3',
        startTime: 8,
        endTime: 10,
        tajweedRules: ['Makharij: From the middle of tongue touching palate']
      },
      {
        id: 'seg_1_6',
        text: 'ح',
        transliteration: 'Ha',
        audioUrl: 'qaida/lesson_1_ha.mp3',
        startTime: 10,
        endTime: 12,
        tajweedRules: ['Makharij: From the middle of throat']
      },
      {
        id: 'seg_1_7',
        text: 'خ',
        transliteration: 'Kha',
        audioUrl: 'qaida/lesson_1_kha.mp3',
        startTime: 12,
        endTime: 14,
        tajweedRules: ['Makharij: From the deepest part of throat']
      },
      {
        id: 'seg_1_8',
        text: 'د',
        transliteration: 'Dal',
        audioUrl: 'qaida/lesson_1_dal.mp3',
        startTime: 14,
        endTime: 16,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      }
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson_2',
    title: 'Lesson 2: Arabic Letters - Dhal to Zay',
    description: 'Learn the next 8 Arabic letters with proper pronunciation',
    level: 1,
    order: 2,
    arabicText: 'ذ ر ز س ش ص ض',
    transliteration: 'Dhal Ra Zay Seen Sheen Sad Dad',
    audioUrl: 'qaida/lesson_2_full.mp3',
    segments: [
      {
        id: 'seg_2_1',
        text: 'ذ',
        transliteration: 'Dhal',
        audioUrl: 'qaida/lesson_2_dhal.mp3',
        startTime: 0,
        endTime: 2,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_2_2',
        text: 'ر',
        transliteration: 'Ra',
        audioUrl: 'qaida/lesson_2_ra.mp3',
        startTime: 2,
        endTime: 4,
        tajweedRules: ['Makharij: From the tip of tongue touching upper palate']
      },
      {
        id: 'seg_2_3',
        text: 'ز',
        transliteration: 'Zay',
        audioUrl: 'qaida/lesson_2_zay.mp3',
        startTime: 4,
        endTime: 6,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_2_4',
        text: 'س',
        transliteration: 'Seen',
        audioUrl: 'qaida/lesson_2_seen.mp3',
        startTime: 6,
        endTime: 8,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_2_5',
        text: 'ش',
        transliteration: 'Sheen',
        audioUrl: 'qaida/lesson_2_sheen.mp3',
        startTime: 8,
        endTime: 10,
        tajweedRules: ['Makharij: From the middle of tongue touching palate']
      },
      {
        id: 'seg_2_6',
        text: 'ص',
        transliteration: 'Sad',
        audioUrl: 'qaida/lesson_2_sad.mp3',
        startTime: 10,
        endTime: 12,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_2_7',
        text: 'ض',
        transliteration: 'Dad',
        audioUrl: 'qaida/lesson_2_dad.mp3',
        startTime: 12,
        endTime: 14,
        tajweedRules: ['Makharij: From the side of tongue touching upper molars']
      }
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson_3',
    title: 'Lesson 3: Arabic Letters - Ta to Ghayn',
    description: 'Learn the next 8 Arabic letters with proper pronunciation',
    level: 1,
    order: 3,
    arabicText: 'ط ظ ع غ ف ق ك ل',
    transliteration: 'Ta Za Ain Ghayn Fa Qaf Kaf Lam',
    audioUrl: 'qaida/lesson_3_full.mp3',
    segments: [
      {
        id: 'seg_3_1',
        text: 'ط',
        transliteration: 'Ta',
        audioUrl: 'qaida/lesson_3_ta.mp3',
        startTime: 0,
        endTime: 2,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_3_2',
        text: 'ظ',
        transliteration: 'Za',
        audioUrl: 'qaida/lesson_3_za.mp3',
        startTime: 2,
        endTime: 4,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth']
      },
      {
        id: 'seg_3_3',
        text: 'ع',
        transliteration: 'Ain',
        audioUrl: 'qaida/lesson_3_ain.mp3',
        startTime: 4,
        endTime: 6,
        tajweedRules: ['Makharij: From the middle of throat']
      },
      {
        id: 'seg_3_4',
        text: 'غ',
        transliteration: 'Ghayn',
        audioUrl: 'qaida/lesson_3_ghayn.mp3',
        startTime: 6,
        endTime: 8,
        tajweedRules: ['Makharij: From the deepest part of throat']
      },
      {
        id: 'seg_3_5',
        text: 'ف',
        transliteration: 'Fa',
        audioUrl: 'qaida/lesson_3_fa.mp3',
        startTime: 8,
        endTime: 10,
        tajweedRules: ['Makharij: From the lower lip touching upper teeth']
      },
      {
        id: 'seg_3_6',
        text: 'ق',
        transliteration: 'Qaf',
        audioUrl: 'qaida/lesson_3_qaf.mp3',
        startTime: 10,
        endTime: 12,
        tajweedRules: ['Makharij: From the deepest part of throat']
      },
      {
        id: 'seg_3_7',
        text: 'ك',
        transliteration: 'Kaf',
        audioUrl: 'qaida/lesson_3_kaf.mp3',
        startTime: 12,
        endTime: 14,
        tajweedRules: ['Makharij: From the back of tongue touching palate']
      },
      {
        id: 'seg_3_8',
        text: 'ل',
        transliteration: 'Lam',
        audioUrl: 'qaida/lesson_3_lam.mp3',
        startTime: 14,
        endTime: 16,
        tajweedRules: ['Makharij: From the tip of tongue touching upper palate']
      }
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson_4',
    title: 'Lesson 4: Arabic Letters - Mim to Ya',
    description: 'Learn the final 8 Arabic letters with proper pronunciation',
    level: 1,
    order: 4,
    arabicText: 'م ن و ه ي',
    transliteration: 'Mim Nun Waw Ha Ya',
    audioUrl: 'qaida/lesson_4_full.mp3',
    segments: [
      {
        id: 'seg_4_1',
        text: 'م',
        transliteration: 'Mim',
        audioUrl: 'qaida/lesson_4_mim.mp3',
        startTime: 0,
        endTime: 2,
        tajweedRules: ['Makharij: From the lips', 'Ghunna: Nasal sound']
      },
      {
        id: 'seg_4_2',
        text: 'ن',
        transliteration: 'Nun',
        audioUrl: 'qaida/lesson_4_nun.mp3',
        startTime: 2,
        endTime: 4,
        tajweedRules: ['Makharij: From the tip of tongue touching upper teeth', 'Ghunna: Nasal sound']
      },
      {
        id: 'seg_4_3',
        text: 'و',
        transliteration: 'Waw',
        audioUrl: 'qaida/lesson_4_waw.mp3',
        startTime: 4,
        endTime: 6,
        tajweedRules: ['Makharij: From the lips']
      },
      {
        id: 'seg_4_4',
        text: 'ه',
        transliteration: 'Ha',
        audioUrl: 'qaida/lesson_4_ha.mp3',
        startTime: 6,
        endTime: 8,
        tajweedRules: ['Makharij: From the middle of throat']
      },
      {
        id: 'seg_4_5',
        text: 'ي',
        transliteration: 'Ya',
        audioUrl: 'qaida/lesson_4_ya.mp3',
        startTime: 8,
        endTime: 10,
        tajweedRules: ['Makharij: From the middle of tongue touching palate']
      }
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson_5',
    title: 'Lesson 5: Short Vowels - Fatha, Kasra, Damma',
    description: 'Learn the three short vowels and their sounds',
    level: 2,
    order: 5,
    arabicText: 'بَ بِ بُ',
    transliteration: 'Ba Bi Bu',
    audioUrl: 'qaida/lesson_5_full.mp3',
    segments: [
      {
        id: 'seg_5_1',
        text: 'بَ',
        transliteration: 'Ba',
        audioUrl: 'qaida/lesson_5_ba_fatha.mp3',
        startTime: 0,
        endTime: 2,
        tajweedRules: ['Fatha: Short vowel sound "a"']
      },
      {
        id: 'seg_5_2',
        text: 'بِ',
        transliteration: 'Bi',
        audioUrl: 'qaida/lesson_5_bi_kasra.mp3',
        startTime: 2,
        endTime: 4,
        tajweedRules: ['Kasra: Short vowel sound "i"']
      },
      {
        id: 'seg_5_3',
        text: 'بُ',
        transliteration: 'Bu',
        audioUrl: 'qaida/lesson_5_bu_damma.mp3',
        startTime: 4,
        endTime: 6,
        tajweedRules: ['Damma: Short vowel sound "u"']
      }
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson_6',
    title: 'Lesson 6: Long Vowels - Alif, Ya, Waw',
    description: 'Learn the long vowels and their sounds',
    level: 2,
    order: 6,
    arabicText: 'بَا بِي بُو',
    transliteration: 'Baa Bii Buu',
    audioUrl: 'qaida/lesson_6_full.mp3',
    segments: [
      {
        id: 'seg_6_1',
        text: 'بَا',
        transliteration: 'Baa',
        audioUrl: 'qaida/lesson_6_baa.mp3',
        startTime: 0,
        endTime: 3,
        tajweedRules: ['Long vowel: Alif makes "aa" sound']
      },
      {
        id: 'seg_6_2',
        text: 'بِي',
        transliteration: 'Bii',
        audioUrl: 'qaida/lesson_6_bii.mp3',
        startTime: 3,
        endTime: 6,
        tajweedRules: ['Long vowel: Ya makes "ii" sound']
      },
      {
        id: 'seg_6_3',
        text: 'بُو',
        transliteration: 'Buu',
        audioUrl: 'qaida/lesson_6_buu.mp3',
        startTime: 6,
        endTime: 9,
        tajweedRules: ['Long vowel: Waw makes "uu" sound']
      }
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// User Progress Structure
export const userProgressStructure = {
  userId: '',
  qaidaProgress: {
    currentLesson: 'lesson_1',
    completedLessons: [],
    lastAttemptedLesson: 'lesson_1',
    totalTimeSpent: 0,
    averageScore: 0,
    lessonsProgress: {
      // lessonId: {
      //   isCompleted: false,
      //   attempts: 0,
      //   bestScore: 0,
      //   lastAttempted: '',
      //   timeSpent: 0,
      //   segmentsProgress: {
      //     // segmentId: {
      //     //   isCompleted: false,
      //     //   attempts: 0,
      //     //   bestScore: 0,
      //     //   errors: []
      //     // }
      //   }
      // }
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Tajweed Rules Reference
export const tajweedRules = {
  makharij: {
    throat: ['ا', 'ه', 'ع', 'ح', 'غ', 'خ'],
    tongue: ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'],
    lips: ['ب', 'م', 'و', 'ف'],
    nose: ['م', 'ن']
  },
  sifaat: {
    qalqalah: ['ق', 'ط', 'ب', 'ج', 'د'],
    ghunna: ['م', 'ن'],
    madd: ['ا', 'ي', 'و']
  }
};

export default {
  qaidaLessons,
  userProgressStructure,
  tajweedRules
};
