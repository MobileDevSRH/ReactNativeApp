import { View, Button, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import Input from '../components/Input';

export default function TTS() {
  const [text, setText] = useState('');

  const speak = () => {
    Speech.speak(text);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter Text"
        value={text}
        onChangeText={setText}
      />

      <View style={styles.buttonContainer}>
        <Button title="Press to Hear Text" onPress={speak} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },

  buttonContainer: {
    marginTop: 20, 
    width: '50%', 
  }
});