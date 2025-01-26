// components/MyButton.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const MyButton = ({ label, onPress, style }) => (
  <Pressable style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyButton;