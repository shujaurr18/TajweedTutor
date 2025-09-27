import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Sound from 'react-native-sound';
import { PermissionsAndroid, Platform } from 'react-native';

class AudioService {
  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.currentSound = null;
    this.isRecording = false;
    this.isPlaying = false;
    this.recordingPath = null;
    
    // Configure Sound library
    Sound.setCategory('Playback');
  }

  // Permission handling
  async requestAudioPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const allPermissionsGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        return allPermissionsGranted;
      } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
      }
    }
    return true; // iOS permissions are handled in Info.plist
  }

  // Recording functionality
  async startRecording() {
    try {
      const hasPermission = await this.requestAudioPermissions();
      if (!hasPermission) {
        throw new Error('Audio recording permission denied');
      }

      const result = await this.audioRecorderPlayer.startRecorder();
      this.recordingPath = result;
      this.isRecording = true;
      
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

      const result = await this.audioRecorderPlayer.stopRecorder();
      this.isRecording = false;
      
      console.log('Recording stopped:', result);
      return result;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async pauseRecording() {
    try {
      if (!this.isRecording) {
        throw new Error('No recording in progress');
      }

      await this.audioRecorderPlayer.pauseRecorder();
      console.log('Recording paused');
    } catch (error) {
      console.error('Error pausing recording:', error);
      throw error;
    }
  }

  async resumeRecording() {
    try {
      await this.audioRecorderPlayer.resumeRecorder();
      console.log('Recording resumed');
    } catch (error) {
      console.error('Error resuming recording:', error);
      throw error;
    }
  }

  // Playback functionality
  async playRecording(path) {
    try {
      if (this.isPlaying) {
        await this.stopPlayback();
      }

      const result = await this.audioRecorderPlayer.startPlayer(path);
      this.isPlaying = true;
      
      console.log('Playing recording:', result);
      return result;
    } catch (error) {
      console.error('Error playing recording:', error);
      throw error;
    }
  }

  async playReferenceAudio(url) {
    try {
      if (this.isPlaying) {
        await this.stopPlayback();
      }

      return new Promise((resolve, reject) => {
        this.currentSound = new Sound(url, '', (error) => {
          if (error) {
            console.error('Error loading sound:', error);
            reject(error);
            return;
          }

          this.currentSound.play((success) => {
            this.isPlaying = false;
            if (success) {
              console.log('Reference audio played successfully');
              resolve();
            } else {
              console.error('Error playing reference audio');
              reject(new Error('Failed to play reference audio'));
            }
          });

          this.isPlaying = true;
        });
      });
    } catch (error) {
      console.error('Error playing reference audio:', error);
      throw error;
    }
  }

  async stopPlayback() {
    try {
      if (this.currentSound) {
        this.currentSound.stop();
        this.currentSound.release();
        this.currentSound = null;
      }

      if (this.isPlaying) {
        await this.audioRecorderPlayer.stopPlayer();
      }

      this.isPlaying = false;
      console.log('Playback stopped');
    } catch (error) {
      console.error('Error stopping playback:', error);
      throw error;
    }
  }

  async pausePlayback() {
    try {
      if (this.currentSound) {
        this.currentSound.pause();
      } else if (this.isPlaying) {
        await this.audioRecorderPlayer.pausePlayer();
      }
      
      console.log('Playback paused');
    } catch (error) {
      console.error('Error pausing playback:', error);
      throw error;
    }
  }

  async resumePlayback() {
    try {
      if (this.currentSound) {
        this.currentSound.play();
      } else if (this.isPlaying) {
        await this.audioRecorderPlayer.resumePlayer();
      }
      
      console.log('Playback resumed');
    } catch (error) {
      console.error('Error resuming playback:', error);
      throw error;
    }
  }

  // Audio analysis and processing
  async analyzeRecording(recordingPath, referencePath) {
    try {
      // This would integrate with native modules for audio analysis
      // For now, return mock data
      const analysis = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        errors: [
          {
            type: 'Madd',
            message: 'Mad Asli not elongated properly',
            position: 15,
            severity: 'medium',
            timestamp: 1.5,
          },
          {
            type: 'Makharij',
            message: 'Articulation point needs adjustment',
            position: 8,
            severity: 'low',
            timestamp: 0.8,
          },
        ],
        suggestions: [
          'Focus on elongating the Madd letters',
          'Practice the articulation points of Arabic letters',
        ],
        duration: 3.2,
        confidence: 0.85,
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing recording:', error);
      throw error;
    }
  }

  // Utility methods
  getRecordingDuration() {
    return this.audioRecorderPlayer.mmssss;
  }

  getPlaybackDuration() {
    return this.audioRecorderPlayer.mmssss;
  }

  isCurrentlyRecording() {
    return this.isRecording;
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  getCurrentRecordingPath() {
    return this.recordingPath;
  }

  // Cleanup
  async cleanup() {
    try {
      if (this.isRecording) {
        await this.stopRecording();
      }
      
      if (this.isPlaying) {
        await this.stopPlayback();
      }

      if (this.currentSound) {
        this.currentSound.release();
        this.currentSound = null;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Format time for display
  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get audio file info
  async getAudioFileInfo(path) {
    try {
      // This would use native modules to get file info
      // For now, return mock data
      return {
        duration: 3000, // milliseconds
        size: 1024 * 100, // bytes
        format: 'mp3',
        sampleRate: 44100,
        channels: 1,
      };
    } catch (error) {
      console.error('Error getting audio file info:', error);
      throw error;
    }
  }
}

export default new AudioService();