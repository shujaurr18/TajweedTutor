import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInputs, Buttons, ScrollViews, Wrapper, Spacer, Headers, Icons } from '../../../components';
import { responsiveFontSize, responsiveHeight, routes, colors } from '../../../services';
import { useHooks } from './hooks';

export default function ForgotPassword(props) {
  const { navigate, goBack } = props.navigation;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { handleForgotPassword } = useHooks();

  const onForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await handleForgotPassword(email);
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your inbox and follow the instructions.',
        [
          {
            text: 'OK',
            onPress: () => goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper isMain style={{}}>
      <ScrollViews.KeyboardAvoiding>
        <Headers.Auth />
        <Wrapper>
          <Spacer isDoubleBase />
          
          {/* Back Button */}
          <Wrapper marginHorizontalBase>
            <Icons.Button
              buttonSize={40}
              buttonColor={colors.appBgColor1}
              iconColor={colors.appTextColor1}
              onPress={() => goBack()}
              iconSize={20}
              iconName={'arrow-left'}
              iconType={'feather'}
              buttonStyle={{ 
                borderWidth: 1, 
                borderColor: colors.appColor3,
                shadowColor: colors.appTextColor1,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
            />
          </Wrapper>
          
          <Spacer isMedium />
          
          <Text isTinyTitle alignTextCenter style={{ fontSize: responsiveFontSize(24), color: colors.appTextColor1 }}>
            Forgot Password?
          </Text>
          
          <Spacer height={responsiveHeight(1)} />
          
          <Text isRegular alignTextCenter style={{ 
            fontSize: responsiveFontSize(16), 
            color: colors.appTextColor4,
            lineHeight: responsiveFontSize(22),
            marginHorizontal: 20
          }}>
            Don't worry! Enter your email address and we'll send you a link to reset your password.
          </Text>
          
          <Spacer isDoubleBase />
          
          <TextInputs.Colored
            title={'Email Address'}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Spacer isDoubleBase />
          
          <Buttons.Colored
            text={loading ? "Sending..." : "Send Reset Link"}
            onPress={onForgotPassword}
            disabled={loading}
          />
          
          <Spacer height={responsiveHeight(2)} />
          
          <Text isRegular alignTextCenter style={{ color: colors.appTextColor4 }}>
            Remember your password?{' '}
            <Text 
              isBoldFont 
              style={{ color: colors.appColor2 }}
              onPress={() => goBack()}
            >
              Sign In
            </Text>
          </Text>
          
          <Spacer isBasic />
        </Wrapper>
      </ScrollViews.KeyboardAvoiding>
    </Wrapper>
  );
}
