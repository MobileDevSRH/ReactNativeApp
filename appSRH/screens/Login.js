import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import Logo from '../components/Logo';

import { authenticateUser } from '../Database';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Login Error', 'Please enter both username and password.');
      return;
    }

    try {
      const isAuthenticated = await authenticateUser(username, password);

      if (isAuthenticated) {
        setUsername('');
        setPassword('');
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Database authentication error:', error);
      Alert.alert('System Error', 'Could not connect to the database.');
    }
  }

  return (
    <View style={styles.container}>
      <Logo />

      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button 
        style={styles.button}
        title="Login"
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});
