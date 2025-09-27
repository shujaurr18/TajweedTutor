// import TajweedAudioModule from './nativeModules/TajweedAudioModule';
import AudioDataService from './audioDataService';
import AudioService from './audioService';

class PronunciationTestService {
  constructor() {
    this.isAnalyzing = false;
    this.analysisResults = new Map();
  }

  // Test pronunciation of a specific letter
  async testLetterPronunciation(letterId, userRecordingPath) {
    try {
      this.isAnalyzing = true;
      
      // Get reference audio data
      const audioStructure = AudioDataService.getAudioDataStructure();
      const letter = audioStructure.qaida.lessons.lesson_1.segments[letterId];
      
      if (!letter) {
        throw new Error(`Letter ${letterId} not found`);
      }

      // Download reference audio if not available locally
      const referencePath = await this.ensureReferenceAudio(letter);
      
      // Extract features from both recordings (mock implementation for now)
      console.log('Extracting features from user recording...');
      const userFeatures = await this.mockExtractFeatures(userRecordingPath);
      
      console.log('Extracting features from reference audio...');
      const referenceFeatures = await this.mockExtractFeatures(referencePath);
      
      // Perform detailed analysis
      const analysis = await this.performDetailedAnalysis(
        userFeatures,
        referenceFeatures,
        letter
      );
      
      // Store analysis results
      this.analysisResults.set(letterId, analysis);
      
      this.isAnalyzing = false;
      return analysis;
      
    } catch (error) {
      this.isAnalyzing = false;
      console.error('Error testing pronunciation:', error);
      throw error;
    }
  }

  // Ensure reference audio is downloaded
  async ensureReferenceAudio(letter) {
    const isDownloaded = await AudioDataService.isAudioDownloaded(letter.localPath);
    
    if (!isDownloaded) {
      console.log(`Downloading reference audio for ${letter.id}...`);
      await AudioDataService.downloadAudioFromSource(letter.audioUrl, letter.localPath);
    }
    
    return letter.localPath;
  }

  // Perform detailed pronunciation analysis
  async performDetailedAnalysis(userFeatures, referenceFeatures, letter) {
    const analysis = {
      letterId: letter.id,
      letterText: letter.text,
      letterTransliteration: letter.transliteration,
      overallScore: 0,
      detailedScores: {},
      errors: [],
      suggestions: [],
      pronunciationTips: [],
      tajweedRules: letter.tajweedRules,
      confidence: 0,
      timestamp: new Date().toISOString(),
    };

    try {
      // Calculate similarity score (mock implementation)
      const similarity = await this.mockCalculateSimilarity(
        userFeatures.features,
        referenceFeatures.features
      );
      
      analysis.overallScore = Math.round(similarity.score);
      analysis.confidence = similarity.similarity;

      // Analyze specific aspects
      analysis.detailedScores = await this.analyzeSpecificAspects(
        userFeatures,
        referenceFeatures,
        letter
      );

      // Generate feedback
      analysis.errors = this.generateErrors(analysis.detailedScores, letter);
      analysis.suggestions = this.generateSuggestions(analysis.errors, letter);
      analysis.pronunciationTips = this.generatePronunciationTips(letter);

      return analysis;

    } catch (error) {
      console.error('Error in detailed analysis:', error);
      analysis.errors.push('Analysis failed. Please try again.');
      return analysis;
    }
  }

  // Analyze specific pronunciation aspects
  async analyzeSpecificAspects(userFeatures, referenceFeatures, letter) {
    const scores = {
      clarity: 0,
      duration: 0,
      pitch: 0,
      articulation: 0,
      tajweed: 0,
    };

    try {
      // Clarity analysis (based on energy and spectral features)
      scores.clarity = this.analyzeClarity(userFeatures, referenceFeatures);
      
      // Duration analysis
      scores.duration = this.analyzeDuration(userFeatures, referenceFeatures);
      
      // Pitch analysis
      scores.pitch = this.analyzePitch(userFeatures, referenceFeatures);
      
      // Articulation analysis (based on formants)
      scores.articulation = this.analyzeArticulation(userFeatures, referenceFeatures, letter);
      
      // Tajweed rules analysis
      scores.tajweed = await this.analyzeTajweedRules(userFeatures, referenceFeatures, letter);

      return scores;

    } catch (error) {
      console.error('Error analyzing specific aspects:', error);
      return scores;
    }
  }

