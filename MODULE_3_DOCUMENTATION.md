# Module 3: Native Audio Processing - Foundations

## Overview
This module implements the core native audio processing functionality for the Tajweed Tutor app, focusing on Android platform. It provides audio feature extraction, comparison algorithms, and Tajweed analysis capabilities.

## 🏗️ Architecture

### Native Module Structure
```
android/
├── app/src/main/
│   ├── java/com/tajweedtutor/
│   │   ├── TajweedAudioModule.java      # Main native module
│   │   ├── TajweedAudioPackage.java     # React Native package
│   │   └── MainApplication.kt           # App registration
│   └── cpp/
│       ├── tajweed_audio.h              # C++ header
│       ├── tajweed_audio.cpp            # C++ implementation
│       └── CMakeLists.txt               # Build configuration
```

### React Native Bridge
```
src/services/nativeModules/
└── TajweedAudioModule.js                # JavaScript bridge
```

## 🔧 Core Features Implemented

### 1. Audio Feature Extraction
- **MFCC (Mel-Frequency Cepstral Coefficients)**: 13 coefficients for speech recognition
- **Formants**: F1, F2, F3, F4 for vowel identification
- **Energy**: Signal energy analysis for pronunciation strength
- **Pitch**: Fundamental frequency detection for tone analysis
- **Spectral Centroid**: Brightness of sound
- **Spectral Rolloff**: Frequency distribution analysis

### 2. Audio Comparison Algorithms
- **Dynamic Time Warping (DTW)**: Aligns audio sequences of different lengths
- **Euclidean Distance**: Basic similarity measurement
- **Cosine Similarity**: Angle-based similarity
- **Feature-based Comparison**: Multi-dimensional analysis

### 3. Tajweed Rule Detection
- **Madd (Prolongation)**: Detects vowel elongation
- **Makharij (Articulation Points)**: Identifies pronunciation points
- **Ghunna (Nasalization)**: Detects nasal sounds
- **Qalqalah (Bouncing)**: Identifies bouncing consonants

## 📱 Usage Examples

### Basic Feature Extraction
```javascript
import TajweedAudioModule from '../services/nativeModules/TajweedAudioModule';

// Extract features from audio file
const features = await TajweedAudioModule.extractFeatures('/path/to/audio.mp3');
console.log('MFCC Features:', features.features);
console.log('Feature Count:', features.featureCount);
```

### Audio Similarity Calculation
```javascript
// Compare two audio files
const similarity = await TajweedAudioModule.calculateSimilarity(
  '/path/to/user_recording.mp3',
  '/path/to/reference_audio.mp3'
);
console.log('Similarity Score:', similarity.score);
```

### Tajweed Analysis
```javascript
// Analyze Tajweed between user and reference
const analysis = await TajweedAudioModule.analyzeTajweed(
  '/path/to/user_recording.mp3',
  '/path/to/reference_audio.mp3'
);
console.log('Overall Score:', analysis.score);
console.log('Errors:', analysis.errors);
console.log('Suggestions:', analysis.suggestions);
```

### Rule Detection
```javascript
// Detect specific Tajweed rules
const rules = {
  madd: true,
  makharij: true,
  ghunna: true,
  qalqalah: true
};

const result = await TajweedAudioModule.detectTajweedRules(
  '/path/to/audio.mp3',
  rules
);
console.log('Detected Rules:', result.detectedRules);
```

## 🎵 Audio Data Structure

### Qaida Audio Structure
```javascript
{
  qaida: {
    lessons: {
      lesson_1: {
        id: 'lesson_1',
        title: 'Arabic Letters - Alif to Kha',
        segments: {
          alif: {
            id: 'alif',
            text: 'ا',
            transliteration: 'Alif',
            audioUrl: 'firebase/path/to/alif.mp3',
            localPath: '/local/path/to/alif.mp3',
            duration: 2.5,
            tajweedRules: ['Makharij: Throat'],
            features: {
              mfcc: [/* 13 coefficients */],
              formants: [800, 1200, 2500, 3500],
              energy: [/* energy values */],
              pitch: [150]
            }
          }
        }
      }
    }
  }
}
```

### Quran Audio Structure
```javascript
{
  quran: {
    reciters: {
      abdul_rahman_al_sudais: {
        id: 'abdul_rahman_al_sudais',
        name: 'Abdul Rahman Al-Sudais',
        surahs: {
          al_fatiha: {
            id: 'al_fatiha',
            surahNumber: 1,
            name: 'Al-Fatiha',
            ayahs: {
              ayah_1: {
                id: 'ayah_1',
                ayahNumber: 1,
                text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                audioUrl: 'firebase/path/to/ayah_1.mp3',
                localPath: '/local/path/to/ayah_1.mp3',
                duration: 4.2,
                segments: {
                  bismillah: {
                    text: 'بِسْمِ',
                    startTime: 0.0,
                    endTime: 1.2,
                    tajweedRules: ['Basmalah']
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 🌐 Audio Sources

### Open Source Quran Audio
1. **Quran.com** (https://verses.quran.com/)
   - Reciters: Abdul Rahman Al-Sudais, Mishary Rashid Alafasy, Saad Al-Ghamdi
   - Format: MP3, 128kbps
   - URL Format: `https://verses.quran.com/Abdurrahmaan_As-Sudais_128kbps/001001.mp3`

