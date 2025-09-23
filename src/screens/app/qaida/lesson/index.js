import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from '../../../../components';
import { userProgressService } from '../../../../services/firebaseUtilities/qaidaService';

const QaidaLessonScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const { signedInUser, isLoggedIn } = useSelector(state => state.auth);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userRecording, setUserRecording] = useState(null);
  const [completedSegments, setCompletedSegments] = useState(new Set());

  const currentSegment = lesson.segments[currentSegmentIndex];

  // Load existing progress when component mounts
  useEffect(() => {
    console.log('Lesson screen mounted');
    console.log('User from Redux:', signedInUser);
    console.log('User ID:', signedInUser?.uid);
    console.log('Is logged in:', isLoggedIn);
    loadExistingProgress();
  }, []);

  const loadExistingProgress = async () => {
    if (!signedInUser?.uid) return;
    
    try {
      const progress = await userProgressService.getUserProgress(signedInUser.uid);
      if (progress?.qaidaProgress?.lessonsProgress?.[lesson.id]?.segmentsProgress) {
        const segmentsProgress = progress.qaidaProgress.lessonsProgress[lesson.id].segmentsProgress;
        const completed = new Set();
        
        Object.keys(segmentsProgress).forEach(segmentId => {
          if (segmentsProgress[segmentId].isCompleted) {
            completed.add(segmentId);
          }
        });
        
        setCompletedSegments(completed);
        
        // Set current segment to first incomplete one
        const firstIncompleteIndex = lesson.segments.findIndex(segment => 
          !completed.has(segment.id)
        );
        if (firstIncompleteIndex !== -1) {
          setCurrentSegmentIndex(firstIncompleteIndex);
        }
      }
    } catch (error) {
      console.error('Error loading existing progress:', error);
    }
  };

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

  const handleCompleteSegment = async () => {
    if (!userRecording) {
      Alert.alert('Recording Required', 'Please record your recitation before completing the segment.');
      return;
    }

    console.log('Starting segment completion...');
    console.log('User ID:', signedInUser?.uid);
    console.log('Lesson ID:', lesson.id);
    console.log('Segment ID:', currentSegment.id);

    try {
      const score = Math.floor(Math.random() * 30) + 70;
      console.log('Generated score:', score);
      
      // Mark segment as completed locally
      const newCompletedSegments = new Set([...completedSegments, currentSegment.id]);
      setCompletedSegments(newCompletedSegments);
      console.log('Updated completed segments:', Array.from(newCompletedSegments));
      
      // Save progress to Firestore if user is logged in
      if (signedInUser?.uid) {
        console.log('Saving progress to Firestore...');
        const result = await userProgressService.updateSegmentProgress(
          signedInUser.uid,
          lesson.id,
          currentSegment.id,
          score,
          [] // errors array - would be populated by native audio processing
        );
        console.log('Progress saved result:', result);
      } else {
        console.log('No user ID, skipping Firestore save');
      }

      // Check if all segments are completed
      const allSegmentsCompleted = lesson.segments.every(segment => 
        newCompletedSegments.has(segment.id)
      );
      console.log('All segments completed:', allSegmentsCompleted);
      console.log('Completed segments:', Array.from(newCompletedSegments));
      console.log('Total segments:', lesson.segments.length);

      // If all segments are completed, mark lesson as completed
      if (allSegmentsCompleted) {
        console.log('All segments completed! Marking lesson as completed...');
        handleCompleteLesson();
        return;
      }

      Alert.alert(
        'Segment Completed!', 
        `Great job! Your score: ${score}%`,
        [
          {
            text: 'Continue',
            onPress: () => {
              if (currentSegmentIndex < lesson.segments.length - 1) {
                handleNextSegment();
              } else {
                // Go back to first incomplete segment
                const firstIncompleteIndex = lesson.segments.findIndex(segment => 
                  !newCompletedSegments.has(segment.id)
                );
                if (firstIncompleteIndex !== -1) {
                  setCurrentSegmentIndex(firstIncompleteIndex);
                  setUserRecording(null);
                }
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error completing segment:', error);
      Alert.alert('Error', `Failed to save progress: ${error.message}`);
    }
  };

  const handleCompleteLesson = async () => {
    console.log('Starting lesson completion...');
    console.log('User ID:', signedInUser?.uid);
    console.log('Lesson ID:', lesson.id);
    
    try {
      // Calculate overall lesson score
      const averageScore = Math.floor(Math.random() * 30) + 70;
      console.log('Lesson average score:', averageScore);

      // Mark lesson as completed in Firestore if user is logged in
      if (signedInUser?.uid) {
        console.log('Saving lesson completion to Firestore...');
        const result = await userProgressService.markLessonCompleted(signedInUser.uid, lesson.id, averageScore);
        console.log('Lesson completion saved result:', result);
      } else {
        console.log('No user ID, skipping lesson completion save');
      }

      Alert.alert(
        'Lesson Completed!',
        `Congratulations! You completed ${lesson.title} with a score of ${averageScore}%`,
        [
          {
            text: 'Back to Lessons',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
      Alert.alert('Error', `Failed to save lesson progress: ${error.message}`);
    }
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
                { width: `${(completedSegments.size / lesson.segments.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {completedSegments.size} / {lesson.segments.length} segments completed
          </Text>
        </View>

        {/* Segment Progress List */}
        <View style={styles.segmentProgressContainer}>
          <Text style={styles.segmentProgressTitle}>Segment Progress:</Text>
          <View style={styles.segmentList}>
            {lesson.segments.map((segment, index) => (
              <View key={segment.id} style={styles.segmentItem}>
                <View style={[
                  styles.segmentIndicator,
                  completedSegments.has(segment.id) ? styles.segmentCompleted : styles.segmentPending
                ]}>
                  <Text style={styles.segmentNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.segmentText}>{segment.text} - {segment.transliteration}</Text>
                {completedSegments.has(segment.id) && (
                  <Icon name="check-circle" size={16} color="#4CAF50" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Current Segment */}
        <View style={styles.segmentCard}>
          <View style={styles.segmentHeader}>
            <Text style={styles.segmentTitle}>
              {currentSegment.transliteration}
            </Text>
            {completedSegments.has(currentSegment.id) && (
              <Icon name="check-circle" size={24} color="#4CAF50" />
            )}
          </View>

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
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  segmentProgressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  segmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    minWidth: '45%',
  },
  segmentIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  segmentCompleted: {
    backgroundColor: '#4CAF50',
  },
  segmentPending: {
    backgroundColor: '#E0E0E0',
  },
  segmentNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  segmentText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
});

export default QaidaLessonScreen;