  // Analyze clarity of pronunciation
  analyzeClarity(userFeatures, referenceFeatures) {
    // Compare energy levels and spectral characteristics
    const userEnergy = this.calculateAverageEnergy(userFeatures.energy);
    const referenceEnergy = this.calculateAverageEnergy(referenceFeatures.energy);
    
    const energyRatio = userEnergy / referenceEnergy;
    let clarityScore = 100;
    
    if (energyRatio < 0.5) {
      clarityScore = 60; // Too quiet
    } else if (energyRatio > 2.0) {
      clarityScore = 70; // Too loud
    } else if (energyRatio >= 0.7 && energyRatio <= 1.3) {
      clarityScore = 90; // Good clarity
    } else {
      clarityScore = 80; // Acceptable
    }
    
    return Math.round(clarityScore);
  }

  // Analyze duration of pronunciation
  analyzeDuration(userFeatures, referenceFeatures) {
    const userDuration = userFeatures.duration;
    const referenceDuration = referenceFeatures.duration;
    
    const durationRatio = userDuration / referenceDuration;
    let durationScore = 100;
    
    if (durationRatio < 0.5) {
      durationScore = 40; // Too short
    } else if (durationRatio > 2.0) {
      durationScore = 50; // Too long
    } else if (durationRatio >= 0.8 && durationRatio <= 1.2) {
      durationScore = 95; // Perfect duration
    } else if (durationRatio >= 0.6 && durationRatio <= 1.4) {
      durationScore = 85; // Good duration
    } else {
      durationScore = 70; // Acceptable
    }
    
    return Math.round(durationScore);
  }

  // Analyze pitch accuracy
  analyzePitch(userFeatures, referenceFeatures) {
    const userPitch = this.calculateAveragePitch(userFeatures.pitch);
    const referencePitch = this.calculateAveragePitch(referenceFeatures.pitch);
    
    if (userPitch === 0 || referencePitch === 0) {
      return 50; // Cannot analyze pitch
    }
    
    const pitchRatio = userPitch / referencePitch;
    let pitchScore = 100;
    
    if (pitchRatio < 0.7 || pitchRatio > 1.3) {
      pitchScore = 60; // Pitch mismatch
    } else if (pitchRatio >= 0.9 && pitchRatio <= 1.1) {
      pitchScore = 95; // Excellent pitch
    } else {
      pitchScore = 80; // Good pitch
    }
    
    return Math.round(pitchScore);
  }

  // Analyze articulation points
  analyzeArticulation(userFeatures, referenceFeatures, letter) {
    // This would analyze formant frequencies to check articulation points
    // For now, return a base score that can be improved with real formant analysis
    
    const tajweedRule = letter.tajweedRules[0];
    let articulationScore = 75; // Base score
    
    // Adjust score based on tajweed rules
    if (tajweedRule.includes('Throat')) {
      // Check for throat articulation characteristics
      articulationScore = this.checkThroatArticulation(userFeatures);
    } else if (tajweedRule.includes('Lips')) {
      // Check for lip articulation characteristics
      articulationScore = this.checkLipArticulation(userFeatures);
    } else if (tajweedRule.includes('Tongue')) {
      // Check for tongue articulation characteristics
      articulationScore = this.checkTongueArticulation(userFeatures);
    }
    
    return Math.round(articulationScore);
  }

