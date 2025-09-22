import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation'
import { Provider } from 'react-redux';
import store from './src/store';
import { AuthProvider } from './src/services/contexts/AuthContext';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SafeAreaProvider style={{ flex: 1 }}>
          <Navigation />
        </SafeAreaProvider>
      </AuthProvider>
    </Provider>
  )
}