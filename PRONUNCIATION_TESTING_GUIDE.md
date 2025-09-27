# Pronunciation Testing Guide

## 🎯 Overview
This guide explains how to test the pronunciation detection feature in the Tajweed Tutor app. The system can analyze user recordings and provide detailed feedback on Arabic letter pronunciation.

## 📱 How to Test the Feature

### 1. Access the Pronunciation Test
```javascript
// Navigate to the pronunciation test screen
navigation.navigate('pronunciationTest');
```

### 2. Test Flow
1. **Select a Letter**: Choose from the 6 available letters (Alif to Haa)
2. **Play Reference**: Listen to the correct pronunciation
3. **Record Your Voice**: Record yourself saying the letter
4. **Play Your Recording**: Listen to your recording
5. **Analyze**: Get detailed feedback on your pronunciation

## 🔧 Testing Steps

### Step 1: Build and Run the App
```bash
# Navigate to project directory
cd /path/to/TajweedTutor

# Clean and build
cd android
./gradlew clean
cd ..

# Run the app
npx react-native run-android
```

### Step 2: Navigate to Pronunciation Test
```javascript
// In your app, navigate to the test screen
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('pronunciationTest');
```

### Step 3: Test Each Letter
Test the following letters with their audio URLs:

| Letter | Arabic | Transliteration | Audio URL |
|--------|--------|-----------------|-----------|
| Alif | ا | Alif | [0201.mp3](https://www.equranschool.com/learn-quran-online-free/snd/0201.mp3) |
| Ba | ب | Ba | [0202.mp3](https://www.equranschool.com/learn-quran-online-free/snd/0202.mp3) |
| Ta | ت | Ta | [0203.mp3](https://www.equranschool.com/learn-quran-online-free/snd/0203.mp3) |
| Tha | ث | Tha | [0204.mp3](https://www.equranschool.com/learn-quran-online-free/snd/0204.mp3) |
| Jeem | ج | Jeem | [0205.mp3](https://www.equranschool.com/learn-quran-online-free/snd/0205.mp3) |
| Haa | ح | Haa | [0206.mp3](https://www.equranschool.com/learn-quran-online-free/snd/0206.mp3) |

## 🎵 How Pronunciation Detection Works

### 1. Audio Feature Extraction
The system extracts multiple audio features:
- **MFCC (Mel-Frequency Cepstral Coefficients)**: 13 coefficients for speech recognition
- **Formants**: F1, F2, F3, F4 for vowel identification
- **Energy**: Signal energy analysis for pronunciation strength
- **Pitch**: Fundamental frequency detection for tone analysis
- **Spectral Features**: Brightness and frequency distribution

### 2. Comparison Algorithm
```javascript
// The system compares user recording with reference audio
const similarity = await TajweedAudioModule.calculateSimilarity(
  userRecordingPath,
  referenceAudioPath
);
```

### 3. Detailed Analysis
The system analyzes:
- **Clarity**: How clear the pronunciation is
- **Duration**: If the sound is held for the right length
- **Pitch**: If the tone matches the reference
- **Articulation**: If the articulation point is correct
- **Tajweed Rules**: If specific Tajweed rules are followed

## 🔍 Error Detection Examples

### Common Pronunciation Errors

#### 1. Alif (ا) - Throat Sound
**Correct**: Sound should come from the throat
**Error**: "Pronunciation is not clear enough"
**Suggestion**: "Focus on producing the sound from the throat"

#### 2. Ba (ب) - Lip Sound
**Correct**: Use lips to create the sound
**Error**: "Articulation point needs improvement: Makharij: Lips"
**Suggestion**: "Use your lips to create the sound"

#### 3. Ta (ت) - Tongue Tip Sound
**Correct**: Use tongue tip
**Error**: "Articulation point needs improvement: Makharij: Tongue tip"
**Suggestion**: "Use the tip of your tongue"

### Error Severity Levels
- **High**: Critical errors that need immediate attention
- **Medium**: Moderate errors that should be improved
- **Low**: Minor issues that can be refined

## 🧪 Testing Scenarios

### Scenario 1: Perfect Pronunciation
1. Listen to reference audio carefully
2. Record yourself saying the letter clearly
3. Expected result: Score 80-100%, minimal errors

### Scenario 2: Unclear Pronunciation
1. Record yourself speaking quietly or unclearly
2. Expected result: Low clarity score, "Pronunciation is not clear enough" error

### Scenario 3: Wrong Articulation
1. Record yourself using wrong articulation point
2. Expected result: Low articulation score, specific articulation error

### Scenario 4: Wrong Duration
1. Record yourself saying the letter too quickly or too slowly
2. Expected result: Duration error with specific suggestions

## 📊 Understanding the Results

### Score Interpretation
- **90-100%**: Excellent pronunciation
- **80-89%**: Good pronunciation with minor improvements needed
- **70-79%**: Acceptable pronunciation with some areas to work on
- **60-69%**: Needs improvement
- **Below 60%**: Significant improvement required

### Detailed Scores
- **Clarity**: How clear and audible the pronunciation is
- **Duration**: If the sound duration matches the reference
- **Pitch**: If the tone/pitch is correct
- **Articulation**: If the articulation point is correct
- **Tajweed**: If Tajweed rules are followed

## 🎤 Recording Tips for Testing

### Good Recording Practices
1. **Quiet Environment**: Record in a quiet room
2. **Proper Distance**: Keep microphone at consistent distance
3. **Clear Speech**: Speak clearly and at normal volume
4. **Single Letter**: Say only the letter, not extra words
5. **Natural Pace**: Don't rush or speak too slowly

### Testing Different Scenarios
1. **Perfect Pronunciation**: Try to match the reference exactly
2. **Intentional Errors**: Test with wrong articulation points
3. **Volume Variations**: Test with different speaking volumes
4. **Speed Variations**: Test with different speaking speeds

## 🔧 Technical Testing

### Test the Native Module
```javascript
// Test if the native module is working
import TajweedAudioModule from '../services/nativeModules/TajweedAudioModule';

// Check module availability
console.log('Module available:', TajweedAudioModule.isModuleAvailable());

// Test feature extraction
const features = await TajweedAudioModule.extractFeatures('/path/to/audio.mp3');
console.log('Features extracted:', features);
```

### Test Audio Download
```javascript
// Test audio download functionality
import AudioDataService from '../services/audioDataService';

// Download a letter audio
const files = await AudioDataService.downloadQaidaLesson('lesson_1', ['alif']);
console.log('Downloaded files:', files);
```

### Test Pronunciation Analysis
```javascript
// Test pronunciation analysis
import PronunciationTestService from '../services/pronunciationTestService';

const result = await PronunciationTestService.testLetterPronunciation(
  'alif',
  '/path/to/user_recording.mp3'
);
console.log('Analysis result:', result);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not available" Error
**Solution**: Ensure the native module is properly built and registered
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

#### 2. "Audio file not found" Error
**Solution**: Check if audio files are downloaded
```javascript
const isDownloaded = await AudioDataService.isAudioDownloaded(localPath);
console.log('Audio downloaded:', isDownloaded);
```

#### 3. "Recording failed" Error
**Solution**: Check microphone permissions
```xml
<!-- Add to AndroidManifest.xml -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

#### 4. "Analysis failed" Error
**Solution**: Check if audio files are valid and not corrupted

### Debug Logging
```javascript
// Enable debug logging
console.log('Audio processing debug info:', {
  userRecordingPath,
  referenceAudioPath,
  analysisResult
});
```

## 🚀 Advanced Testing

### Batch Testing
```javascript
// Test multiple letters at once
const letterIds = ['alif', 'ba', 'ta', 'tha', 'jeem', 'haa'];
const results = await PronunciationTestService.testMultipleLetters(
  letterIds,
  userRecordingPath
);
```

### Performance Testing
```javascript
// Test analysis speed
const startTime = Date.now();
const result = await PronunciationTestService.testLetterPronunciation(
  'alif',
  userRecordingPath
);
const endTime = Date.now();
console.log('Analysis time:', endTime - startTime, 'ms');
```

## 📈 Expected Results

### Successful Test Results
- Native module loads without errors
- Audio files download successfully
- Feature extraction completes
- Analysis provides detailed feedback
- Scores are calculated correctly
- Errors and suggestions are relevant

### Performance Benchmarks
- Audio download: < 5 seconds per file
- Feature extraction: < 2 seconds per file
- Analysis: < 3 seconds per comparison
- Overall response time: < 10 seconds

## 🎯 Next Steps

### For Production
1. **Real Audio Libraries**: Integrate libsndfile, FFTW, aubio
2. **Machine Learning**: Add TensorFlow Lite models
3. **Real-time Analysis**: Implement streaming audio analysis
4. **Advanced Rules**: Add more Tajweed rules
5. **User Training**: Add pronunciation training exercises

### For Testing
1. **Automated Tests**: Create unit tests for all functions
2. **Integration Tests**: Test with real Arabic speakers
3. **Performance Tests**: Optimize for mobile devices
4. **User Testing**: Get feedback from Arabic learners

This testing guide should help you verify that the pronunciation detection feature is working correctly and provide a foundation for further development.
