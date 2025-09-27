import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';

const { width } = Dimensions.get('window');

const Progress = () => {
    const navigation = useNavigation();
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'all'

    // Dummy progress data
    const progressData = {
        qaidaProgress: {
            totalLessons: 30,
            completedLessons: 12,
            currentLesson: 13,
            averageScore: 78,
            streak: 7,
        },
        quranProgress: {
            totalAyahs: 6236,
            completedAyahs: 156,
            currentSurah: 'Al-Baqarah',
            currentAyah: 45,
            averageScore: 82,
            streak: 5,
        },
        weeklyStats: {
            studyTime: 420, // minutes
            lessonsCompleted: 8,
            averageScore: 80,
            improvement: 5,
        },
        monthlyStats: {
            studyTime: 1680, // minutes
            lessonsCompleted: 32,
            averageScore: 79,
            improvement: 8,
        },
        achievements: [
            { id: 1, title: 'First Steps', description: 'Complete your first Qaida lesson', earned: true, date: '2024-01-15' },
            { id: 2, title: 'Consistent Learner', description: 'Study for 7 days in a row', earned: true, date: '2024-01-20' },
            { id: 3, title: 'Quran Explorer', description: 'Read 100 Ayahs', earned: true, date: '2024-01-25' },
            { id: 4, title: 'Tajweed Master', description: 'Achieve 90% accuracy in 10 lessons', earned: false, date: null },
            { id: 5, title: 'Quran Scholar', description: 'Complete 5 Surahs', earned: false, date: null },
        ],
        errorAnalysis: {
            commonErrors: [
                { type: 'Madd', count: 12, percentage: 35 },
                { type: 'Makharij', count: 8, percentage: 23 },
                { type: 'Ghunna', count: 6, percentage: 18 },
                { type: 'Qalqalah', count: 4, percentage: 12 },
                { type: 'Others', count: 4, percentage: 12 },
            ],
        },
    };

    const getCurrentStats = () => {
        return selectedPeriod === 'week' ? progressData.weeklyStats : progressData.monthlyStats;
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const renderProgressCard = (title, current, total, percentage, color = colors.appColor1) => (
        <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>{title}</Text>
                <Text style={styles.progressPercentage}>{percentage}%</Text>
            </View>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.progressText}>{current} of {total} completed</Text>
        </View>
    );

    const renderStatCard = (icon, title, value, subtitle, color = colors.appColor1) => (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: color }]}>
                <Icon name={icon} type="feather" size={24} color={colors.appBgColor1} />
            </View>
            <View style={styles.statContent}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
                {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );

    const renderAchievement = (achievement) => (
        <View key={achievement.id} style={[styles.achievementItem, !achievement.earned && styles.achievementLocked]}>
            <View style={[styles.achievementIcon, { backgroundColor: achievement.earned ? colors.appColor1 : colors.appTextColor3 }]}>
                <Icon 
                    name={achievement.earned ? "award" : "lock"} 
                    type="feather" 
                    size={20} 
                    color={colors.appBgColor1} 
                />
            </View>
            <View style={styles.achievementContent}>
                <Text style={[styles.achievementTitle, !achievement.earned && styles.achievementTitleLocked]}>
                    {achievement.title}
                </Text>
                <Text style={[styles.achievementDescription, !achievement.earned && styles.achievementDescriptionLocked]}>
                    {achievement.description}
                </Text>
                {achievement.earned && (
                    <Text style={styles.achievementDate}>Earned on {achievement.date}</Text>
                )}
            </View>
        </View>
    );

    const renderErrorChart = () => (
        <View style={styles.errorChartContainer}>
            <Text style={styles.chartTitle}>Common Errors</Text>
            {progressData.errorAnalysis.commonErrors.map((error, index) => (
                <View key={index} style={styles.errorItem}>
                    <View style={styles.errorInfo}>
                        <Text style={styles.errorType}>{error.type}</Text>
                        <Text style={styles.errorCount}>{error.count} errors</Text>
                    </View>
                    <View style={styles.errorBar}>
                        <View style={[styles.errorBarFill, { width: `${error.percentage}%` }]} />
                    </View>
                    <Text style={styles.errorPercentage}>{error.percentage}%</Text>
                </View>
            ))}
        </View>
    );

    const currentStats = getCurrentStats();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
            
            <Header
                title="Progress Dashboard"
                showBackButton={false}
                rightComponent={
                    <TouchableOpacity>
                        <Icon name="share" type="feather" size={24} color={colors.appTextColor1} />
                    </TouchableOpacity>
                }
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === 'week' && styles.activePeriodButton]}
                        onPress={() => setSelectedPeriod('week')}
                    >
                        <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.activePeriodButtonText]}>
                            Week
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === 'month' && styles.activePeriodButton]}
                        onPress={() => setSelectedPeriod('month')}
                    >
                        <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.activePeriodButtonText]}>
                            Month
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === 'all' && styles.activePeriodButton]}
                        onPress={() => setSelectedPeriod('all')}
                    >
                        <Text style={[styles.periodButtonText, selectedPeriod === 'all' && styles.activePeriodButtonText]}>
                            All Time
                        </Text>
                    </TouchableOpacity>
                </View>

                <Spacer height={20} />

                {/* Progress Cards */}
                <View style={styles.progressSection}>
                    <Text style={styles.sectionTitle}>Learning Progress</Text>
                    {renderProgressCard(
                        'Noorani Qaida',
                        progressData.qaidaProgress.completedLessons,
                        progressData.qaidaProgress.totalLessons,
                        Math.round((progressData.qaidaProgress.completedLessons / progressData.qaidaProgress.totalLessons) * 100),
                        colors.appColor1
                    )}
                    <Spacer height={12} />
                    {renderProgressCard(
                        'Quran Recitation',
                        progressData.quranProgress.completedAyahs,
                        progressData.quranProgress.totalAyahs,
                        Math.round((progressData.quranProgress.completedAyahs / progressData.quranProgress.totalAyahs) * 100),
                        colors.appColor2
                    )}
                </View>

                <Spacer height={20} />

                {/* Stats Grid */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Statistics</Text>
                    <View style={styles.statsGrid}>
                        {renderStatCard(
                            'clock',
                            'Study Time',
                            formatTime(currentStats.studyTime),
                            `${selectedPeriod === 'week' ? 'This week' : 'This month'}`,
                            colors.appColor1
                        )}
                        {renderStatCard(
                            'book-open',
                            'Lessons',
                            currentStats.lessonsCompleted.toString(),
                            'Completed',
                            colors.appColor2
                        )}
                        {renderStatCard(
                            'trending-up',
                            'Average Score',
                            `${currentStats.averageScore}%`,
                            `+${currentStats.improvement}% from last ${selectedPeriod}`,
                            colors.appTextColor2
                        )}
                        {renderStatCard(
                            'zap',
                            'Streak',
                            `${progressData.qaidaProgress.streak} days`,
                            'Current streak',
                            '#FF6B35'
                        )}
                    </View>
                </View>

                <Spacer height={20} />

                {/* Achievements */}
                <View style={styles.achievementsSection}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    {progressData.achievements.map(renderAchievement)}
                </View>

                <Spacer height={20} />

                {/* Error Analysis */}
                {renderErrorChart()}

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
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: colors.appBgColor2,
        borderRadius: 12,
        padding: 4,
        marginTop: 10,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activePeriodButton: {
        backgroundColor: colors.appColor1,
    },
    periodButtonText: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor2,
        fontWeight: '500',
    },
    activePeriodButtonText: {
        color: colors.appBgColor1,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 16,
    },
    progressSection: {
        marginBottom: 20,
    },
    progressCard: {
        backgroundColor: colors.appBgColor2,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: responsiveFontSize(16),
        color: colors.appTextColor1,
        fontWeight: '600',
    },
    progressPercentage: {
        fontSize: responsiveFontSize(18),
        color: colors.appColor1,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.appBgColor1,
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
    },
    statsSection: {
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - responsiveWidth(12)) / 2,
        backgroundColor: colors.appBgColor2,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: responsiveFontSize(16),
        color: colors.appTextColor1,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statTitle: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor1,
        fontWeight: '500',
    },
    statSubtitle: {
        fontSize: responsiveFontSize(10),
        color: colors.appTextColor2,
        marginTop: 2,
    },
    achievementsSection: {
        marginBottom: 20,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.appBgColor2,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    achievementLocked: {
        opacity: 0.6,
    },
    achievementIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 4,
    },
    achievementTitleLocked: {
        color: colors.appTextColor3,
    },
    achievementDescription: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
        marginBottom: 4,
    },
    achievementDescriptionLocked: {
        color: colors.appTextColor3,
    },
    achievementDate: {
        fontSize: responsiveFontSize(10),
        color: colors.appColor1,
        fontWeight: '500',
    },
    errorChartContainer: {
        backgroundColor: colors.appBgColor2,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartTitle: {
        fontSize: responsiveFontSize(16),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 16,
    },
    errorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    errorInfo: {
        width: 80,
    },
    errorType: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor1,
        fontWeight: '500',
    },
    errorCount: {
        fontSize: responsiveFontSize(10),
        color: colors.appTextColor2,
    },
    errorBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.appBgColor1,
        borderRadius: 4,
        marginHorizontal: 12,
        overflow: 'hidden',
    },
    errorBarFill: {
        height: '100%',
        backgroundColor: '#FF4444',
        borderRadius: 4,
    },
    errorPercentage: {
        width: 40,
        textAlign: 'right',
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor1,
        fontWeight: '500',
    },
});

export default Progress;
