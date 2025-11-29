import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Input({ placeholder, secureTextEntry, value, onChangeText }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
  },
});