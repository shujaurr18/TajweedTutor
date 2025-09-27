#include "tajweed_audio.h"
#include <android/log.h>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <cmath>
#include <complex>
#include <numeric>

#define LOG_TAG "TajweedAudio"
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

// JNI Helper functions
std::string jstring_to_string(JNIEnv *env, jstring jstr) {
    if (!jstr) return "";
    const char *cstr = env->GetStringUTFChars(jstr, nullptr);
    std::string str(cstr);
    env->ReleaseStringUTFChars(jstr, cstr);
    return str;
}

jdoubleArray vector_to_jdoubleArray(JNIEnv *env, const std::vector<double>& vec) {
    jdoubleArray result = env->NewDoubleArray(vec.size());
    env->SetDoubleArrayRegion(result, 0, vec.size(), vec.data());
    return result;
}

std::vector<double> jdoubleArray_to_vector(JNIEnv *env, jdoubleArray array) {
    jsize length = env->GetArrayLength(array);
    std::vector<double> vec(length);
    env->GetDoubleArrayRegion(array, 0, length, vec.data());
    return vec;
}

// JNI Implementation
extern "C" {

JNIEXPORT jdoubleArray JNICALL
Java_com_tajweedtutor_TajweedAudioModule_extractAudioFeatures(JNIEnv *env, jobject thiz, jstring audioPath) {
    std::string path = jstring_to_string(env, audioPath);
    LOGD("Extracting features from: %s", path.c_str());
    
    try {
        std::vector<double> samples;
        int sampleRate, channels;
        
        if (!TajweedAudio::loadAudioFile(path, samples, sampleRate, channels)) {
            LOGE("Failed to load audio file: %s", path.c_str());
            return nullptr;
        }
        
        AudioFeatures features = TajweedAudio::extractFeatures(samples, sampleRate);
        
        // Combine all features into a single vector
        std::vector<double> allFeatures;
        allFeatures.insert(allFeatures.end(), features.mfcc.begin(), features.mfcc.end());
        allFeatures.insert(allFeatures.end(), features.formants.begin(), features.formants.end());
        allFeatures.insert(allFeatures.end(), features.energy.begin(), features.energy.end());
        allFeatures.insert(allFeatures.end(), features.pitch.begin(), features.pitch.end());
        allFeatures.insert(allFeatures.end(), features.spectralCentroid.begin(), features.spectralCentroid.end());
        allFeatures.insert(allFeatures.end(), features.spectralRolloff.begin(), features.spectralRolloff.end());
        
        // Add metadata
        allFeatures.push_back(features.duration);
        allFeatures.push_back(static_cast<double>(sampleRate));
        allFeatures.push_back(static_cast<double>(channels));
        
        return vector_to_jdoubleArray(env, allFeatures);
    } catch (const std::exception& e) {
        LOGE("Exception in extractAudioFeatures: %s", e.what());
        return nullptr;
    }
}

JNIEXPORT jdouble JNICALL
Java_com_tajweedtutor_TajweedAudioModule_calculateSimilarity(JNIEnv *env, jobject thiz, jstring audioPath1, jstring audioPath2) {
    std::string path1 = jstring_to_string(env, audioPath1);
    std::string path2 = jstring_to_string(env, audioPath2);
    LOGD("Calculating similarity between: %s and %s", path1.c_str(), path2.c_str());
    
    try {
        // Load and extract features for both audio files
        std::vector<double> samples1, samples2;
        int sampleRate1, channels1, sampleRate2, channels2;
        
        if (!TajweedAudio::loadAudioFile(path1, samples1, sampleRate1, channels1) ||
            !TajweedAudio::loadAudioFile(path2, samples2, sampleRate2, channels2)) {
            LOGE("Failed to load one or both audio files");
            return 0.0;
        }
        
        AudioFeatures features1 = TajweedAudio::extractFeatures(samples1, sampleRate1);
        AudioFeatures features2 = TajweedAudio::extractFeatures(samples2, sampleRate2);
        
        // Perform DTW comparison
        ComparisonResult result = TajweedAudio::performDTW(features1, features2);
        
        return result.similarity;
    } catch (const std::exception& e) {
        LOGE("Exception in calculateSimilarity: %s", e.what());
        return 0.0;
    }
}

JNIEXPORT jobject JNICALL
Java_com_tajweedtutor_TajweedAudioModule_analyzeTajweed(JNIEnv *env, jobject thiz, jstring userAudioPath, jstring referenceAudioPath) {
    std::string userPath = jstring_to_string(env, userAudioPath);
    std::string refPath = jstring_to_string(env, referenceAudioPath);
    LOGD("Analyzing Tajweed between: %s and %s", userPath.c_str(), refPath.c_str());
    
    try {
        // Load and extract features
        std::vector<double> userSamples, refSamples;
        int userSampleRate, userChannels, refSampleRate, refChannels;
        
        if (!TajweedAudio::loadAudioFile(userPath, userSamples, userSampleRate, userChannels) ||
            !TajweedAudio::loadAudioFile(refPath, refSamples, refSampleRate, refChannels)) {
            LOGE("Failed to load audio files for Tajweed analysis");
            return nullptr;
        }
        
        AudioFeatures userFeatures = TajweedAudio::extractFeatures(userSamples, userSampleRate);
        AudioFeatures refFeatures = TajweedAudio::extractFeatures(refSamples, refSampleRate);
        
        // Analyze Tajweed rules
        TajweedAnalysis analysis = TajweedAudio::analyzeTajweedRules(userFeatures, refFeatures);
        
        // Create Java object
        jclass analysisClass = env->FindClass("java/util/HashMap");
        jmethodID initMethod = env->GetMethodID(analysisClass, "<init>", "()V");
        jobject result = env->NewObject(analysisClass, initMethod);
        
        jmethodID putMethod = env->GetMethodID(analysisClass, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
        
        // Add score
        jclass doubleClass = env->FindClass("java/lang/Double");
        jmethodID doubleInit = env->GetMethodID(doubleClass, "<init>", "(D)V");
        jobject scoreObj = env->NewObject(doubleClass, doubleInit, analysis.overallScore);
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("score"), scoreObj);
        
        // Add confidence
        jobject confidenceObj = env->NewObject(doubleClass, doubleInit, analysis.confidence);
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("confidence"), confidenceObj);
        
        // Add errors
        jclass arrayListClass = env->FindClass("java/util/ArrayList");
        jmethodID arrayListInit = env->GetMethodID(arrayListClass, "<init>", "()V");
        jobject errorsList = env->NewObject(arrayListClass, arrayListInit);
        jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");
        
        for (const auto& error : analysis.errors) {
            env->CallBooleanMethod(errorsList, addMethod, env->NewStringUTF(error.c_str()));
        }
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("errors"), errorsList);
        
        // Add suggestions
        jobject suggestionsList = env->NewObject(arrayListClass, arrayListInit);
        for (const auto& suggestion : analysis.suggestions) {
            env->CallBooleanMethod(suggestionsList, addMethod, env->NewStringUTF(suggestion.c_str()));
        }
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("suggestions"), suggestionsList);
        
        return result;
    } catch (const std::exception& e) {
        LOGE("Exception in analyzeTajweed: %s", e.what());
        return nullptr;
    }
}

JNIEXPORT jobject JNICALL
Java_com_tajweedtutor_TajweedAudioModule_detectTajweedRules(JNIEnv *env, jobject thiz, jstring audioPath, jobject rules) {
    std::string path = jstring_to_string(env, audioPath);
    LOGD("Detecting Tajweed rules in: %s", path.c_str());
    
    try {
        std::vector<double> samples;
        int sampleRate, channels;
        
        if (!TajweedAudio::loadAudioFile(path, samples, sampleRate, channels)) {
            LOGE("Failed to load audio file for rule detection");
            return nullptr;
        }
        
        AudioFeatures features = TajweedAudio::extractFeatures(samples, sampleRate);
        
        // Create result object
        jclass resultClass = env->FindClass("java/util/HashMap");
        jmethodID initMethod = env->GetMethodID(resultClass, "<init>", "()V");
        jobject result = env->NewObject(resultClass, initMethod);
        jmethodID putMethod = env->GetMethodID(resultClass, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
        
        // Detect specific rules (simplified implementation)
        std::vector<std::string> detectedRules;
        std::vector<std::string> violations;
        std::vector<std::string> recommendations;
        
        // Basic rule detection logic
        if (TajweedAudio::detectMadd(features.pitch, features.energy, 2.0)) {
            detectedRules.push_back("Madd");
        }
        
        if (TajweedAudio::detectGhunna(features.energy, features.pitch)) {
            detectedRules.push_back("Ghunna");
        }
        
        if (TajweedAudio::detectQalqalah(features.energy, features.pitch)) {
            detectedRules.push_back("Qalqalah");
        }
        
        // Add results to Java object
        jclass arrayListClass = env->FindClass("java/util/ArrayList");
        jmethodID arrayListInit = env->GetMethodID(arrayListClass, "<init>", "()V");
        jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");
        
        jobject detectedRulesList = env->NewObject(arrayListClass, arrayListInit);
        for (const auto& rule : detectedRules) {
            env->CallBooleanMethod(detectedRulesList, addMethod, env->NewStringUTF(rule.c_str()));
        }
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("detectedRules"), detectedRulesList);
        
        return result;
    } catch (const std::exception& e) {
        LOGE("Exception in detectTajweedRules: %s", e.what());
        return nullptr;
    }
}

