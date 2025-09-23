import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { qaidaService, userProgressService } from '../../../services/firebaseUtilities/qaidaService';
import { qaidaLessons } from '../../../services/qaidaData';
import { Text } from '../../../components';

const QaidaScreen = ({ navigation }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);
  const { signedInUser, isLoggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    loadLessons();
    loadUserProgress();
  }, []);

  // Reload progress when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserProgress();
    }, [signedInUser?.uid])
  );

  const loadLessons = async () => {
    try {
      setLoading(true);
      // For now, use local data. In production, fetch from Firestore
      setLessons(qaidaLessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
      Alert.alert('Error', 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!signedInUser?.uid) return;
    
    try {
      console.log('Loading user progress for:', signedInUser.uid);
      const progress = await userProgressService.getUserProgress(signedInUser.uid);
      console.log('Progress loaded:', progress);
      setUserProgress(progress);
      setFirestoreAvailable(true);
    } catch (error) {
      console.error('Error loading user progress:', error);
      // Set empty progress to prevent UI issues
      setUserProgress(null);
      setFirestoreAvailable(false);
    }
  };

  const getLessonStatus = (lessonId) => {
    if (!userProgress) return 'not_started';
    
    const completedLessons = userProgress.qaidaProgress?.completedLessons || [];
    const currentLesson = userProgress.qaidaProgress?.currentLesson;
    const lessonsProgress = userProgress.qaidaProgress?.lessonsProgress || {};
    const lessonProgress = lessonsProgress[lessonId];
    
    // Check if lesson is explicitly completed
    if (completedLessons.includes(lessonId)) {
      return 'completed';
    }
    
    // Check if lesson has segment progress (user has started working on it)
    if (lessonProgress && lessonProgress.segmentsProgress) {
      const segmentsProgress = lessonProgress.segmentsProgress;
      const completedSegments = Object.values(segmentsProgress).filter(seg => seg.isCompleted);
      
      if (completedSegments.length > 0) {
        return 'current'; // User has completed some segments
      }
    }
    
    // Check if this is the current lesson
    if (currentLesson === lessonId) {
      return 'current';
    }
    
    return 'not_started';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="check-circle" size={24} color="#4CAF50" />;
      case 'current':
        return <Icon name="play-circle-filled" size={24} color="#2196F3" />;
      default:
        return <Icon name="radio-button-unchecked" size={24} color="#9E9E9E" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'current':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const handleLessonPress = (lesson) => {
    navigation.navigate('qaidaLesson', { lesson });
  };

  const renderLessonItem = ({ item }) => {
    const status = getLessonStatus(item.id);
    const isLocked = status === 'not_started' && item.order > 1 && 
      !userProgress?.qaidaProgress?.completedLessons?.includes(`lesson_${item.order - 1}`);

    return (
      <View style={[styles.lessonCard, isLocked && styles.lockedCard]}>
        <TouchableOpacity
          style={styles.lessonItem}
          onPress={() => !isLocked && handleLessonPress(item)}
          disabled={isLocked}
        >
          <View style={styles.lessonHeader}>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDescription}>{item.description}</Text>
              <View style={styles.lessonMeta}>
                <Text style={styles.lessonLevel}>Level {item.level}</Text>
                <Text style={styles.segmentCount}>
                  {item.segments?.length || 0} segments
                </Text>
              </View>
            </View>
            <View style={styles.statusContainer}>
              {isLocked ? (
                <Icon name="lock" size={24} color="#9E9E9E" />
              ) : (
                getStatusIcon(status)
              )}
            </View>
          </View>
          
          <View style={styles.arabicPreview}>
            <Text style={styles.arabicText}>{item.arabicText}</Text>
            <Text style={styles.transliteration}>{item.transliteration}</Text>
          </View>

          {!isLocked && (
            <View style={styles.lessonActions}>
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: getStatusColor(status) }]}
                onPress={() => handleLessonPress(item)}
              >
                <Text style={styles.startButtonText}>Start Lesson</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading lessons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Noorani Qaida</Text>
        <Text style={styles.headerSubtitle}>
          Learn Arabic letters and pronunciation
        </Text>
        {!firestoreAvailable && (
          <View style={styles.offlineWarning}>
            <Text style={styles.offlineText}>
              ⚠️ Offline mode - Progress will sync when connection is restored
            </Text>
          </View>
        )}
        
        {/* Progress Summary */}
        {signedInUser?.uid && userProgress && (
          <View style={styles.progressSummary}>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProgress.qaidaProgress?.completedLessons?.length || 0}</Text>
                <Text style={styles.statLabel}>Lessons Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{Object.keys(userProgress.qaidaProgress?.lessonsProgress || {}).length}</Text>
                <Text style={styles.statLabel}>Lessons Started</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{lessons.length}</Text>
                <Text style={styles.statLabel}>Total Lessons</Text>
              </View>
            </View>
            <View style={styles.overallProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((userProgress.qaidaProgress?.completedLessons?.length || 0) / lessons.length) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(((userProgress.qaidaProgress?.completedLessons?.length || 0) / lessons.length) * 100)}% Complete
              </Text>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={lessons}
        renderItem={renderLessonItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginTop: 4,
  },
  offlineWarning: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  offlineText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E3F2FD',
    marginTop: 2,
  },
  overallProgress: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  lessonCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonItem: {
    padding: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lessonLevel: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  segmentCount: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicPreview: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  transliteration: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  lessonActions: {
    alignItems: 'center',
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default QaidaScreen;
