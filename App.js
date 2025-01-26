import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SectionList,
  SafeAreaView,
  TextInput,
  StyleSheet
} from 'react-native';

const ShopListApp = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStore, setNewProductStore] = useState('');
  const [filter, setFilter] = useState('');
  const [sorted, setSorted] = useState(false);

  const addProduct = () => {
    if (newProductName.trim() !== '' && newProductPrice.trim() !== '' && newProductStore.trim() !== '') {
      const newProduct = {
        name: newProductName.trim(),
        price: parseFloat(newProductPrice),
        store: newProductStore.trim(),
        purchased: false
      };
      setProducts([newProduct, ...products]);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductStore('');
    }
  };

  const filterProducts = () => {
    return products.filter(product =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const sortProducts = () => {
    const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
    setProducts(sortedProducts);
    setSorted(true);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>{item.name} - {item.price.toFixed(2)} zł ({item.store})</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Aplikacja: </Text>
          <Text style={styles.innerText}>LISTA ZAKUPÓW</Text>
        </View>

        <StatusBar style="auto" />

        {/* Pola wejściowe */}
        <ProductInput
          placeholder="Nazwa produktu"
          value={newProductName}
          onChangeText={setNewProductName}
        />
        <ProductInput
          placeholder="Cena"
          value={newProductPrice}
          onChangeText={setNewProductPrice}
          keyboardType="numeric"
        />
        <ProductInput
          placeholder="Sklep"
          value={newProductStore}
          onChangeText={setNewProductStore}
        />

        {/* Przyciski */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.addButton]}
            onPress={addProduct}
          >
            <Text style={styles.buttonText}>Dodaj</Text>
          </Pressable>

          <View style={styles.buttonSpacer} />

          <Pressable
            style={[styles.button, styles.sortButton]}
            onPress={sortProducts}
          >
            <Text style={styles.buttonText}>Sortuj</Text>
          </Pressable>
        </View>

        {/* Pole filtrujące */}
        <ProductInput
          placeholder="Filtruj produkty"
          value={filter}
          onChangeText={setFilter}
        />

        {/* Lista produktów */}
        <SectionList
          sections={[{ title: 'Lista zakupów', data: filterProducts() }]}
          keyExtractor={(item, index) => item.name + index}
          renderItem={renderProduct}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

// Komponent ProductInput
const ProductInput = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#aaa"
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
  />
);

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6', // Jasnoniebieskie tło
    alignItems: 'center', // Wycentrowanie w poziomie
    justifyContent: 'center', // Wycentrowanie w pionie
    padding: 20,
  },
  inputContainer: {
    alignItems: 'center', // Wycentrowanie wewnętrznych elementów
    width: '100%',
  },
  titleContainer: {
    backgroundColor: '#ffff00', // Żółte tło
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00008b', // Ciemnogranatowy kolor
    textAlign: 'center',
  },
  innerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red', // Czerwony kolor
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', // Białe wnętrze inputa
    fontSize: 16,
    width: '85%', // 85% szerokości ekranu
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: 120,
    marginHorizontal: 15, // Odstęp między przyciskami
    marginVertical: 10, // Odstęp góra/dół
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  sortButton: {
    backgroundColor: '#007BFF',
  },
  buttonSpacer: {
    width: 30, // Odstęp między przyciskami
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#555',
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ShopListApp;