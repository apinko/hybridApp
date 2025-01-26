// components/ProductInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const ProductInput = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
});

export default ProductInput;