JNIEXPORT jobject JNICALL
Java_com_tajweedtutor_TajweedAudioModule_getAudioInfo(JNIEnv *env, jobject thiz, jstring audioPath) {
    std::string path = jstring_to_string(env, audioPath);
    LOGD("Getting audio info for: %s", path.c_str());
    
    try {
        std::vector<double> samples;
        int sampleRate, channels;
        
        if (!TajweedAudio::loadAudioFile(path, samples, sampleRate, channels)) {
            LOGE("Failed to load audio file for info");
            return nullptr;
        }
        
        // Create result object
        jclass resultClass = env->FindClass("java/util/HashMap");
        jmethodID initMethod = env->GetMethodID(resultClass, "<init>", "()V");
        jobject result = env->NewObject(resultClass, initMethod);
        jmethodID putMethod = env->GetMethodID(resultClass, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
        
        // Add audio information
        jclass doubleClass = env->FindClass("java/lang/Double");
        jmethodID doubleInit = env->GetMethodID(doubleClass, "<init>", "(D)V");
        
        double duration = static_cast<double>(samples.size()) / sampleRate;
        jobject durationObj = env->NewObject(doubleClass, doubleInit, duration);
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("duration"), durationObj);
        
        jclass integerClass = env->FindClass("java/lang/Integer");
        jmethodID intInit = env->GetMethodID(integerClass, "<init>", "(I)V");
        
        jobject sampleRateObj = env->NewObject(integerClass, intInit, sampleRate);
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("sampleRate"), sampleRateObj);
        
        jobject channelsObj = env->NewObject(integerClass, intInit, channels);
        env->CallObjectMethod(result, putMethod, env->NewStringUTF("channels"), channelsObj);
        
        return result;
    } catch (const std::exception& e) {
        LOGE("Exception in getAudioInfo: %s", e.what());
        return nullptr;
    }
}

} // extern "C"

