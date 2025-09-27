import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Switch,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';

const Settings = () => {
    const navigation = useNavigation();
    
    const [settings, setSettings] = useState({
        notifications: true,
        soundEffects: true,
        hapticFeedback: true,
        autoPlay: false,
        showTranslation: true,
        showTransliteration: true,
        fontSize: 'medium', // 'small', 'medium', 'large'
        theme: 'light', // 'light', 'dark'
        feedbackSensitivity: 'medium', // 'low', 'medium', 'high'
        selectedReciter: 'Abdul Rahman Al-Sudais',
        language: 'English',
    });

    const reciters = [
        'Abdul Rahman Al-Sudais',
        'Mishary Rashid Alafasy',
        'Saad Al-Ghamdi',
        'Abdullah Basfar',
        'Muhammad Al-Luhaidan',
    ];

    const languages = [
        'English',
        'Arabic',
        'Urdu',
        'French',
        'Spanish',
    ];

    const fontSizeOptions = [
        { value: 'small', label: 'Small', size: 16 },
        { value: 'medium', label: 'Medium', size: 18 },
        { value: 'large', label: 'Large', size: 20 },
    ];

    const feedbackSensitivityOptions = [
        { value: 'low', label: 'Low', description: 'Only major errors' },
        { value: 'medium', label: 'Medium', description: 'Moderate feedback' },
        { value: 'high', label: 'High', description: 'Detailed feedback' },
    ];

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleReciterSelection = () => {
        Alert.alert(
            'Select Reciter',
            'Choose your preferred reciter for reference audio',
            reciters.map(reciter => ({
                text: reciter,
                onPress: () => updateSetting('selectedReciter', reciter),
            }))
        );
    };

    const handleLanguageSelection = () => {
        Alert.alert(
            'Select Language',
            'Choose your preferred language for the interface',
            languages.map(language => ({
                text: language,
                onPress: () => updateSetting('language', language),
            }))
        );
    };

    const handleFontSizeSelection = () => {
        Alert.alert(
            'Font Size',
            'Choose your preferred font size',
            fontSizeOptions.map(option => ({
                text: option.label,
                onPress: () => updateSetting('fontSize', option.value),
            }))
        );
    };

    const handleFeedbackSensitivitySelection = () => {
        Alert.alert(
            'Feedback Sensitivity',
            'Choose how detailed you want the Tajweed feedback to be',
            feedbackSensitivityOptions.map(option => ({
                text: option.label,
                onPress: () => updateSetting('feedbackSensitivity', option.value),
            }))
        );
    };

    const handleSubscription = () => {
        navigation.navigate('subscription');
    };

    const handlePrivacyPolicy = () => {
        navigation.navigate('privacyPolicy');
    };

    const handleTermsOfService = () => {
        navigation.navigate('termsOfService');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => {
                    // Handle logout logic here
                    console.log('User logged out');
                }},
            ]
        );
    };

    const renderSettingItem = (icon, title, subtitle, onPress, rightComponent = null) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                    <Icon name={icon} type="feather" size={24} color={colors.appColor1} />
                </View>
                <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightComponent || <Icon name="chevron-right" type="feather" size={20} color={colors.appTextColor2} />}
        </TouchableOpacity>
    );

    const renderSwitchSetting = (icon, title, subtitle, value, onValueChange) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                    <Icon name={icon} type="feather" size={24} color={colors.appColor1} />
                </View>
                <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: colors.appBgColor1, true: colors.appColor1 }}
                thumbColor={colors.appBgColor1}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
            
            <Header
                title="Settings"
                showBackButton={true}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Audio & Recitation Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Audio & Recitation</Text>
                    
                    {renderSettingItem(
                        'user',
                        'Reciter',
                        settings.selectedReciter,
                        handleReciterSelection
                    )}
                    
                    {renderSwitchSetting(
                        'volume-2',
                        'Sound Effects',
                        'Play audio feedback and notifications',
                        settings.soundEffects,
                        (value) => updateSetting('soundEffects', value)
                    )}
                    
                    {renderSwitchSetting(
                        'play',
                        'Auto Play',
                        'Automatically play reference audio',
                        settings.autoPlay,
                        (value) => updateSetting('autoPlay', value)
                    )}
                </View>

                <Spacer height={20} />

                {/* Display Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Display</Text>
                    
                    {renderSettingItem(
                        'type',
                        'Font Size',
                        fontSizeOptions.find(opt => opt.value === settings.fontSize)?.label,
                        handleFontSizeSelection
                    )}
                    
                    {renderSwitchSetting(
                        'globe',
                        'Show Translation',
                        'Display English translation',
                        settings.showTranslation,
                        (value) => updateSetting('showTranslation', value)
                    )}
                    
                    {renderSwitchSetting(
                        'hash',
                        'Show Transliteration',
                        'Display phonetic transliteration',
                        settings.showTransliteration,
                        (value) => updateSetting('showTransliteration', value)
                    )}
                </View>

                <Spacer height={20} />

                {/* Feedback Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feedback</Text>
                    
                    {renderSettingItem(
                        'target',
                        'Feedback Sensitivity',
                        feedbackSensitivityOptions.find(opt => opt.value === settings.feedbackSensitivity)?.label,
                        handleFeedbackSensitivitySelection
                    )}
                    
                    {renderSwitchSetting(
                        'bell',
                        'Notifications',
                        'Receive study reminders and achievements',
                        settings.notifications,
                        (value) => updateSetting('notifications', value)
                    )}
                    
                    {renderSwitchSetting(
                        'smartphone',
                        'Haptic Feedback',
                        'Vibration feedback during recitation',
                        settings.hapticFeedback,
                        (value) => updateSetting('hapticFeedback', value)
                    )}
                </View>

                <Spacer height={20} />

                {/* Language Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Language</Text>
                    
                    {renderSettingItem(
                        'globe',
                        'Interface Language',
                        settings.language,
                        handleLanguageSelection
                    )}
                </View>

                <Spacer height={20} />

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    
                    {renderSettingItem(
                        'crown',
                        'Subscription',
                        'Manage your premium subscription',
                        handleSubscription
                    )}
                    
                    {renderSettingItem(
                        'download',
                        'Download Content',
                        'Download lessons for offline use',
                        () => Alert.alert('Download', 'Feature coming soon!')
                    )}
                    
                    {renderSettingItem(
                        'trash-2',
                        'Clear Cache',
                        'Free up storage space',
                        () => Alert.alert('Clear Cache', 'Cache cleared successfully!')
                    )}
                </View>

                <Spacer height={20} />

                {/* Legal & Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal & Support</Text>
                    
                    {renderSettingItem(
                        'shield',
                        'Privacy Policy',
                        'Read our privacy policy',
                        handlePrivacyPolicy
                    )}
                    
                    {renderSettingItem(
                        'file-text',
                        'Terms of Service',
                        'Read our terms of service',
                        handleTermsOfService
                    )}
                    
                    {renderSettingItem(
                        'help-circle',
                        'Help & Support',
                        'Get help and contact support',
                        () => Alert.alert('Support', 'Contact us at support@tajweedtutor.com')
                    )}
                    
                    {renderSettingItem(
                        'star',
                        'Rate App',
                        'Rate us on the App Store',
                        () => Alert.alert('Rate App', 'Thank you for your support!')
                    )}
                </View>

                <Spacer height={20} />

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="log-out" type="feather" size={24} color="#FF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

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
        backgroundColor: colors.appBgColor2,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: responsiveFontSize(16),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.appBgColor1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.appBgColor1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        fontWeight: '500',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appBgColor2,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutText: {
        fontSize: responsiveFontSize(14),
        color: '#FF4444',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default Settings;
