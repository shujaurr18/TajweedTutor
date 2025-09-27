import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';

const QuranSurah = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { surah } = route.params;

    // Dummy data for Ayahs
    const generateAyahs = (count) => {
        const ayahs = [];
        for (let i = 1; i <= count; i++) {
            ayahs.push({
                id: i,
                number: i,
                text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ${i}`,
                translation: `In the name of Allah, the Entirely Merciful, the Especially Merciful. (${i})`,
                transliteration: `Bismillahi ar-Rahman ar-Raheem (${i})`,
                audioUrl: `https://example.com/audio/${surah.id}/${i}.mp3`,
            });
        }
        return ayahs;
    };

    const ayahs = generateAyahs(Math.min(surah.ayahCount, 20)); // Limit to 20 for demo

    const renderAyahItem = ({ item }) => (
        <TouchableOpacity
            style={styles.ayahItem}
            onPress={() => navigation.navigate('quranAyah', { surah, ayah: item })}
        >
            <View style={styles.ayahNumber}>
                <Text style={styles.ayahNumberText}>{item.number}</Text>
            </View>
            <View style={styles.ayahContent}>
                <Text style={styles.ayahText}>{item.text}</Text>
                <Spacer height={8} />
                <Text style={styles.translation}>{item.translation}</Text>
                <Text style={styles.transliteration}>{item.transliteration}</Text>
            </View>
            <TouchableOpacity style={styles.playButton}>
                <Icon name="play" type="feather" size={20} color={colors.appColor1} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
            
            <Header
                title={surah.name}
                showBackButton={true}
                rightComponent={
                    <TouchableOpacity>
                        <Icon name="bookmark" type="feather" size={24} color={colors.appTextColor1} />
                    </TouchableOpacity>
                }
            />

            <Wrapper style={styles.content}>
                {/* Surah Info */}
                <View style={styles.surahInfo}>
                    <Text style={styles.surahNameArabic}>{surah.nameArabic}</Text>
                    <Text style={styles.surahDetails}>{surah.ayahCount} Ayahs • Juz {surah.juz}</Text>
                </View>

                <Spacer height={20} />

                {/* Ayahs List */}
                <FlatList
                    data={ayahs}
                    renderItem={renderAyahItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
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
    surahInfo: {
        backgroundColor: colors.appBgColor2,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    surahNameArabic: {
        fontSize: responsiveFontSize(28),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    surahDetails: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor2,
    },
    listContainer: {
        paddingBottom: 20,
    },
    ayahItem: {
        flexDirection: 'row',
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
    ayahNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.appColor1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    ayahNumberText: {
        color: colors.appBgColor1,
        fontSize: responsiveFontSize(12),
        fontWeight: 'bold',
    },
    ayahContent: {
        flex: 1,
    },
    ayahText: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        lineHeight: 32,
        textAlign: 'right',
    },
    translation: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor2,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    transliteration: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor3,
        lineHeight: 20,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.appBgColor1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default QuranSurah;
