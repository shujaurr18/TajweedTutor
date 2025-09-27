import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';

const Quran = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('surah'); // 'surah' or 'juz'

    // Dummy data for Surahs
    const surahs = [
        { id: 1, name: 'Al-Fatiha', nameArabic: 'الفاتحة', ayahCount: 7, juz: 1 },
        { id: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', ayahCount: 286, juz: 1 },
        { id: 3, name: 'Ali Imran', nameArabic: 'آل عمران', ayahCount: 200, juz: 2 },
        { id: 4, name: 'An-Nisa', nameArabic: 'النساء', ayahCount: 176, juz: 2 },
        { id: 5, name: 'Al-Maidah', nameArabic: 'المائدة', ayahCount: 120, juz: 3 },
        { id: 6, name: 'Al-Anam', nameArabic: 'الأنعام', ayahCount: 165, juz: 3 },
        { id: 7, name: 'Al-Araf', nameArabic: 'الأعراف', ayahCount: 206, juz: 4 },
        { id: 8, name: 'Al-Anfal', nameArabic: 'الأنفال', ayahCount: 75, juz: 4 },
        { id: 9, name: 'At-Tawbah', nameArabic: 'التوبة', ayahCount: 129, juz: 4 },
        { id: 10, name: 'Yunus', nameArabic: 'يونس', ayahCount: 109, juz: 5 },
    ];

    // Dummy data for Juz
    const juzs = [
        { id: 1, name: 'Alif Lam Meem', nameArabic: 'آلم', surahs: ['Al-Baqarah (1-141)'] },
        { id: 2, name: 'Sayaqool', nameArabic: 'سيقول', surahs: ['Al-Baqarah (142-252)', 'Ali Imran (1-92)'] },
        { id: 3, name: 'Tilka Ar-Rusul', nameArabic: 'تلك الرسل', surahs: ['Ali Imran (93-200)', 'An-Nisa (1-23)'] },
        { id: 4, name: 'Lan Tana Loo', nameArabic: 'لن تنالوا', surahs: ['An-Nisa (24-147)', 'Al-Maidah (1-81)'] },
        { id: 5, name: 'Wal Mohsanat', nameArabic: 'والمحصنات', surahs: ['Al-Maidah (82-120)', 'Al-Anam (1-110)'] },
    ];

    const renderSurahItem = ({ item }) => (
        <TouchableOpacity
            style={styles.surahItem}
            onPress={() => navigation.navigate('quranSurah', { surah: item })}
        >
            <View style={styles.surahInfo}>
                <View style={styles.surahNumber}>
                    <Text style={styles.surahNumberText}>{item.id}</Text>
                </View>
                <View style={styles.surahDetails}>
                    <Text style={styles.surahName}>{item.name}</Text>
                    <Text style={styles.surahNameArabic}>{item.nameArabic}</Text>
                    <Text style={styles.ayahCount}>{item.ayahCount} Ayahs • Juz {item.juz}</Text>
                </View>
            </View>
            <Icon name="chevron-right" type="feather" size={20} color={colors.appTextColor2} />
        </TouchableOpacity>
    );

    const renderJuzItem = ({ item }) => (
        <TouchableOpacity
            style={styles.juzItem}
            onPress={() => {
                // Navigate to first surah of the juz
                const firstSurah = surahs.find(s => s.juz === item.id);
                if (firstSurah) {
                    navigation.navigate('quranSurah', { surah: firstSurah });
                }
            }}
        >
            <View style={styles.juzInfo}>
                <View style={styles.juzNumber}>
                    <Text style={styles.juzNumberText}>{item.id}</Text>
                </View>
                <View style={styles.juzDetails}>
                    <Text style={styles.juzName}>{item.name}</Text>
                    <Text style={styles.juzNameArabic}>{item.nameArabic}</Text>
                    <Text style={styles.juzSurahs}>{item.surahs.join(', ')}</Text>
                </View>
            </View>
            <Icon name="chevron-right" type="feather" size={20} color={colors.appTextColor2} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
            
            <Header
                title="Quran"
                showBackButton={false}
                rightComponent={
                    <TouchableOpacity>
                        <Icon name="search" type="feather" size={24} color={colors.appTextColor1} />
                    </TouchableOpacity>
                }
            />

            <Wrapper style={styles.content}>
                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'surah' && styles.activeTab]}
                        onPress={() => setSelectedTab('surah')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'surah' && styles.activeTabText]}>
                            Surahs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'juz' && styles.activeTab]}
                        onPress={() => setSelectedTab('juz')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'juz' && styles.activeTabText]}>
                            Juz
                        </Text>
                    </TouchableOpacity>
                </View>

                <Spacer height={20} />

                {/* Content */}
                {selectedTab === 'surah' ? (
                    <FlatList
                        data={surahs}
                        renderItem={renderSurahItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <FlatList
                        data={juzs}
                        renderItem={renderJuzItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.appBgColor2,
        borderRadius: 12,
        padding: 4,
        marginTop: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: colors.appColor1,
    },
    tabText: {
        fontSize: responsiveFontSize(16),
        color: colors.appTextColor2,
        fontWeight: '500',
    },
    activeTabText: {
        color: colors.appBgColor1,
        fontWeight: '600',
    },
    listContainer: {
        paddingBottom: 20,
    },
    surahItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    surahInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    surahNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.appColor1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    surahNumberText: {
        color: colors.appBgColor1,
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
    },
    surahDetails: {
        flex: 1,
    },
    surahName: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 2,
    },
    surahNameArabic: {
        fontSize: responsiveFontSize(20),
        color: colors.appTextColor1,
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'right',
    },
    ayahCount: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
    },
    juzItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    juzInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    juzNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.appColor2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    juzNumberText: {
        color: colors.appBgColor1,
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
    },
    juzDetails: {
        flex: 1,
    },
    juzName: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 2,
    },
    juzNameArabic: {
        fontSize: responsiveFontSize(20),
        color: colors.appTextColor1,
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'right',
    },
    juzSurahs: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
    },
});

export default Quran;
