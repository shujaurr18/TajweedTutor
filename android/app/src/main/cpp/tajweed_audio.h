#ifndef TAJWEED_AUDIO_H
#define TAJWEED_AUDIO_H

#include <jni.h>
#include <string>
#include <vector>
#include <map>

// Audio processing structures
struct AudioFeatures {
    std::vector<double> mfcc;
    std::vector<double> formants;
    std::vector<double> energy;
    std::vector<double> pitch;
    std::vector<double> spectralCentroid;
    std::vector<double> spectralRolloff;
    double duration;
    int sampleRate;
    int channels;
};

struct AudioSegment {
    double startTime;
    double endTime;
    std::string text;
    std::vector<std::string> tajweedRules;
    AudioFeatures features;
};

struct TajweedAnalysis {
    double overallScore;
    std::vector<std::string> errors;
    std::vector<std::string> suggestions;
    std::map<std::string, double> ruleScores;
    double confidence;
};

struct ComparisonResult {
    double similarity;
    double score;
    std::vector<double> alignment;
    std::vector<double> deviations;
};

// Core audio processing functions
extern "C" {
    // Feature extraction
    JNIEXPORT jdoubleArray JNICALL
    Java_com_tajweedtutor_TajweedAudioModule_extractAudioFeatures(JNIEnv *env, jobject thiz, jstring audioPath);
    
    // Similarity calculation
    JNIEXPORT jdouble JNICALL
    Java_com_tajweedtutor_TajweedAudioModule_calculateSimilarity(JNIEnv *env, jobject thiz, jstring audioPath1, jstring audioPath2);
    
    // Tajweed analysis
    JNIEXPORT jobject JNICALL
    Java_com_tajweedtutor_TajweedAudioModule_analyzeTajweed(JNIEnv *env, jobject thiz, jstring userAudioPath, jstring referenceAudioPath);
    
    // Rule detection
    JNIEXPORT jobject JNICALL
    Java_com_tajweedtutor_TajweedAudioModule_detectTajweedRules(JNIEnv *env, jobject thiz, jstring audioPath, jobject rules);
    
    // Audio info
    JNIEXPORT jobject JNICALL
    Java_com_tajweedtutor_TajweedAudioModule_getAudioInfo(JNIEnv *env, jobject thiz, jstring audioPath);
}

// Internal C++ functions
namespace TajweedAudio {
    // Audio file loading and preprocessing
    bool loadAudioFile(const std::string& path, std::vector<double>& samples, int& sampleRate, int& channels);
    
    // Feature extraction
    AudioFeatures extractFeatures(const std::vector<double>& samples, int sampleRate);
    std::vector<double> extractMFCC(const std::vector<double>& samples, int sampleRate);
    std::vector<double> extractFormants(const std::vector<double>& samples, int sampleRate);
    std::vector<double> extractEnergy(const std::vector<double>& samples, int windowSize);
    std::vector<double> extractPitch(const std::vector<double>& samples, int sampleRate);
    std::vector<double> extractSpectralCentroid(const std::vector<double>& samples, int sampleRate);
    std::vector<double> extractSpectralRolloff(const std::vector<double>& samples, int sampleRate);
    
    // Audio segmentation
    std::vector<AudioSegment> segmentAudio(const std::vector<double>& samples, int sampleRate, const std::vector<double>& timestamps);
    
    // Dynamic Time Warping
    ComparisonResult performDTW(const AudioFeatures& features1, const AudioFeatures& features2);
    double calculateDTWDistance(const std::vector<double>& seq1, const std::vector<double>& seq2);
    
    // Tajweed rule detection
    TajweedAnalysis analyzeTajweedRules(const AudioFeatures& userFeatures, const AudioFeatures& referenceFeatures);
    bool detectMadd(const std::vector<double>& pitch, const std::vector<double>& energy, double expectedDuration);
    bool detectMakharij(const std::vector<double>& formants, const std::vector<double>& referenceFormants);
    bool detectGhunna(const std::vector<double>& energy, const std::vector<double>& pitch);
    bool detectQalqalah(const std::vector<double>& energy, const std::vector<double>& pitch);
    
    // Utility functions
    std::vector<double> normalizeFeatures(const std::vector<double>& features);
    double calculateEuclideanDistance(const std::vector<double>& vec1, const std::vector<double>& vec2);
    double calculateCosineSimilarity(const std::vector<double>& vec1, const std::vector<double>& vec2);
    std::vector<double> applyWindow(const std::vector<double>& samples, const std::string& windowType);
    std::vector<double> computeFFT(const std::vector<double>& samples);
    
    // Audio preprocessing
    std::vector<double> preprocessAudio(const std::vector<double>& samples);
    std::vector<double> removeNoise(const std::vector<double>& samples, int sampleRate);
    std::vector<double> normalizeAudio(const std::vector<double>& samples);
    std::vector<double> applyHighPassFilter(const std::vector<double>& samples, int sampleRate, double cutoffFreq);
    std::vector<double> applyLowPassFilter(const std::vector<double>& samples, int sampleRate, double cutoffFreq);
}

#endif // TAJWEED_AUDIO_H
