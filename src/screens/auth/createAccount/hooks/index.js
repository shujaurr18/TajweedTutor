import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function useHooks(navigation) {
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Configure Google Sign-In once when the hook initializes
  useEffect(() => {
    const configureGoogleSignIn = () => {
      try {
        GoogleSignin.configure({
          webClientId: '770680880550-diaqlmfe098c4j47upf8vhr3294fh38r.apps.googleusercontent.com',
          offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
          hostedDomain: '', // specifies a hosted domain restriction
          forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
          accountName: '', // [Android] specifies an account name on the device that should be used
        });
        console.log('✅ Google Sign-In configured globally');
      } catch (error) {
        console.error('❌ Error configuring Google Sign-In:', error);
      }
    };

    configureGoogleSignIn();
  }, []);

  const handleEmailLogin = async (email, password) => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Navigation will be handled automatically by AuthContext
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Prevent multiple simultaneous calls
    if (isProcessing) {
      console.log('🚫 Google Sign-In already in progress...');
      return;
    }

    console.log('🚀 Starting Google Sign-In process...');
    setLoading(true);
    setIsProcessing(true);
    
    try {
      // Check if GoogleSignin is available
      console.log('📱 Checking GoogleSignin availability...');
      if (!GoogleSignin) {
        throw new Error('Google Sign-In is not available. Please try email/password login.');
      }
      console.log('✅ GoogleSignin is available');

      // Check if device supports Google Play Services
      console.log('🔍 Checking Google Play Services...');
      const hasPlayServices = await GoogleSignin.hasPlayServices({ 
        showPlayServicesUpdateDialog: true 
      });
      console.log('✅ Google Play Services status:', hasPlayServices);

      // Check if user is already signed in
      console.log('👤 Checking current user status...');
      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log('📋 Is already signed in:', isSignedIn);
      
      // If already signed in, try to get current user first
      if (isSignedIn) {
        console.log('🔄 User already signed in, getting current user...');
        try {
          const currentUser = await GoogleSignin.getCurrentUser();
          if (currentUser && currentUser.idToken) {
            console.log('✅ Using existing user session');
            const googleCredential = auth.GoogleAuthProvider.credential(currentUser.idToken);
            const firebaseResult = await auth().signInWithCredential(googleCredential);
            console.log('✅ Firebase sign-in successful for user:', firebaseResult.user.email);
            console.log('🎉 Google Sign-In completed successfully!');
            return firebaseResult.user;
          }
        } catch (getCurrentUserError) {
          console.log('⚠️ Could not get current user, proceeding with fresh sign-in');
          // Sign out and continue with fresh sign-in
          await GoogleSignin.signOut();
        }
      }
      
      // Get the user's ID token
      console.log('🔐 Starting Google Sign-In flow...');
      const userInfo = await GoogleSignin.signIn();
      console.log('📋 Sign-In result keys:', Object.keys(userInfo));
      
      // Extract idToken
      const { idToken } = userInfo;
      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }
      console.log('🎫 ID Token received:', idToken ? 'Yes' : 'No');

      // Create a Google credential with the token
      console.log('🔑 Creating Google credential...');
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('✅ Google credential created');

      // Sign-in the user with the credential
      console.log('🔥 Signing in with Firebase...');
      const firebaseResult = await auth().signInWithCredential(googleCredential);
      console.log('✅ Firebase sign-in successful for user:', firebaseResult.user.email);
      
      console.log('🎉 Google Sign-In completed successfully!');
      return firebaseResult.user;
      
    } catch (error) {
      console.error('❌ Google Sign-In Error Details:');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Error Name:', error.name);
      
      let errorMessage = 'Google Sign-In failed. Please try again.';
      
      // Handle specific error codes
      switch (error.code) {
        case '7':
        case 'NETWORK_ERROR':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        case '12500':
        case 'DEVELOPER_ERROR':
          errorMessage = 'Configuration error. Please contact support.';
          break;
        case '10':
        case 'DEVELOPER_ERROR':
          errorMessage = 'Google Sign-In is not properly configured. Please contact support.';
          break;
        case '12501':
          errorMessage = 'Sign-in was cancelled.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email address using a different sign-in method.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials. Please try again.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google Sign-In is not enabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        default:
          if (error.message && error.message.includes('not available')) {
            errorMessage = error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
      }
      
      console.error('🚨 Final Error Message:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      console.log('🏁 Google Sign-In process finished');
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return { 
    loading,
    isProcessing,
    handleEmailLogin,
    handleGoogleSignIn
  };
}