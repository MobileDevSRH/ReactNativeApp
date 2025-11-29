import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import Logo from '../components/Logo';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    navigation.navigate('Home');
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

      <Button style={styles.button} title="Login" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  button:{
    marginTop: 20
  }
});