2. **EveryAyah** (https://everyayah.com/)
   - Multiple reciters available
   - High quality audio files
   - Free to use

3. **Quran Audio** (https://quranaudio.com/)
   - Professional recordings
   - Multiple formats and qualities

### Qaida Audio Sources
1. **Noorani Qaida Audio**
   - Professional pronunciation
   - Letter-by-letter breakdown
   - Available on various Islamic education websites

2. **Islamic Audio Libraries**
   - Many mosques and Islamic centers provide free Qaida audio
   - Can be downloaded and used for educational purposes

## 📥 Download Management

### Audio Download Service
```javascript
import AudioDataService from '../services/audioDataService';

// Download Qaida lesson
const files = await AudioDataService.downloadQaidaLesson('lesson_1', ['alif', 'ba']);

// Download Quran Surah
const files = await AudioDataService.downloadQuranSurah(
  'abdul_rahman_al_sudais',
  'al_fatiha',
  ['ayah_1', 'ayah_2']
);

// Check if audio is downloaded
const isDownloaded = await AudioDataService.isAudioDownloaded('/path/to/audio.mp3');
```

### Download Manager
```javascript
import AudioDownloadManager from '../services/audioDownloadManager';

// Add to download queue
AudioDownloadManager.addToQueue({
  type: 'qaida',
  id: 'lesson_1',
  lessonId: 'lesson_1',
  segmentIds: ['alif', 'ba'],
  priority: 'high'
});

// Download popular content
await AudioDownloadManager.downloadPopularContent();

// Get download status
const status = AudioDownloadManager.getDownloadStatus();
```

## 🔧 Build Configuration

### Android Build.gradle
```gradle
android {
    defaultConfig {
        ndk {
            abiFilters "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
        
        externalNativeBuild {
            cmake {
                cppFlags "-std=c++17", "-frtti", "-fexceptions"
                arguments "-DANDROID_STL=c++_shared"
            }
        }
    }
    
    externalNativeBuild {
        cmake {
            path "src/main/cpp/CMakeLists.txt"
            version "3.22.1"
        }
    }
}
```

### CMakeLists.txt
```cmake
cmake_minimum_required(VERSION 3.13)
project(tajweed_audio)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_library(log-lib log)
find_library(android-lib android)

add_library(tajweed_audio SHARED tajweed_audio.cpp)
target_link_libraries(tajweed_audio ${log-lib} ${android-lib})
```

## 🚀 Performance Considerations

### Optimization Strategies
1. **Feature Caching**: Store extracted features to avoid recomputation
2. **Batch Processing**: Process multiple audio files in batches
3. **Memory Management**: Efficient handling of audio buffers
4. **Background Processing**: Use background threads for heavy computations

### Memory Usage
- **Audio Buffer**: ~1MB per 10 seconds of audio (44.1kHz, 16-bit)
- **Feature Vectors**: ~1KB per audio file
- **MFCC Coefficients**: 13 × 4 bytes = 52 bytes per frame

## 🧪 Testing

### Unit Tests
```javascript
// Test feature extraction
describe('TajweedAudioModule', () => {
  it('should extract audio features', async () => {
    const features = await TajweedAudioModule.extractFeatures(testAudioPath);
    expect(features.featureCount).toBeGreaterThan(0);
  });
  
  it('should calculate similarity', async () => {
    const similarity = await TajweedAudioModule.calculateSimilarity(
      audioPath1,
      audioPath2
    );
    expect(similarity.similarity).toBeGreaterThanOrEqual(0);
    expect(similarity.similarity).toBeLessThanOrEqual(1);
  });
});
```

### Integration Tests
- Test with real Arabic audio files
- Verify Tajweed rule detection accuracy
- Performance testing with large audio files

## 🔮 Future Enhancements

### Phase 1: Real Audio Libraries
- Integrate libsndfile for audio file handling
- Add FFTW for efficient FFT computation
- Implement aubio for advanced audio analysis

### Phase 2: Machine Learning
- TensorFlow Lite integration for phoneme classification
- Pre-trained models for Arabic speech recognition
- Custom Tajweed rule detection models

### Phase 3: Real-time Processing
- Streaming audio analysis
- Live feedback during recitation
- Low-latency audio processing

## 📋 Dependencies

### Required Libraries
- React Native 0.74+
- Android NDK 25+
- CMake 3.22+
- C++17 compiler

### Optional Libraries (Future)
- libsndfile: Audio file I/O
- FFTW: Fast Fourier Transform
- aubio: Audio analysis
- TensorFlow Lite: Machine learning

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Ensure NDK and CMake are properly installed
2. **Audio Loading**: Check file paths and permissions
3. **Feature Extraction**: Verify audio file format and quality
4. **Memory Issues**: Monitor memory usage with large audio files

### Debug Logging
```javascript
// Enable debug logging
console.log('Audio processing debug info:', {
  filePath: audioPath,
  features: extractedFeatures,
  similarity: calculatedSimilarity
});
```

## 📚 References

### Audio Processing
- [MFCC Tutorial](https://en.wikipedia.org/wiki/Mel-frequency_cepstrum)
- [Dynamic Time Warping](https://en.wikipedia.org/wiki/Dynamic_time_warping)
- [Formant Analysis](https://en.wikipedia.org/wiki/Formant)

### Tajweed Rules
- [Tajweed Rules Guide](https://www.learn-quran.co.uk/tajweed-rules/)
- [Arabic Phonetics](https://en.wikipedia.org/wiki/Arabic_phonology)

### Technical Resources
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-intro)
- [Android NDK Guide](https://developer.android.com/ndk/guides)
- [CMake Documentation](https://cmake.org/documentation/)

This module provides a solid foundation for audio processing in the Tajweed Tutor app, with room for future enhancements and optimizations.