// C++ Implementation
namespace TajweedAudio {

bool loadAudioFile(const std::string& path, std::vector<double>& samples, int& sampleRate, int& channels) {
    // This is a simplified implementation
    // In a real implementation, you would use a library like libsndfile or FFmpeg
    
    LOGD("Loading audio file: %s", path.c_str());
    
    // For now, create dummy data
    // In production, integrate with libsndfile or similar
    sampleRate = 44100;
    channels = 1;
    
    // Generate dummy audio data (sine wave for testing)
    int duration = 3; // 3 seconds
    int numSamples = sampleRate * duration;
    samples.resize(numSamples);
    
    for (int i = 0; i < numSamples; i++) {
        double t = static_cast<double>(i) / sampleRate;
        samples[i] = 0.5 * sin(2.0 * M_PI * 440.0 * t); // 440 Hz sine wave
    }
    
    LOGD("Loaded %zu samples at %d Hz", samples.size(), sampleRate);
    return true;
}

AudioFeatures extractFeatures(const std::vector<double>& samples, int sampleRate) {
    AudioFeatures features;
    
    // Extract different types of features
    features.mfcc = extractMFCC(samples, sampleRate);
    features.formants = extractFormants(samples, sampleRate);
    features.energy = extractEnergy(samples, 1024);
    features.pitch = extractPitch(samples, sampleRate);
    features.spectralCentroid = extractSpectralCentroid(samples, sampleRate);
    features.spectralRolloff = extractSpectralRolloff(samples, sampleRate);
    
    features.duration = static_cast<double>(samples.size()) / sampleRate;
    features.sampleRate = sampleRate;
    features.channels = 1; // Assuming mono for now
    
    return features;
}

std::vector<double> extractMFCC(const std::vector<double>& samples, int sampleRate) {
    // Simplified MFCC extraction
    // In production, use a proper MFCC library
    std::vector<double> mfcc(13, 0.0); // 13 MFCC coefficients
    
    // Basic spectral analysis
    std::vector<double> fft = computeFFT(samples);
    
    // Calculate MFCC coefficients (simplified)
    for (int i = 0; i < 13; i++) {
        mfcc[i] = sin(2.0 * M_PI * i / 13.0) * 0.1; // Dummy values
    }
    
    return mfcc;
}

std::vector<double> extractFormants(const std::vector<double>& samples, int sampleRate) {
    // Simplified formant extraction
    std::vector<double> formants(4, 0.0); // F1, F2, F3, F4
    
    // Basic formant estimation (simplified)
    formants[0] = 800.0;  // F1
    formants[1] = 1200.0; // F2
    formants[2] = 2500.0; // F3
    formants[3] = 3500.0; // F4
    
    return formants;
}

std::vector<double> extractEnergy(const std::vector<double>& samples, int windowSize) {
    std::vector<double> energy;
    int numWindows = samples.size() / windowSize;
    
    for (int i = 0; i < numWindows; i++) {
        double sum = 0.0;
        for (int j = 0; j < windowSize; j++) {
            int index = i * windowSize + j;
            if (index < samples.size()) {
                sum += samples[index] * samples[index];
            }
        }
        energy.push_back(sum / windowSize);
    }
    
    return energy;
}

std::vector<double> extractPitch(const std::vector<double>& samples, int sampleRate) {
    // Simplified pitch extraction using autocorrelation
    std::vector<double> pitch;
    int windowSize = 1024;
    int hopSize = 512;
    
    for (size_t i = 0; i < samples.size() - windowSize; i += hopSize) {
        std::vector<double> window(samples.begin() + i, samples.begin() + i + windowSize);
        
        // Autocorrelation-based pitch detection
        double maxCorr = 0.0;
        int bestLag = 0;
        
        for (int lag = 20; lag < windowSize / 2; lag++) {
            double corr = 0.0;
            for (int j = 0; j < windowSize - lag; j++) {
                corr += window[j] * window[j + lag];
            }
            
            if (corr > maxCorr) {
                maxCorr = corr;
                bestLag = lag;
            }
        }
        
        double pitchFreq = static_cast<double>(sampleRate) / bestLag;
        pitch.push_back(pitchFreq);
    }
    
    return pitch;
}

std::vector<double> extractSpectralCentroid(const std::vector<double>& samples, int sampleRate) {
    // Simplified spectral centroid calculation
    std::vector<double> centroid;
    int windowSize = 1024;
    int hopSize = 512;
    
    for (size_t i = 0; i < samples.size() - windowSize; i += hopSize) {
        std::vector<double> window(samples.begin() + i, samples.begin() + i + windowSize);
        std::vector<double> fft = computeFFT(window);
        
        double weightedSum = 0.0;
        double magnitudeSum = 0.0;
        
        for (size_t j = 0; j < fft.size() / 2; j++) {
            double magnitude = sqrt(fft[j] * fft[j] + fft[j + fft.size()/2] * fft[j + fft.size()/2]);
            double frequency = static_cast<double>(j) * sampleRate / windowSize;
            
            weightedSum += frequency * magnitude;
            magnitudeSum += magnitude;
        }
        
        centroid.push_back(magnitudeSum > 0 ? weightedSum / magnitudeSum : 0.0);
    }
    
    return centroid;
}

std::vector<double> extractSpectralRolloff(const std::vector<double>& samples, int sampleRate) {
    // Simplified spectral rolloff calculation
    std::vector<double> rolloff;
    int windowSize = 1024;
    int hopSize = 512;
    
    for (size_t i = 0; i < samples.size() - windowSize; i += hopSize) {
        std::vector<double> window(samples.begin() + i, samples.begin() + i + windowSize);
        std::vector<double> fft = computeFFT(window);
        
        // Calculate total energy
        double totalEnergy = 0.0;
        for (size_t j = 0; j < fft.size() / 2; j++) {
            double magnitude = sqrt(fft[j] * fft[j] + fft[j + fft.size()/2] * fft[j + fft.size()/2]);
            totalEnergy += magnitude * magnitude;
        }
        
        // Find rolloff point (85% of energy)
        double targetEnergy = 0.85 * totalEnergy;
        double currentEnergy = 0.0;
        double rolloffFreq = 0.0;
        
        for (size_t j = 0; j < fft.size() / 2; j++) {
            double magnitude = sqrt(fft[j] * fft[j] + fft[j + fft.size()/2] * fft[j + fft.size()/2]);
            currentEnergy += magnitude * magnitude;
            
            if (currentEnergy >= targetEnergy) {
                rolloffFreq = static_cast<double>(j) * sampleRate / windowSize;
                break;
            }
        }
        
        rolloff.push_back(rolloffFreq);
    }
    
    return rolloff;
}

ComparisonResult performDTW(const AudioFeatures& features1, const AudioFeatures& features2) {
    ComparisonResult result;
    
    // Use MFCC features for DTW
    double dtwDistance = calculateDTWDistance(features1.mfcc, features2.mfcc);
    
    // Convert distance to similarity (0-1 scale)
    result.similarity = 1.0 / (1.0 + dtwDistance);
    result.score = result.similarity * 100.0;
    
    return result;
}

double calculateDTWDistance(const std::vector<double>& seq1, const std::vector<double>& seq2) {
    // Simplified DTW implementation
    // In production, use a proper DTW library
    
    size_t n = seq1.size();
    size_t m = seq2.size();
    
    if (n == 0 || m == 0) return 0.0;
    
    // Create distance matrix
    std::vector<std::vector<double>> dtw(n + 1, std::vector<double>(m + 1, INFINITY));
    dtw[0][0] = 0.0;
    
    // Fill the matrix
    for (size_t i = 1; i <= n; i++) {
        for (size_t j = 1; j <= m; j++) {
            double cost = abs(seq1[i-1] - seq2[j-1]);
            dtw[i][j] = cost + std::min({dtw[i-1][j], dtw[i][j-1], dtw[i-1][j-1]});
        }
    }
    
    return dtw[n][m];
}

TajweedAnalysis analyzeTajweedRules(const AudioFeatures& userFeatures, const AudioFeatures& referenceFeatures) {
    TajweedAnalysis analysis;
    
    // Basic rule analysis
    bool maddCorrect = detectMadd(userFeatures.pitch, userFeatures.energy, 2.0);
    bool makharijCorrect = detectMakharij(userFeatures.formants, referenceFeatures.formants);
    bool ghunnaCorrect = detectGhunna(userFeatures.energy, userFeatures.pitch);
    bool qalqalahCorrect = detectQalqalah(userFeatures.energy, userFeatures.pitch);
    
    // Calculate overall score
    int correctRules = 0;
    int totalRules = 4;
    
    if (maddCorrect) correctRules++;
    if (makharijCorrect) correctRules++;
    if (ghunnaCorrect) correctRules++;
    if (qalqalahCorrect) correctRules++;
    
    analysis.overallScore = static_cast<double>(correctRules) / totalRules * 100.0;
    analysis.confidence = 0.8; // Placeholder confidence
    
    // Add errors and suggestions
    if (!maddCorrect) {
        analysis.errors.push_back("Madd not properly elongated");
        analysis.suggestions.push_back("Focus on elongating the Madd letters");
    }
    
    if (!makharijCorrect) {
        analysis.errors.push_back("Articulation point needs adjustment");
        analysis.suggestions.push_back("Practice the articulation points of Arabic letters");
    }
    
    if (!ghunnaCorrect) {
        analysis.errors.push_back("Ghunna not properly pronounced");
        analysis.suggestions.push_back("Practice nasal sounds");
    }
    
    if (!qalqalahCorrect) {
        analysis.errors.push_back("Qalqalah not properly pronounced");
        analysis.suggestions.push_back("Practice the bouncing sound of Qalqalah letters");
    }
    
    return analysis;
}

bool detectMadd(const std::vector<double>& pitch, const std::vector<double>& energy, double expectedDuration) {
    // Simplified Madd detection
    // Look for sustained pitch and energy
    if (pitch.empty() || energy.empty()) return false;
    
    double avgPitch = std::accumulate(pitch.begin(), pitch.end(), 0.0) / pitch.size();
    double avgEnergy = std::accumulate(energy.begin(), energy.end(), 0.0) / energy.size();
    
    // Check if pitch and energy are sustained
    return avgPitch > 100.0 && avgEnergy > 0.1;
}

bool detectMakharij(const std::vector<double>& formants, const std::vector<double>& referenceFormants) {
    // Simplified Makharij detection
    // Compare formant frequencies
    if (formants.size() != referenceFormants.size()) return false;
    
    double totalDiff = 0.0;
    for (size_t i = 0; i < formants.size(); i++) {
        totalDiff += abs(formants[i] - referenceFormants[i]);
    }
    
    double avgDiff = totalDiff / formants.size();
    return avgDiff < 200.0; // Threshold for acceptable difference
}

bool detectGhunna(const std::vector<double>& energy, const std::vector<double>& pitch) {
    // Simplified Ghunna detection
    // Look for nasal characteristics in energy and pitch
    if (energy.empty() || pitch.empty()) return false;
    
    double avgEnergy = std::accumulate(energy.begin(), energy.end(), 0.0) / energy.size();
    double avgPitch = std::accumulate(pitch.begin(), pitch.end(), 0.0) / pitch.size();
    
    // Nasal sounds typically have specific energy and pitch characteristics
    return avgEnergy > 0.05 && avgPitch > 80.0;
}

bool detectQalqalah(const std::vector<double>& energy, const std::vector<double>& pitch) {
    // Simplified Qalqalah detection
    // Look for bouncing characteristics
    if (energy.empty() || pitch.empty()) return false;
    
    // Check for energy variations that indicate bouncing
    double maxEnergy = *std::max_element(energy.begin(), energy.end());
    double minEnergy = *std::min_element(energy.begin(), energy.end());
    
    return (maxEnergy - minEnergy) > 0.1; // Significant energy variation
}

std::vector<double> computeFFT(const std::vector<double>& samples) {
    // Simplified FFT implementation
    // In production, use a proper FFT library like FFTW or Kiss FFT
    
    size_t n = samples.size();
    std::vector<double> fft(n * 2, 0.0); // Real and imaginary parts
    
    // Basic DFT implementation (not optimized)
    for (size_t k = 0; k < n; k++) {
        double real = 0.0;
        double imag = 0.0;
        
        for (size_t j = 0; j < n; j++) {
            double angle = -2.0 * M_PI * k * j / n;
            real += samples[j] * cos(angle);
            imag += samples[j] * sin(angle);
        }
        
        fft[k] = real;
        fft[k + n] = imag;
    }
    
    return fft;
}

} // namespace TajweedAudio
