package com.tajweedtutor;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import java.io.File;
import java.util.Map;
import java.util.HashMap;

public class TajweedAudioModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "TajweedAudioModule";
    
    // Load native C++ library
    static {
        System.loadLibrary("tajweed_audio");
    }
    
    // Native methods
    private native double[] extractAudioFeatures(String audioPath);
    private native double calculateSimilarity(double[] features1, double[] features2);
    private native WritableMap analyzeTajweed(String userAudioPath, String referenceAudioPath);
    private native WritableMap detectTajweedRules(String audioPath, ReadableMap rules);
    
    public TajweedAudioModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return MODULE_NAME;
    }
    
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("SUPPORTED_FORMATS", new String[]{"mp3", "wav", "m4a"});
        constants.put("MAX_AUDIO_DURATION", 300); // 5 minutes
        constants.put("MIN_AUDIO_DURATION", 1); // 1 second
        return constants;
    }
    
    @ReactMethod
    public void extractFeatures(String audioPath, Promise promise) {
        try {
            // Validate file exists
            File audioFile = new File(audioPath);
            if (!audioFile.exists()) {
                promise.reject("FILE_NOT_FOUND", "Audio file not found: " + audioPath);
                return;
            }
            
            // Extract audio features using native C++ code
            double[] features = extractAudioFeatures(audioPath);
            
            // Convert to React Native array
            WritableArray featureArray = Arguments.createArray();
            for (double feature : features) {
                featureArray.pushDouble(feature);
            }
            
            WritableMap result = Arguments.createMap();
            result.putArray("features", featureArray);
            result.putInt("featureCount", features.length);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("FEATURE_EXTRACTION_ERROR", "Failed to extract audio features: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void calculateSimilarity(String audioPath1, String audioPath2, Promise promise) {
        try {
            // Validate files exist
            File file1 = new File(audioPath1);
            File file2 = new File(audioPath2);
            
            if (!file1.exists() || !file2.exists()) {
                promise.reject("FILE_NOT_FOUND", "One or both audio files not found");
                return;
            }
            
            // Extract features for both audio files
            double[] features1 = extractAudioFeatures(audioPath1);
            double[] features2 = extractAudioFeatures(audioPath2);
            
            // Calculate similarity
            double similarity = calculateSimilarity(features1, features2);
            
            WritableMap result = Arguments.createMap();
            result.putDouble("similarity", similarity);
            result.putDouble("score", similarity * 100); // Convert to percentage
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("SIMILARITY_CALCULATION_ERROR", "Failed to calculate similarity: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void analyzeTajweed(String userAudioPath, String referenceAudioPath, Promise promise) {
        try {
            // Validate files exist
            File userFile = new File(userAudioPath);
            File referenceFile = new File(referenceAudioPath);
            
            if (!userFile.exists() || !referenceFile.exists()) {
                promise.reject("FILE_NOT_FOUND", "One or both audio files not found");
                return;
            }
            
            // Analyze Tajweed using native C++ code
            WritableMap analysis = analyzeTajweed(userAudioPath, referenceAudioPath);
            
            promise.resolve(analysis);
        } catch (Exception e) {
            promise.reject("TAJWEED_ANALYSIS_ERROR", "Failed to analyze Tajweed: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void detectTajweedRules(String audioPath, ReadableMap rules, Promise promise) {
        try {
            // Validate file exists
            File audioFile = new File(audioPath);
            if (!audioFile.exists()) {
                promise.reject("FILE_NOT_FOUND", "Audio file not found: " + audioPath);
                return;
            }
            
            // Detect specific Tajweed rules
            WritableMap result = detectTajweedRules(audioPath, rules);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("RULE_DETECTION_ERROR", "Failed to detect Tajweed rules: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void getAudioInfo(String audioPath, Promise promise) {
        try {
            File audioFile = new File(audioPath);
            if (!audioFile.exists()) {
                promise.reject("FILE_NOT_FOUND", "Audio file not found: " + audioPath);
                return;
            }
            
            WritableMap info = Arguments.createMap();
            info.putString("path", audioPath);
            info.putString("name", audioFile.getName());
            info.putDouble("size", audioFile.length());
            info.putDouble("lastModified", audioFile.lastModified());
            
            // Get additional audio info from native code
            // This would call native methods to get duration, sample rate, etc.
            info.putDouble("duration", 0.0); // Placeholder
            info.putInt("sampleRate", 44100); // Placeholder
            info.putInt("channels", 1); // Placeholder
            
            promise.resolve(info);
        } catch (Exception e) {
            promise.reject("AUDIO_INFO_ERROR", "Failed to get audio info: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void validateAudioFile(String audioPath, Promise promise) {
        try {
            File audioFile = new File(audioPath);
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("exists", audioFile.exists());
            result.putBoolean("isFile", audioFile.isFile());
            result.putBoolean("canRead", audioFile.canRead());
            
            if (audioFile.exists()) {
                result.putDouble("size", audioFile.length());
                result.putString("extension", getFileExtension(audioFile.getName()));
            }
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("VALIDATION_ERROR", "Failed to validate audio file: " + e.getMessage());
        }
    }
    
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1).toLowerCase();
        }
        return "";
    }
}
