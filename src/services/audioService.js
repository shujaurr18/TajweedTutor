import Sound from 'react-native-sound';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Initialize audio service
Sound.setCategory('Playback');

const audioRecorderPlayer = new AudioRecorderPlayer();

class AudioService {
  constructor() {
    this.currentSound = null;
    this.isRecording = false;
    this.recordingPath = null;
    this.recordingDuration = 0;
    this.recordingTimer = null;
  }

  // Permission handling
  async requestMicrophonePermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Tajweed Tutor needs access to your microphone to record your recitation.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }

  // Audio Playback Methods
  async playAudio(audioPath, onComplete = null, onError = null) {
    try {
      // Stop any currently playing audio
      this.stopAudio();

      return new Promise((resolve, reject) => {
        this.currentSound = new Sound(audioPath, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.error('Error loading audio:', error);
            onError && onError(error);
            reject(error);
            return;
          }

          // Play the sound
          this.currentSound.play((success) => {
            if (success) {
              console.log('Audio played successfully');
              onComplete && onComplete();
              resolve(true);
            } else {
              console.error('Error playing audio');
              onError && onError('Failed to play audio');
              reject('Failed to play audio');
            }
          });
        });
      });
    } catch (error) {
      console.error('Error in playAudio:', error);
      onError && onError(error);
      throw error;
    }
  }

  async playAudioFromUrl(audioUrl, onComplete = null, onError = null) {
    try {
      this.stopAudio();

      return new Promise((resolve, reject) => {
        this.currentSound = new Sound(audioUrl, null, (error) => {
          if (error) {
            console.error('Error loading audio from URL:', error);
            onError && onError(error);
            reject(error);
            return;
          }

          this.currentSound.play((success) => {
            if (success) {
              console.log('Audio from URL played successfully');
              onComplete && onComplete();
              resolve(true);
            } else {
              console.error('Error playing audio from URL');
              onError && onError('Failed to play audio');
              reject('Failed to play audio');
            }
          });
        });
      });
    } catch (error) {
      console.error('Error in playAudioFromUrl:', error);
      onError && onError(error);
      throw error;
    }
  }

  stopAudio() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.release();
      this.currentSound = null;
    }
  }

  pauseAudio() {
    if (this.currentSound) {
      this.currentSound.pause();
    }
  }

  resumeAudio() {
    if (this.currentSound) {
      this.currentSound.play();
    }
  }

  // Audio Recording Methods
  async startRecording(onProgress = null) {
    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      const result = await audioRecorderPlayer.startRecorder();
      this.isRecording = true;
      this.recordingPath = result;
      this.recordingDuration = 0;

      // Start timer for recording duration
      this.recordingTimer = setInterval(() => {
        this.recordingDuration += 0.1;
        onProgress && onProgress(this.recordingDuration);
      }, 100);

      console.log('Recording started:', result);
      return result;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async stopRecording() {
    try {
      if (!this.isRecording) {
        throw new Error('No recording in progress');
      }

      const result = await audioRecorderPlayer.stopRecorder();
      this.isRecording = false;
      
      // Clear timer
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }

      console.log('Recording stopped:', result);
      return {
        path: result,
        duration: this.recordingDuration
      };
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async playRecording(recordingPath, onComplete = null, onError = null) {
    try {
      return new Promise((resolve, reject) => {
        this.currentSound = new Sound(recordingPath, null, (error) => {
          if (error) {
            console.error('Error loading recording:', error);
            onError && onError(error);
            reject(error);
            return;
          }

          this.currentSound.play((success) => {
            if (success) {
              console.log('Recording played successfully');
              onComplete && onComplete();
              resolve(true);
            } else {
              console.error('Error playing recording');
              onError && onError('Failed to play recording');
              reject('Failed to play recording');
            }
          });
        });
      });
    } catch (error) {
      console.error('Error in playRecording:', error);
      onError && onError(error);
      throw error;
    }
  }

  // Utility Methods
  getRecordingDuration() {
    return this.recordingDuration;
  }

  isCurrentlyRecording() {
    return this.isRecording;
  }

  isCurrentlyPlaying() {
    return this.currentSound !== null;
  }

  // Cleanup
  cleanup() {
    this.stopAudio();
    if (this.isRecording) {
      this.stopRecording();
    }
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  // Audio format validation
  isValidAudioFormat(filename) {
    const validFormats = ['.mp3', '.wav', '.m4a', '.aac'];
    return validFormats.some(format => filename.toLowerCase().endsWith(format));
  }

  // Get audio duration (placeholder - would need native implementation for accurate duration)
  async getAudioDuration(audioPath) {
    // This would typically require a native module for accurate duration
    // For now, return a placeholder
    return new Promise((resolve) => {
      const sound = new Sound(audioPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          resolve(0);
        } else {
          resolve(sound.getDuration() || 0);
        }
      });
    });
  }
}

// Create singleton instance
const audioService = new AudioService();

export default audioService;
