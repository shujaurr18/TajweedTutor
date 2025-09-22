import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from '../../../../components';

const QaidaLessonScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userRecording, setUserRecording] = useState(null);

  const currentSegment = lesson.segments[currentSegmentIndex];

  const handlePlayReference = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 2000);
    Alert.alert('Info', 'Playing reference audio...');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setUserRecording({ path: 'mock_recording.mp3', duration: 2.5 });
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setUserRecording({ path: 'mock_recording.mp3', duration: 2.5 });
  };

  const handlePlayRecording = () => {
    Alert.alert('Info', 'Playing your recording...');
  };

  const handleNextSegment = () => {
    if (currentSegmentIndex < lesson.segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setUserRecording(null);
    }
  };

  const handlePreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      setUserRecording(null);
    }
  };

  const handleCompleteSegment = () => {
    if (!userRecording) {
      Alert.alert('Recording Required', 'Please record your recitation before completing the segment.');
      return;
    }

    const score = Math.floor(Math.random() * 30) + 70;
    Alert.alert('Segment Completed!', `Great job! Your score: ${score}%`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSubtitle}>
            Segment {currentSegmentIndex + 1} of {lesson.segments.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentSegmentIndex + 1) / lesson.segments.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentSegmentIndex + 1} / {lesson.segments.length}
          </Text>
        </View>

        {/* Current Segment */}
        <View style={styles.segmentCard}>
          <Text style={styles.segmentTitle}>
            {currentSegment.transliteration}
          </Text>

          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>
              {currentSegment.text}
            </Text>
          </View>

          <View style={styles.tajweedRules}>
            <Text style={styles.tajweedTitle}>Tajweed Rules:</Text>
            {currentSegment.tajweedRules.map((rule, index) => (
              <Text key={index} style={styles.tajweedRule}>
                • {rule}
              </Text>
            ))}
          </View>
        </View>

        {/* Audio Controls */}
        <View style={styles.audioCard}>
          <Text style={styles.audioTitle}>Reference Audio</Text>
          
          <TouchableOpacity
            style={[styles.audioButton, isPlaying && styles.audioButtonActive]}
            onPress={handlePlayReference}
            disabled={isPlaying}
          >
            <Icon 
              name={isPlaying ? "stop" : "play-arrow"} 
              size={32} 
              color={isPlaying ? "#FFFFFF" : "#2196F3"} 
            />
            <Text style={[styles.audioButtonText, isPlaying && styles.audioButtonTextActive]}>
              {isPlaying ? 'Playing...' : 'Play Reference'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recording Controls */}
        <View style={styles.recordingCard}>
          <Text style={styles.recordingTitle}>Your Recording</Text>
          
          {!isRecording && !userRecording && (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={handleStartRecording}
            >
              <Icon name="mic" size={32} color="#FFFFFF" />
              <Text style={styles.recordButtonText}>Start Recording</Text>
            </TouchableOpacity>
          )}

          {isRecording && (
            <View style={styles.recordingActive}>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
              </View>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={handleStopRecording}
              >
                <Icon name="stop" size={24} color="#FFFFFF" />
                <Text style={styles.stopButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          )}

          {userRecording && !isRecording && (
            <View style={styles.recordingComplete}>
              <View style={styles.recordingInfo}>
                <Icon name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.recordingInfoText}>
                  Recording completed
                </Text>
              </View>
              <View style={styles.recordingActions}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={handlePlayRecording}
                >
                  <Icon name="play-arrow" size={20} color="#2196F3" />
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => setUserRecording(null)}
                >
                  <Icon name="refresh" size={20} color="#666" />
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentSegmentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousSegment}
            disabled={currentSegmentIndex === 0}
          >
            <Icon name="chevron-left" size={24} color={currentSegmentIndex === 0 ? "#CCC" : "#2196F3"} />
            <Text style={[styles.navButtonText, currentSegmentIndex === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, currentSegmentIndex === lesson.segments.length - 1 && styles.navButtonDisabled]}
            onPress={handleNextSegment}
            disabled={currentSegmentIndex === lesson.segments.length - 1}
          >
            <Text style={[styles.navButtonText, currentSegmentIndex === lesson.segments.length - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <Icon name="chevron-right" size={24} color={currentSegmentIndex === lesson.segments.length - 1 ? "#CCC" : "#2196F3"} />
          </TouchableOpacity>
        </View>

        {/* Complete Button */}
        {userRecording && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteSegment}
          >
            <Text style={styles.completeButtonText}>Complete Segment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  segmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  segmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  arabicContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 48,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tajweedRules: {
    marginTop: 16,
  },
  tajweedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tajweedRule: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  audioCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  audioButtonActive: {
    backgroundColor: '#2196F3',
  },
  audioButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  audioButtonTextActive: {
    color: '#FFFFFF',
  },
  recordingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F44336',
    borderRadius: 12,
  },
  recordButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recordingActive: {
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#666',
    borderRadius: 8,
  },
  stopButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recordingComplete: {
    alignItems: 'center',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingInfoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  playButtonText: {
    marginLeft: 4,
    color: '#2196F3',
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  retryButtonText: {
    marginLeft: 4,
    color: '#666',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  navButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
  },
  navButtonText: {
    marginHorizontal: 4,
    color: '#2196F3',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QaidaLessonScreen;