  // Analyze Tajweed rules
  async analyzeTajweedRules(userFeatures, referenceFeatures, letter) {
    try {
      const rules = {
        madd: letter.tajweedRules.includes('Madd'),
        makharij: true, // Always check articulation points
        ghunna: letter.tajweedRules.includes('Ghunna'),
        qalqalah: letter.tajweedRules.includes('Qalqalah'),
      };

      const result = await this.mockDetectTajweedRules(
        userFeatures.features,
        rules
      );

      // Calculate tajweed score based on detected rules
      let tajweedScore = 80; // Base score
      
      if (result.detectedRules && result.detectedRules.length > 0) {
        tajweedScore = 90; // Rules detected correctly
      }
      
      return Math.round(tajweedScore);

    } catch (error) {
      console.error('Error analyzing Tajweed rules:', error);
      return 70; // Default score if analysis fails
    }
  }

  // Generate specific errors based on analysis
  generateErrors(scores, letter) {
    const errors = [];
    
    if (scores.clarity < 70) {
      errors.push({
        type: 'clarity',
        message: 'Pronunciation is not clear enough',
        severity: scores.clarity < 50 ? 'high' : 'medium',
        suggestion: 'Speak more clearly and with proper volume'
      });
    }
    
    if (scores.duration < 70) {
      if (scores.duration < 50) {
        errors.push({
          type: 'duration',
          message: 'Pronunciation is too short',
          severity: 'high',
          suggestion: 'Hold the sound longer'
        });
      } else {
        errors.push({
          type: 'duration',
          message: 'Pronunciation duration needs adjustment',
          severity: 'medium',
          suggestion: 'Try to match the reference duration'
        });
      }
    }
    
    if (scores.pitch < 70) {
      errors.push({
        type: 'pitch',
        message: 'Pitch/tone needs adjustment',
        severity: 'medium',
        suggestion: 'Listen to the reference and match the tone'
      });
    }
    
    if (scores.articulation < 70) {
      const tajweedRule = letter.tajweedRules[0];
      errors.push({
        type: 'articulation',
        message: `Articulation point needs improvement: ${tajweedRule}`,
        severity: 'high',
        suggestion: this.getArticulationSuggestion(tajweedRule)
      });
    }
    
    if (scores.tajweed < 70) {
      errors.push({
        type: 'tajweed',
        message: 'Tajweed rules not followed correctly',
        severity: 'high',
        suggestion: 'Review the Tajweed rules for this letter'
      });
    }
    
    return errors;
  }

  // Generate suggestions based on errors
  generateSuggestions(errors, letter) {
    const suggestions = [];
    
    errors.forEach(error => {
      suggestions.push(error.suggestion);
    });
    
    // Add general suggestions
    if (suggestions.length === 0) {
      suggestions.push('Excellent pronunciation! Keep practicing to maintain consistency.');
    } else {
      suggestions.push('Practice with the reference audio multiple times.');
      suggestions.push('Record yourself again and compare.');
    }
    
    return suggestions;
  }

  // Generate pronunciation tips for specific letters
  generatePronunciationTips(letter) {
    const tips = [];
    const tajweedRule = letter.tajweedRules[0];
    
    if (tajweedRule.includes('Throat')) {
      tips.push('Focus on producing the sound from the throat');
      tips.push('Keep your tongue relaxed and low');
      tips.push('Feel the vibration in your throat');
    } else if (tajweedRule.includes('Lips')) {
      tips.push('Use your lips to create the sound');
      tips.push('Keep your lips together firmly');
      tips.push('Release the sound with a slight pop');
    } else if (tajweedRule.includes('Tongue')) {
      tips.push('Use the tip of your tongue');
      tips.push('Touch the tongue to the correct position');
      tips.push('Release the sound clearly');
    }
    
    tips.push(`Practice saying "${letter.transliteration}" slowly`);
    tips.push('Listen to the reference audio carefully');
    
    return tips;
  }

  // Helper methods for analysis
  calculateAverageEnergy(energyArray) {
    if (!energyArray || energyArray.length === 0) return 0;
    return energyArray.reduce((sum, val) => sum + val, 0) / energyArray.length;
  }

  calculateAveragePitch(pitchArray) {
    if (!pitchArray || pitchArray.length === 0) return 0;
    const validPitches = pitchArray.filter(p => p > 0);
    if (validPitches.length === 0) return 0;
    return validPitches.reduce((sum, val) => sum + val, 0) / validPitches.length;
  }

  checkThroatArticulation(features) {
    // Simplified throat articulation check
    // In real implementation, this would analyze formant frequencies
    return 80; // Placeholder score
  }

  checkLipArticulation(features) {
    // Simplified lip articulation check
    return 80; // Placeholder score
  }

  checkTongueArticulation(features) {
    // Simplified tongue articulation check
    return 80; // Placeholder score
  }

  getArticulationSuggestion(tajweedRule) {
    if (tajweedRule.includes('Throat')) {
      return 'Practice throat sounds by saying "Ah" and feeling the vibration';
    } else if (tajweedRule.includes('Lips')) {
      return 'Practice lip sounds by keeping lips together and releasing';
    } else if (tajweedRule.includes('Tongue')) {
      return 'Practice tongue placement by touching the correct position';
    }
    return 'Focus on the specific articulation point mentioned in the rule';
  }

  // Test multiple letters at once
  async testMultipleLetters(letterIds, userRecordingPath) {
    const results = [];
    
    for (const letterId of letterIds) {
      try {
        const result = await this.testLetterPronunciation(letterId, userRecordingPath);
        results.push(result);
      } catch (error) {
        console.error(`Error testing letter ${letterId}:`, error);
        results.push({
          letterId,
          error: error.message,
          overallScore: 0,
        });
      }
    }
    
    return results;
  }

  // Get analysis results for a letter
  getAnalysisResults(letterId) {
    return this.analysisResults.get(letterId);
  }

  // Clear analysis results
  clearAnalysisResults() {
    this.analysisResults.clear();
  }

  // Check if analysis is in progress
  isAnalysisInProgress() {
    return this.isAnalyzing;
  }

  // Mock functions for testing (replace with real native module calls later)
  async mockExtractFeatures(audioPath) {
    // Simulate feature extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          features: Array(13).fill(0).map(() => Math.random()),
          mfcc: Array(13).fill(0).map(() => Math.random()),
          formants: [800 + Math.random() * 200, 1200 + Math.random() * 200, 2500 + Math.random() * 200, 3500 + Math.random() * 200],
          energy: Array(10).fill(0).map(() => Math.random() * 0.5),
          pitch: Array(10).fill(0).map(() => 150 + Math.random() * 100),
          duration: 2.5 + Math.random() * 1.0,
          sampleRate: 44100,
          channels: 1,
        });
      }, 1000); // Simulate processing time
    });
  }

  async mockCalculateSimilarity(features1, features2) {
    // Simulate similarity calculation
    return new Promise((resolve) => {
      setTimeout(() => {
        const similarity = 0.6 + Math.random() * 0.3; // 60-90% similarity
        resolve({
          similarity: similarity,
          score: similarity * 100,
        });
      }, 500);
    });
  }

  async mockDetectTajweedRules(features, rules) {
    // Simulate Tajweed rule detection
    return new Promise((resolve) => {
      setTimeout(() => {
        const detectedRules = [];
        if (Math.random() > 0.3) detectedRules.push('Madd');
        if (Math.random() > 0.4) detectedRules.push('Makharij');
        if (Math.random() > 0.5) detectedRules.push('Ghunna');
        
        resolve({
          detectedRules: detectedRules,
          violations: [],
          recommendations: [],
        });
      }, 300);
    });
  }
}

export default new PronunciationTestService();
