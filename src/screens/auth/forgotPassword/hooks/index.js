import { useState } from 'react';
import auth from '@react-native-firebase/auth';

export const useHooks = () => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (email) => {
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
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

  return {
    loading,
    handleForgotPassword
  };
};
