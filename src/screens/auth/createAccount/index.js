import React, { useState } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Icons, Text, TextInputs, Buttons, ScrollViews, Wrapper, Spacer, Headers } from '../../../components';
import { colors, responsiveFontSize, responsiveHeight, routes, responsiveWidth } from '../../../services';
import { useHooks } from './hooks';

export default function CreateAccount(props) {
  const { navigate } = props.navigation;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleEmailSignUp, handleGoogleSignIn } = useHooks(props.navigation);

  const onEmailSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!accepted) {
      Alert.alert('Error', 'Please accept the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      await handleEmailSignUp(email, password);
      // Navigation will be handled by the auth state listener
    } catch (error) {
      console.log('error===>', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      await handleGoogleSignIn();
      // Navigation will be handled by the auth state listener
    } catch (error) {
      Alert.alert('Error', error.message || 'Google Sign-In failed. Please try again.');
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
          
          <Text isTinyTitle alignTextCenter style={{ 
            fontSize: responsiveFontSize(24), 
            color: colors.appTextColor1 
          }}>
            Create Account
          </Text>
          
          <Spacer height={responsiveHeight(1)} />
          
          <Text isRegular alignTextCenter style={{ 
            fontSize: responsiveFontSize(16), 
            color: colors.appTextColor4,
            marginHorizontal: 20
          }}>
            Join us to start your Tajweed learning journey
          </Text>
          
          <Spacer isDoubleBase />
          
          <TextInputs.Colored
            title={'Email'}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Spacer isMedium />
          
          <TextInputs.Colored
            title={'Password'}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password (min 6 characters)"
            secureTextEntry={!showPassword}
            iconNameRight={showPassword ? "eye-off" : "eye"}
            iconTypeRight={'feather'}
            onPressIconRight={() => setShowPassword(!showPassword)}
          />
          
          <Spacer isMedium />
          
          <TextInputs.Colored
            title={'Confirm Password'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={!showConfirmPassword}
            iconNameRight={showConfirmPassword ? "eye-off" : "eye"}
            iconTypeRight={'feather'}
            onPressIconRight={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          
          <Spacer isMedium />
          
          <Wrapper marginHorizontalBase flexDirectionRow alignItemsCenter>
            <Icons.Button
              buttonSize={responsiveWidth(7)}
              buttonColor={accepted ? colors.appColor2 : colors.appBgColor1}
              iconColor={colors.appTextColor6}
              onPress={() => setAccepted(pre => !pre)}
              iconSize={responsiveWidth(4)}
              iconName={'check'}
              buttonStyle={{ 
                borderWidth: 1, 
                borderColor: accepted ? colors.appBgColor1 : colors.appColor1,
                shadowColor: colors.appTextColor1,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
            />
            <Spacer isSmall horizontal />
            <Wrapper flex={1}>
              <Text isRegular style={{ 
                lineHeight: responsiveFontSize(25),
                color: colors.appTextColor3
              }}>
                I accept the
                {' '}
                <Text
                  onPress={() => navigate(routes.common, {screen: routes.termsOfService})}
                  isBoldFont
                  style={{ color: colors.appColor2 }}
                >
                  Terms of Service
                </Text>
                {' '}
                and
                {'\n'}
                <Text
                  onPress={() => navigate(routes.common, {screen: routes.privacyPolicy})}
                  isBoldFont
                  style={{ color: colors.appColor2 }}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </Wrapper>
          </Wrapper>
          
          <Spacer height={responsiveHeight(2)} />
          
          <Buttons.Colored
            text={loading ? "Creating Account..." : "Create Account"}
            onPress={onEmailSignUp}
            disabled={loading || !accepted}
          />
          
          <Spacer height={responsiveHeight(2)} />
          
          {/* Divider */}
          <Wrapper flexDirectionRow alignItemsCenter marginHorizontalBase>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.appBgColor3 }} />
            <Text style={{ 
              marginHorizontal: 15, 
              color: colors.appTextColor4,
              fontSize: responsiveFontSize(14)
            }}>
              OR
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.appBgColor3 }} />
          </Wrapper>
          
          <Spacer height={responsiveHeight(2)} />
          
          {/* Google Sign In Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.appBgColor1,
              borderWidth: 1,
              borderColor: colors.appBgColor3,
              borderRadius: 8,
              paddingVertical: 15,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.appTextColor1,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={onGoogleSignIn}
            disabled={loading}
          >
            <Icons.Button
              buttonSize={20}
              buttonColor={colors.appBgColor1}
              iconColor={colors.appTextColor1}
              iconSize={20}
              iconName={'google'}
              iconType={'antdesign'}
              buttonStyle={{ marginRight: 10 }}
            />
            <Text style={{ 
              color: colors.appTextColor1, 
              fontSize: responsiveFontSize(16),
              fontWeight: '600'
            }}>
              Continue with Google
            </Text>
          </TouchableOpacity>
          
          <Spacer height={responsiveHeight(3)} />
          
          <Text isRegular alignTextCenter style={{ color: colors.appTextColor4 }}>
            Already have an account?{' '}
            <Text 
              isBoldFont 
              style={{ color: colors.appColor2 }}
              onPress={() => navigate(routes.signin)}
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

