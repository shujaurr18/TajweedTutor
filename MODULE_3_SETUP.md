# Module 3 Setup Guide

## Prerequisites

### Required Software
1. **Android Studio** (latest version)
2. **Android NDK** (version 25 or higher)
3. **CMake** (version 3.22 or higher)
4. **React Native CLI** (latest version)

### System Requirements
- **OS**: macOS, Windows, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 10GB free space

## Installation Steps

### 1. Install Android NDK
```bash
# Using Android Studio SDK Manager
# Go to Tools > SDK Manager > SDK Tools
# Check "NDK (Side by side)" and install

# Or using command line
sdkmanager "ndk;25.2.9519653"
```

### 2. Install CMake
```bash
# Using Android Studio SDK Manager
# Go to Tools > SDK Manager > SDK Tools
# Check "CMake" and install

# Or using command line
sdkmanager "cmake;3.22.1"
```

### 3. Verify Installation
```bash
# Check NDK installation
ls $ANDROID_HOME/ndk/

# Check CMake installation
ls $ANDROID_HOME/cmake/

# Check React Native
npx react-native --version
```

## Building the Native Module

### 1. Clean and Rebuild
```bash
# Navigate to project root
cd /path/to/TajweedTutor

# Clean previous builds
cd android
./gradlew clean
cd ..

# Rebuild the project
npx react-native run-android
```

### 2. Build Debug APK
```bash
cd android
./gradlew assembleDebug
```

### 3. Build Release APK
```bash
cd android
./gradlew assembleRelease
```

## Testing the Native Module

### 1. Basic Test
```javascript
import TajweedAudioModule from '../services/nativeModules/TajweedAudioModule';

// Test if module is available
console.log('Module available:', TajweedAudioModule.isModuleAvailable());

// Test constants
const constants = TajweedAudioModule.getConstants();
console.log('Supported formats:', constants.SUPPORTED_FORMATS);
```

### 2. Feature Extraction Test
```javascript
// Create a test audio file (sine wave)
const testAudioPath = '/path/to/test_audio.mp3';

try {
  const features = await TajweedAudioModule.extractFeatures(testAudioPath);
  console.log('Features extracted:', features);
} catch (error) {
  console.error('Feature extraction failed:', error);
}
```

### 3. Similarity Test
```javascript
const audioPath1 = '/path/to/audio1.mp3';
const audioPath2 = '/path/to/audio2.mp3';

try {
  const similarity = await TajweedAudioModule.calculateSimilarity(audioPath1, audioPath2);
  console.log('Similarity:', similarity);
} catch (error) {
  console.error('Similarity calculation failed:', error);
}
```

## Audio File Setup

### 1. Create Test Audio Files
```bash
# Create test directory
mkdir -p android/app/src/main/assets/test_audio

# You can use any audio file for testing
# For now, the module will generate dummy data
```

### 2. Download Sample Audio
```javascript
import AudioDataService from '../services/audioDataService';

// Download sample Qaida audio
const files = await AudioDataService.downloadQaidaLesson('lesson_1', ['alif', 'ba']);

// Download sample Quran audio
const files = await AudioDataService.downloadQuranSurah(
  'abdul_rahman_al_sudais',
  'al_fatiha',
  ['ayah_1']
);
```

## Troubleshooting

### Common Build Errors

#### 1. NDK Not Found
```
Error: NDK not found
```
**Solution**: Set NDK path in `android/local.properties`
```properties
ndk.dir=/path/to/android-ndk
```

#### 2. CMake Not Found
```
Error: CMake not found
```
**Solution**: Install CMake via Android Studio SDK Manager

#### 3. C++ Compilation Error
```
Error: C++ compilation failed
```
**Solution**: Check C++ standard in `CMakeLists.txt`
```cmake
set(CMAKE_CXX_STANDARD 17)
```

### Runtime Errors

#### 1. Module Not Found
```
Error: Cannot find module 'TajweedAudioModule'
```
**Solution**: Ensure module is registered in `MainApplication.kt`
```kotlin
add(TajweedAudioPackage())
```

#### 2. Audio File Not Found
```
Error: Audio file not found
```
**Solution**: Check file path and permissions
```javascript
const fileExists = await RNFS.exists(audioPath);
console.log('File exists:', fileExists);
```

#### 3. Permission Denied
```
Error: Permission denied
```
**Solution**: Add audio permissions to `AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Performance Optimization

### 1. Enable Release Mode
```bash
# Build release version for better performance
cd android
./gradlew assembleRelease
```

### 2. Optimize Native Code
```cpp
// Use compiler optimizations
target_compile_options(tajweed_audio PRIVATE -O3 -ffast-math)
```

### 3. Memory Management
```javascript
// Clean up resources after use
await TajweedAudioModule.cleanup();
```

## Next Steps

### 1. Integrate Real Audio Libraries
- Add libsndfile for audio file handling
- Integrate FFTW for efficient FFT
- Add aubio for advanced audio analysis

### 2. Add More Tajweed Rules
- Implement advanced rule detection
- Add context-aware analysis
- Improve accuracy with ML models

### 3. Real-time Processing
- Implement streaming audio analysis
- Add live feedback capabilities
- Optimize for low latency

## Support

### Documentation
- [Module 3 Documentation](./MODULE_3_DOCUMENTATION.md)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-intro)
- [Android NDK Guide](https://developer.android.com/ndk/guides)

### Community
- React Native Community
- Android NDK Forums
- Audio Processing Stack Overflow

This setup guide should help you get Module 3 up and running successfully!
