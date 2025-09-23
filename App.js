import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation'
import { Provider, useDispatch } from 'react-redux';
import store from './src/store';
import { AuthProvider, useAuth } from './src/services/contexts/AuthContext';
import { setSignedInUser, setIsLoggedIn, resetAuthState } from './src/store/authSlice';

// Component to sync Firebase auth with Redux state
const AuthSync = () => {
  const dispatch = useDispatch();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in - sync to Redux
        dispatch(setSignedInUser(user));
        dispatch(setIsLoggedIn(true));
        console.log('Synced Firebase user to Redux:', user.uid);
      } else {
        // User is not logged in - clear Redux
        dispatch(resetAuthState());
        console.log('Cleared Redux auth state - user not logged in');
      }
    }
  }, [user, loading, dispatch]);

  return null; // This component doesn't render anything
};

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthSync />
        <SafeAreaProvider style={{ flex: 1 }}>
          <Navigation />
        </SafeAreaProvider>
      </AuthProvider>
    </Provider>
  )
}