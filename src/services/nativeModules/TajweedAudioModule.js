import { NativeModules, NativeEventEmitter } from 'react-native';

const { TajweedAudioModule } = NativeModules;

class TajweedAudioService {
  constructor() {
    this.eventEmitter = new NativeEventEmitter(TajweedAudioModule);
    this.isAvailable = !!TajweedAudioModule;
  }

  // Check if the native module is available
  isModuleAvailable() {
    return this.isAvailable;
  }

  // Get module constants
  getConstants() {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }
    return TajweedAudioModule.getConstants();
  }

  // Extract audio features from a file
  async extractFeatures(audioPath) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      const result = await TajweedAudioModule.extractFeatures(audioPath);
      return {
        features: result.features,
        featureCount: result.featureCount,
      };
    } catch (error) {
      console.error('Error extracting audio features:', error);
      throw error;
    }
  }

  // Calculate similarity between two audio files
  async calculateSimilarity(audioPath1, audioPath2) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      const result = await TajweedAudioModule.calculateSimilarity(audioPath1, audioPath2);
      return {
        similarity: result.similarity,
        score: result.score,
      };
    } catch (error) {
      console.error('Error calculating similarity:', error);
      throw error;
    }
  }

  // Analyze Tajweed between user recording and reference audio
  async analyzeTajweed(userAudioPath, referenceAudioPath) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      const result = await TajweedAudioModule.analyzeTajweed(userAudioPath, referenceAudioPath);
      return {
        score: result.score || 0,
        errors: result.errors || [],
        suggestions: result.suggestions || [],
        duration: result.duration || 0,
        confidence: result.confidence || 0,
        analysis: result.analysis || {},
      };
    } catch (error) {
      console.error('Error analyzing Tajweed:', error);
      throw error;
    }
  }

  // Detect specific Tajweed rules in audio
  async detectTajweedRules(audioPath, rules) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      const result = await TajweedAudioModule.detectTajweedRules(audioPath, rules);
      return {
        detectedRules: result.detectedRules || [],
        violations: result.violations || [],
        recommendations: result.recommendations || [],
      };
    } catch (error) {
      console.error('Error detecting Tajweed rules:', error);
      throw error;
    }
  }

  // Get audio file information
  async getAudioInfo(audioPath) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      const result = await TajweedAudioModule.getAudioInfo(audioPath);
      return {
        path: result.path,
        name: result.name,
        size: result.size,
        lastModified: result.lastModified,
        duration: result.duration,
        sampleRate: result.sampleRate,
        channels: result.channels,
      };
    } catch (error) {
      console.error('Error getting audio info:', error);
      throw error;
    }
  }

  // Validate audio file
  async validateAudioFile(audioPath) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      const result = await TajweedAudioModule.validateAudioFile(audioPath);
      return {
        exists: result.exists,
        isFile: result.isFile,
        canRead: result.canRead,
        size: result.size,
        extension: result.extension,
      };
    } catch (error) {
      console.error('Error validating audio file:', error);
      throw error;
    }
  }

  // Advanced Tajweed analysis with specific rules
  async analyzeAdvancedTajweed(userAudioPath, referenceAudioPath, options = {}) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    const defaultOptions = {
      rules: {
        madd: true,
        makharij: true,
        ghunna: true,
        qalqalah: true,
        idgham: true,
        ikhfaa: true,
        izhar: true,
        iqlab: true,
      },
      sensitivity: 'medium', // 'low', 'medium', 'high'
      includeSuggestions: true,
      includeTimestamps: true,
    };

    const analysisOptions = { ...defaultOptions, ...options };

    try {
      // First, get basic analysis
      const basicAnalysis = await this.analyzeTajweed(userAudioPath, referenceAudioPath);
      
      // Then, detect specific rules
      const ruleDetection = await this.detectTajweedRules(userAudioPath, analysisOptions.rules);
      
      // Combine results
      return {
        ...basicAnalysis,
        ...ruleDetection,
        options: analysisOptions,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in advanced Tajweed analysis:', error);
      throw error;
    }
  }

  // Real-time analysis for streaming audio
  async startRealTimeAnalysis(options = {}) {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    const defaultOptions = {
      bufferSize: 1024,
      sampleRate: 44100,
      channels: 1,
      rules: {
        madd: true,
        makharij: true,
        ghunna: true,
      },
    };

    const analysisOptions = { ...defaultOptions, ...options };

    try {
      // This would start real-time analysis
      // For now, return a mock implementation
      return {
        isActive: true,
        options: analysisOptions,
        startTime: Date.now(),
      };
    } catch (error) {
      console.error('Error starting real-time analysis:', error);
      throw error;
    }
  }

  // Stop real-time analysis
  async stopRealTimeAnalysis() {
    if (!this.isAvailable) {
      throw new Error('TajweedAudioModule is not available');
    }

    try {
      // This would stop real-time analysis
      return {
        isActive: false,
        stopTime: Date.now(),
      };
    } catch (error) {
      console.error('Error stopping real-time analysis:', error);
      throw error;
    }
  }

  // Get supported audio formats
  getSupportedFormats() {
    if (!this.isAvailable) {
      return [];
    }

    try {
      const constants = this.getConstants();
      return constants.SUPPORTED_FORMATS || [];
    } catch (error) {
      console.error('Error getting supported formats:', error);
      return [];
    }
  }

  // Get maximum audio duration
  getMaxAudioDuration() {
    if (!this.isAvailable) {
      return 300; // 5 minutes default
    }

    try {
      const constants = this.getConstants();
      return constants.MAX_AUDIO_DURATION || 300;
    } catch (error) {
      console.error('Error getting max audio duration:', error);
      return 300;
    }
  }

  // Get minimum audio duration
  getMinAudioDuration() {
    if (!this.isAvailable) {
      return 1; // 1 second default
    }

    try {
      const constants = this.getConstants();
      return constants.MIN_AUDIO_DURATION || 1;
    } catch (error) {
      console.error('Error getting min audio duration:', error);
      return 1;
    }
  }

  // Add event listeners for real-time feedback
  addEventListener(eventName, callback) {
    if (!this.isAvailable) {
      console.warn('TajweedAudioModule is not available, cannot add event listener');
      return null;
    }

    return this.eventEmitter.addListener(eventName, callback);
  }

  // Remove event listeners
  removeEventListener(subscription) {
    if (subscription) {
      subscription.remove();
    }
  }

  // Remove all event listeners
  removeAllListeners() {
    if (this.isAvailable) {
      this.eventEmitter.removeAllListeners();
    }
  }
}

export default new TajweedAudioService();
