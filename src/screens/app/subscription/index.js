import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../services';
import { Wrapper, Text as CustomText, Header, Spacer } from '../../../components';
import { Icon } from '@rneui/base';

const Subscription = () => {
    const navigation = useNavigation();
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: '$9.99',
            period: 'per month',
            originalPrice: null,
            features: [
                'Unlimited Qaida lessons',
                'Full Quran access',
                'Real-time Tajweed feedback',
                'Progress tracking',
                'Multiple reciters',
                'Offline downloads',
            ],
            popular: false,
        },
        {
            id: 'yearly',
            name: 'Yearly',
            price: '$79.99',
            period: 'per year',
            originalPrice: '$119.88',
            features: [
                'Everything in Monthly',
                'Save 33%',
                'Priority support',
                'Advanced analytics',
                'Custom reciter uploads',
                'Family sharing (up to 6 users)',
            ],
            popular: true,
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: '$199.99',
            period: 'one-time payment',
            originalPrice: '$599.97',
            features: [
                'Everything in Yearly',
                'One-time payment',
                'Lifetime updates',
                'Premium support',
                'Early access to new features',
                'No recurring charges',
            ],
            popular: false,
        },
    ];

    const freeFeatures = [
        'Basic Qaida lessons (first 5)',
        'Limited Quran access (3 Surahs)',
        'Basic feedback',
        'Progress tracking',
    ];

    const premiumFeatures = [
        'Unlimited Qaida lessons',
        'Full Quran access (all 114 Surahs)',
        'Advanced Tajweed feedback',
        'Multiple reciters',
        'Offline downloads',
        'Detailed progress analytics',
        'Custom settings',
        'Priority support',
    ];

    const handleSubscribe = (planId) => {
        Alert.alert(
            'Subscribe',
            `Are you sure you want to subscribe to the ${plans.find(p => p.id === planId)?.name} plan?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Subscribe', onPress: () => {
                    // Handle subscription logic here
                    console.log(`Subscribing to ${planId} plan`);
                    Alert.alert('Success', 'Subscription activated successfully!');
                }},
            ]
        );
    };

    const handleRestorePurchases = () => {
        Alert.alert('Restore Purchases', 'Checking for previous purchases...');
    };

    const renderPlanCard = (plan) => (
        <TouchableOpacity
            key={plan.id}
            style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
                plan.popular && styles.popularPlanCard,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
        >
            {plan.popular && (
                <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
            )}
            
            <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{plan.price}</Text>
                    <Text style={styles.period}>{plan.period}</Text>
                </View>
                {plan.originalPrice && (
                    <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
                )}
            </View>

            <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <Icon name="check" type="feather" size={16} color={colors.appColor1} />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={[
                    styles.subscribeButton,
                    selectedPlan === plan.id && styles.selectedSubscribeButton,
                ]}
                onPress={() => handleSubscribe(plan.id)}
            >
                <Text style={[
                    styles.subscribeButtonText,
                    selectedPlan === plan.id && styles.selectedSubscribeButtonText,
                ]}>
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderFeatureComparison = () => (
        <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonTitle}>Free vs Premium</Text>
            
            <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonLabel}>Features</Text>
                <Text style={styles.comparisonLabel}>Free</Text>
                <Text style={styles.comparisonLabel}>Premium</Text>
            </View>

            {premiumFeatures.map((feature, index) => (
                <View key={index} style={styles.comparisonRow}>
                    <Text style={styles.comparisonFeature}>{feature}</Text>
                    <View style={styles.comparisonCell}>
                        {freeFeatures.includes(feature) ? (
                            <Icon name="check" type="feather" size={16} color={colors.appColor1} />
                        ) : (
                            <Icon name="x" type="feather" size={16} color={colors.appTextColor3} />
                        )}
                    </View>
                    <View style={styles.comparisonCell}>
                        <Icon name="check" type="feather" size={16} color={colors.appColor1} />
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.appBgColor1} />
            
            <Header
                title="Subscription"
                showBackButton={true}
                rightComponent={
                    <TouchableOpacity onPress={handleRestorePurchases}>
                        <Text style={styles.restoreText}>Restore</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Unlock Your Full Potential</Text>
                    <Text style={styles.headerSubtitle}>
                        Get unlimited access to all Qaida lessons, complete Quran recitation, 
                        and advanced Tajweed feedback to perfect your recitation.
                    </Text>
                </View>

                <Spacer height={30} />

                {/* Plans */}
                <View style={styles.plansContainer}>
                    {plans.map(renderPlanCard)}
                </View>

                <Spacer height={30} />

                {/* Feature Comparison */}
                {renderFeatureComparison()}

                <Spacer height={30} />

                {/* Benefits */}
                <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitsTitle}>Why Choose Premium?</Text>
                    
                    <View style={styles.benefitItem}>
                        <View style={styles.benefitIcon}>
                            <Icon name="zap" type="feather" size={24} color={colors.appColor1} />
                        </View>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitTitle}>Real-time Feedback</Text>
                            <Text style={styles.benefitDescription}>
                                Get instant Tajweed feedback as you recite, helping you improve faster.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitItem}>
                        <View style={styles.benefitIcon}>
                            <Icon name="trending-up" type="feather" size={24} color={colors.appColor1} />
                        </View>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitTitle}>Track Your Progress</Text>
                            <Text style={styles.benefitDescription}>
                                Detailed analytics and progress tracking to monitor your improvement.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitItem}>
                        <View style={styles.benefitIcon}>
                            <Icon name="download" type="feather" size={24} color={colors.appColor1} />
                        </View>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitTitle}>Offline Access</Text>
                            <Text style={styles.benefitDescription}>
                                Download lessons and Quran for offline learning anywhere, anytime.
                            </Text>
                        </View>
                    </View>
                </View>

                <Spacer height={30} />

                {/* Terms */}
                <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                        By subscribing, you agree to our Terms of Service and Privacy Policy. 
                        Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
                    </Text>
                </View>

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
    restoreText: {
        fontSize: responsiveFontSize(14),
        color: colors.appColor1,
        fontWeight: '500',
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        fontSize: responsiveFontSize(22),
        color: colors.appTextColor1,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    headerSubtitle: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor2,
        textAlign: 'center',
        lineHeight: 24,
    },
    plansContainer: {
        gap: 16,
    },
    planCard: {
        backgroundColor: colors.appBgColor2,
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    selectedPlanCard: {
        borderColor: colors.appColor1,
    },
    popularPlanCard: {
        borderColor: colors.appColor2,
    },
    popularBadge: {
        position: 'absolute',
        top: -8,
        left: 20,
        right: 20,
        backgroundColor: colors.appColor2,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    popularBadgeText: {
        color: colors.appBgColor1,
        fontSize: responsiveFontSize(12),
        fontWeight: '600',
    },
    planHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    planName: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    price: {
        fontSize: responsiveFontSize(26),
        color: colors.appColor1,
        fontWeight: 'bold',
    },
    period: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor2,
        marginLeft: 4,
    },
    originalPrice: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor3,
        textDecorationLine: 'line-through',
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        marginLeft: 12,
        flex: 1,
    },
    subscribeButton: {
        backgroundColor: colors.appBgColor1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.appColor1,
    },
    selectedSubscribeButton: {
        backgroundColor: colors.appColor1,
    },
    subscribeButtonText: {
        fontSize: responsiveFontSize(14),
        color: colors.appColor1,
        fontWeight: '600',
    },
    selectedSubscribeButtonText: {
        color: colors.appBgColor1,
    },
    comparisonContainer: {
        backgroundColor: colors.appBgColor2,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    comparisonTitle: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    comparisonHeader: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.appBgColor1,
    },
    comparisonLabel: {
        flex: 1,
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        fontWeight: '600',
        textAlign: 'center',
    },
    comparisonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.appBgColor1,
    },
    comparisonFeature: {
        flex: 2,
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor1,
    },
    comparisonCell: {
        flex: 1,
        alignItems: 'center',
    },
    benefitsContainer: {
        backgroundColor: colors.appBgColor2,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    benefitsTitle: {
        fontSize: responsiveFontSize(18),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    benefitIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.appBgColor1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    benefitContent: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: responsiveFontSize(14),
        color: colors.appTextColor1,
        fontWeight: '600',
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
        lineHeight: 22,
    },
    termsContainer: {
        backgroundColor: colors.appBgColor2,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    termsText: {
        fontSize: responsiveFontSize(12),
        color: colors.appTextColor2,
        lineHeight: 22,
        textAlign: 'center',
    },
});

export default Subscription;
