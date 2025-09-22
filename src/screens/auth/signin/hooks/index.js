import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function useHooks(navigation) {
  const [loading, setLoading] = useState(false);

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
    // Agar already loading hai toh kuch nahi karna
    if (loading) {
      console.log('🚫 Already loading, wait karo!');
      return;
    }

    console.log('🚀 Google Sign-In start...');
    setLoading(true);
    
    try {
      // Simple Google Sign-In
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      
      // Firebase mein sign in
      const { idToken } = result;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      
      console.log('🎉 Success! User signed in');
      
    } catch (error) {
      console.log('❌ Error:', error.code, error.message);
      
      // Sirf important errors handle karo
      if (error.code === '12501') {
        throw new Error('Sign-in cancelled');
      } else if (error.code === '7') {
        throw new Error('Network issue. Check internet!');
      } else {
        // Agar user actually signed in hai toh error ignore karo
        const currentUser = auth().currentUser;
        if (currentUser) {
          console.log('✅ User signed in despite error!');
          return; // Don't throw error
        }
        throw new Error('Google Sign-In failed. Try again!');
      }
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading,
    handleEmailLogin,
    handleGoogleSignIn
  };
}