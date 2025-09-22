import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing Firebase import...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Add a small delay for iOS to ensure native modules are ready
        if (Platform.OS === 'ios') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Try to import Firebase
        const firebase = require('@react-native-firebase/app');
        const app = firebase.default.app();
        setStatus(`Firebase imported successfully! App name: ${app.name}`);
      } catch (error) {
        setStatus(`Firebase import failed: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test ({Platform.OS})</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
});

export default FirebaseTest;
