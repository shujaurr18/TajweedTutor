import React, { useState } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInputs, Buttons, ScrollViews, Wrapper, Spacer, Headers, Icons } from '../../../components';
import { responsiveFontSize, responsiveHeight, routes, colors, responsiveWidth } from '../../../services';
import { useHooks } from './hooks';

export default function SignIn(props) {
  const { navigate } = props.navigation;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, handleEmailLogin, handleGoogleSignIn } = useHooks(props.navigation);

  const onEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await handleEmailLogin(email, password);
      // Navigation will be handled by the auth state listener
    } catch (error) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    }
  };

  const onGoogleSignIn = async () => {
    try {
      await handleGoogleSignIn();
      // Navigation will be handled by the auth state listener
    } catch (error) {
      Alert.alert('Error', error.message || 'Google Sign-In failed. Please try again.');
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
            Welcome Back
          </Text>
          
          <Spacer height={responsiveHeight(1)} />
          
          <Text isRegular alignTextCenter style={{ 
            fontSize: responsiveFontSize(16), 
            color: colors.appTextColor4,
            marginHorizontal: 20
          }}>
            Sign in to continue your Tajweed journey
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
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            iconNameRight={showPassword ? "eye-off" : "eye"}
            iconTypeRight={'feather'}
            onPressIconRight={() => setShowPassword(!showPassword)}
          />
          
          <Spacer isMedium />
          
          <Wrapper marginHorizontalBase>
            <Text 
              isRegular 
              isBoldFont 
              alignTextRight
              style={{ color: colors.appColor2 }}
              onPress={() => navigate(routes.forgotPassword)}
            >
              Forgot Password?
            </Text>
          </Wrapper>
          
          <Spacer isMedium />
          
          <Buttons.Colored
            text={loading ? "Signing In..." : "Sign In"}
            onPress={onEmailLogin}
            disabled={loading}
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
              backgroundColor: loading ? colors.appBgColor3 : colors.appBgColor1,
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
              elevation: 3,
              opacity: loading ? 0.6 : 1
            }}
            onPress={onGoogleSignIn}
            disabled={loading}
            activeOpacity={0.7}
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
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>
          
          <Spacer height={responsiveHeight(3)} />
          
          <Text isRegular alignTextCenter style={{ color: colors.appTextColor4 }}>
            Don't have an account yet?{' '}
            <Text 
              isBoldFont 
              style={{ color: colors.appColor2 }}
              onPress={() => navigate(routes.createAccount)}
            >
              Create Account
            </Text>
          </Text>
          
          <Spacer isBasic />
        </Wrapper>
      </ScrollViews.KeyboardAvoiding>
    </Wrapper>
  );
}

