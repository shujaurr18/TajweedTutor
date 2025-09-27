import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const QuranAyah = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { surah, ayah } = route.params;
    
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
    
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingPath, setRecordingPath] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const startRecording = async () => {
        try {
            const result = await audioRecorderPlayer.startRecorder();
            setRecordingPath(result);
            setIsRecording(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setIsRecording(false);
            // Here you would process the recording for Tajweed feedback
            simulateTajweedFeedback();
        } catch (error) {
            Alert.alert('Error', 'Failed to stop recording');
        }
    };

    const playReference = async () => {
        try {
            setIsPlaying(true);
            // Simulate playing reference audio
            setTimeout(() => {
                setIsPlaying(false);
            }, 3000);
        } catch (error) {
            Alert.alert('Error', 'Failed to play reference audio');
        }
    };

    const playRecording = async () => {
        if (recordingPath) {
            try {
                setIsPlaying(true);
                await audioRecorderPlayer.startPlayer(recordingPath);
                setTimeout(() => {
                    setIsPlaying(false);
                }, 3000);
            } catch (error) {
                Alert.alert('Error', 'Failed to play recording');
            }
        }
    };

    const simulateTajweedFeedback = () => {
        // Simulate Tajweed analysis
        const feedbackData = {
            score: 85,
            errors: [
                {
                    type: 'Madd',
                    message: 'Mad Asli not elongated properly',
                    position: 15,
                    severity: 'medium'
                },
                {
                    type: 'Makharij',
                    message: 'Articulation point needs adjustment',
                    position: 8,
                    severity: 'low'
                }
            ],
            suggestions: [
                'Focus on elongating the Madd letters',
                'Practice the articulation points of Arabic letters'
            ]
        };
        
        setFeedback(feedbackData);
        setShowFeedback(true);
    };

    const renderFeedback = () => {
        if (!showFeedback || !feedback) return null;

        return (
            <View style={styles.feedbackContainer}>
                <View style={styles.feedbackHeader}>
                    <Text style={styles.feedbackTitle}>Tajweed Feedback</Text>
                    <TouchableOpacity onPress={() => setShowFeedback(false)}>
                        <Icon name="x" type="feather" size={24} color={colors.appTextColor1} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Score: {feedback.score}%</Text>
                    <View style={styles.scoreBar}>
                        <View style={[styles.scoreFill, { width: `${feedback.score}%` }]} />
                    </View>
                </View>

                {feedback.errors.map((error, index) => (
                    <View key={index} style={styles.errorItem}>
                        <View style={[styles.errorIndicator, { backgroundColor: getErrorColor(error.severity) }]} />
                        <View style={styles.errorContent}>
                            <Text style={styles.errorType}>{error.type}</Text>
                            <Text style={styles.errorMessage}>{error.message}</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionsTitle}>Suggestions:</Text>
                    {feedback.suggestions.map((suggestion, index) => (
                        <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
                    ))}
                </View>
            </View>
        );
    };

    const getErrorColor = (severity) => {
        switch (severity) {
            case 'high': return '#FF4444';
            case 'medium': return '#FF8800';
            case 'low': return '#FFBB33';
            default: return '#FFBB33';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
            
            <Header
                title={`${surah.name} - Ayah ${ayah.number}`}
                showBackButton={true}
                rightComponent={
                    <TouchableOpacity>
                        <Icon name="bookmark" type="feather" size={24} color={colors.appTextColor1} />
                    </TouchableOpacity>
                }
            />

            <Wrapper style={styles.content}>
                {/* Ayah Display */}
                <View style={styles.ayahContainer}>
                    <Text style={styles.ayahText}>{ayah.text}</Text>
                    <Spacer height={16} />
                    <Text style={styles.translation}>{ayah.translation}</Text>
                    <Text style={styles.transliteration}>{ayah.transliteration}</Text>
                </View>

                <Spacer height={30} />

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
                </View>

                <Spacer height={20} />

                {/* Feedback */}
                {renderFeedback()}
            </Wrapper>
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
    ayahContainer: {
        backgroundColor: colors.appBgColor2,
        padding: 20,
        borderRadius: 12,
        marginTop: 10,
    },
    ayahText: {
        fontSize: responsiveFontSize(22),
        color: colors.appTextColor1,
        lineHeight: 40,
        textAlign: 'right',
        fontWeight: '500',
    },
    translation: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor2,
        lineHeight: 26,
        fontStyle: 'italic',
    },
    transliteration: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor3,
        lineHeight: 22,
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
    controlButtonText: {
        color: colors.appBgColor1,
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginLeft: 8,
    },
    feedbackContainer: {
        backgroundColor: colors.appBgColor2,
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
    },
    feedbackHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    feedbackTitle: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
    },
    scoreContainer: {
        marginBottom: 20,
    },
    scoreText: {
        fontSize: responsiveFontSize(16),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 8,
    },
    scoreBar: {
        height: 8,
        backgroundColor: colors.appBgColor1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreFill: {
        height: '100%',
        backgroundColor: colors.appColor1,
        borderRadius: 4,
    },
    errorItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    errorIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
        marginRight: 12,
    },
    errorContent: {
        flex: 1,
    },
    errorType: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 2,
    },
    errorMessage: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
        lineHeight: 20,
    },
    suggestionsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.appBgColor1,
    },
    suggestionsTitle: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 8,
    },
    suggestionText: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
        lineHeight: 20,
        marginBottom: 4,
    },
});

export default QuranAyah;
