import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import Home from './screens/Home';

import { initDatabase } from './Database';
import CameraUpload from './screens/CameraUpload';

import DrawerNavigator from './navigation/DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbInitialized(true))
      .catch(err => {
        console.error('Database initialization failed:', err);
        Alert.alert('System Error', 'Could not initialize the database.');
      });
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading application...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
