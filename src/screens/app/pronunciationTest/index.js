import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';
import AudioService from '../../../services/audioService';
import PronunciationTestService from '../../../services/pronunciationTestService';
import AudioDataService from '../../../services/audioDataService';

const PronunciationTest = () => {
  const navigation = useNavigation();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingPath, setRecordingPath] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = () => {
    const audioStructure = AudioDataService.getAudioDataStructure();
    const lessonLetters = Object.values(audioStructure.qaida.lessons.lesson_1.segments);
    setLetters(lessonLetters);
  };

  const startRecording = async () => {
    try {
      const result = await AudioService.startRecording();
      setRecordingPath(result);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = async () => {
    try {
      await AudioService.stopRecording();
      setIsRecording(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording: ' + error.message);
    }
  };

  const playReference = async () => {
    if (!selectedLetter) return;
    
    try {
      setIsPlaying(true);
      // Download and play reference audio
      const referencePath = await AudioDataService.downloadAudioFromSource(
        selectedLetter.audioUrl,
        selectedLetter.localPath
      );
      await AudioService.playReferenceAudio(referencePath);
    } catch (error) {
      Alert.alert('Error', 'Failed to play reference audio: ' + error.message);
    } finally {
      setIsPlaying(false);
    }
  };

  const playRecording = async () => {
    if (!recordingPath) return;
    
    try {
      setIsPlaying(true);
      await AudioService.playRecording(recordingPath);
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording: ' + error.message);
    } finally {
      setIsPlaying(false);
    }
  };

  const analyzePronunciation = async () => {
    if (!selectedLetter || !recordingPath) {
      Alert.alert('Error', 'Please select a letter and record your pronunciation first');
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      
      const result = await PronunciationTestService.testLetterPronunciation(
        selectedLetter.id,
        recordingPath
      );
      
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze pronunciation: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderLetterCard = (letter) => (
    <TouchableOpacity
      key={letter.id}
      style={[
        styles.letterCard,
        selectedLetter?.id === letter.id && styles.selectedLetterCard,
      ]}
      onPress={() => setSelectedLetter(letter)}
    >
      <View style={styles.letterInfo}>
        <Text style={styles.letterText}>{letter.text}</Text>
        <Text style={styles.letterTransliteration}>{letter.transliteration}</Text>
        <Text style={styles.letterRules}>{letter.tajweedRules.join(', ')}</Text>
      </View>
      {selectedLetter?.id === letter.id && (
        <Icon name="check-circle" type="feather" size={24} color={colors.appColor1} />
      )}
    </TouchableOpacity>
  );

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Pronunciation Analysis</Text>
        
        {/* Overall Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Overall Score: {analysisResult.overallScore}%</Text>
          <View style={styles.scoreBar}>
            <View 
              style={[
                styles.scoreFill, 
                { 
                  width: `${analysisResult.overallScore}%`,
                  backgroundColor: analysisResult.overallScore >= 80 ? '#4CAF50' : 
                                 analysisResult.overallScore >= 60 ? '#FF9800' : '#F44336'
                }
              ]} 
            />
          </View>
        </View>

        {/* Detailed Scores */}
        <View style={styles.detailedScoresContainer}>
          <Text style={styles.detailedScoresTitle}>Detailed Analysis</Text>
          {Object.entries(analysisResult.detailedScores).map(([aspect, score]) => (
            <View key={aspect} style={styles.scoreItem}>
              <Text style={styles.scoreAspect}>{aspect.charAt(0).toUpperCase() + aspect.slice(1)}</Text>
              <Text style={styles.scoreValue}>{score}%</Text>
            </View>
          ))}
        </View>

        {/* Errors */}
        {analysisResult.errors.length > 0 && (
          <View style={styles.errorsContainer}>
            <Text style={styles.errorsTitle}>Areas for Improvement</Text>
            {analysisResult.errors.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Icon 
                  name="alert-circle" 
                  type="feather" 
                  size={16} 
                  color={error.severity === 'high' ? '#F44336' : '#FF9800'} 
                />
                <View style={styles.errorContent}>
                  <Text style={styles.errorMessage}>{error.message}</Text>
                  <Text style={styles.errorSuggestion}>{error.suggestion}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          {analysisResult.suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
          ))}
        </View>

        {/* Pronunciation Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Pronunciation Tips</Text>
          {analysisResult.pronunciationTips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>• {tip}</Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
      
      <Header
        title="Pronunciation Test"
        showBackButton={true}
        rightComponent={
          <TouchableOpacity onPress={() => setAnalysisResult(null)}>
            <Icon name="refresh-cw" type="feather" size={24} color={colors.appTextColor1} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Letter Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Letter to Practice</Text>
          <View style={styles.lettersGrid}>
            {letters.map(renderLetterCard)}
          </View>
        </View>

        {selectedLetter && (
          <>
            <Spacer height={20} />

            {/* Selected Letter Info */}
            <View style={styles.selectedLetterContainer}>
              <Text style={styles.selectedLetterTitle}>Selected: {selectedLetter.text}</Text>
              <Text style={styles.selectedLetterSubtitle}>{selectedLetter.transliteration}</Text>
              <Text style={styles.selectedLetterRules}>{selectedLetter.tajweedRules.join(', ')}</Text>
            </View>

            <Spacer height={20} />

            {/* Audio Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={[styles.controlButton, styles.playButton]}
                onPress={playReference}
                disabled={isPlaying}
              >
                <Icon 
                  name={isPlaying ? "pause" : "play"} 
                  type="feather" 
                  size={24} 
                  color={colors.appBgColor1} 
                />
                <Text style={styles.controlButtonText}>Play Reference</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, isRecording ? styles.recordingButton : styles.recordButton]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Icon 
                  name={isRecording ? "square" : "mic"} 
                  type="feather" 
                  size={24} 
                  color={colors.appBgColor1} 
                />
                <Text style={styles.controlButtonText}>
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Text>
              </TouchableOpacity>

              {recordingPath && (
                <TouchableOpacity
                  style={[styles.controlButton, styles.playRecordingButton]}
                  onPress={playRecording}
                  disabled={isPlaying}
                >
                  <Icon 
                    name="play-circle" 
                    type="feather" 
                    size={24} 
                    color={colors.appBgColor1} 
                  />
                  <Text style={styles.controlButtonText}>Play My Recording</Text>
                </TouchableOpacity>
              )}

              {recordingPath && (
                <TouchableOpacity
                  style={[styles.controlButton, styles.analyzeButton]}
                  onPress={analyzePronunciation}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator size="small" color={colors.appBgColor1} />
                  ) : (
                    <Icon name="search" type="feather" size={24} color={colors.appBgColor1} />
                  )}
                  <Text style={styles.controlButtonText}>
                    {isAnalyzing ? "Analyzing..." : "Analyze Pronunciation"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Spacer height={20} />

            {/* Analysis Results */}
            {renderAnalysisResult()}
          </>
        )}

        <Spacer height={30} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBgColor1,
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    color: colors.appTextColor1,
    fontWeight: '600',
    marginBottom: 16,
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  letterCard: {
    width: (responsiveWidth(92) - 32) / 2,
    backgroundColor: colors.appBgColor2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLetterCard: {
    borderColor: colors.appColor1,
  },
  letterInfo: {
    alignItems: 'center',
  },
  letterText: {
    fontSize: responsiveFontSize(32),
    color: colors.appTextColor1,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  letterTransliteration: {
    fontSize: responsiveFontSize(16),
    color: colors.appColor1,
    fontWeight: '600',
    marginBottom: 4,
  },
  letterRules: {
    fontSize: responsiveFontSize(12),
    color: colors.appTextColor2,
    textAlign: 'center',
  },
  selectedLetterContainer: {
    backgroundColor: colors.appBgColor2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedLetterTitle: {
    fontSize: responsiveFontSize(20),
    color: colors.appTextColor1,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedLetterSubtitle: {
    fontSize: responsiveFontSize(16),
    color: colors.appColor1,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectedLetterRules: {
    fontSize: responsiveFontSize(14),
    color: colors.appTextColor2,
    textAlign: 'center',
  },
  controlsContainer: {
    gap: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    backgroundColor: colors.appColor1,
  },
  recordButton: {
    backgroundColor: colors.appColor2,
  },
  recordingButton: {
    backgroundColor: '#FF4444',
  },
  playRecordingButton: {
    backgroundColor: colors.appTextColor2,
  },
  analyzeButton: {
    backgroundColor: '#9C27B0',
  },
  controlButtonText: {
    color: colors.appBgColor1,
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginLeft: 8,
  },
  analysisContainer: {
    backgroundColor: colors.appBgColor2,
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  analysisTitle: {
    fontSize: responsiveFontSize(20),
    color: colors.appTextColor1,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    marginBottom: 20,
  },
  scoreText: {
    fontSize: responsiveFontSize(18),
    color: colors.appTextColor1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreBar: {
    height: 12,
    backgroundColor: colors.appBgColor1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 6,
  },
  detailedScoresContainer: {
    marginBottom: 20,
  },
  detailedScoresTitle: {
    fontSize: responsiveFontSize(16),
    color: colors.appTextColor1,
    fontWeight: '600',
    marginBottom: 12,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.appBgColor1,
  },
  scoreAspect: {
    fontSize: responsiveFontSize(14),
    color: colors.appTextColor1,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: responsiveFontSize(14),
    color: colors.appColor1,
    fontWeight: 'bold',
  },
  errorsContainer: {
    marginBottom: 20,
  },
  errorsTitle: {
    fontSize: responsiveFontSize(16),
    color: '#F44336',
    fontWeight: '600',
    marginBottom: 12,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorMessage: {
    fontSize: responsiveFontSize(14),
    color: colors.appTextColor1,
    fontWeight: '500',
    marginBottom: 4,
  },
  errorSuggestion: {
    fontSize: responsiveFontSize(12),
    color: colors.appTextColor2,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: responsiveFontSize(16),
    color: colors.appTextColor1,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: responsiveFontSize(14),
    color: colors.appTextColor2,
    lineHeight: 24,
    marginBottom: 4,
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: responsiveFontSize(16),
    color: colors.appColor1,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: responsiveFontSize(14),
    color: colors.appTextColor2,
    lineHeight: 24,
    marginBottom: 4,
  },
});

export default PronunciationTest;
