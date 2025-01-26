import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShopListApp = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStore, setNewProductStore] = useState("");
  const [filter, setFilter] = useState("");
  const [sorted, setSorted] = useState(false);


  //	Zapisywanie listy produktów: AsyncStorage

  const saveProductsToStorage = async (products) => {
    try {
      await AsyncStorage.setItem('shoppingList', JSON.stringify(products));
    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    }
  };

  //		Ładowanie zapisanych produktów przy starcie aplikacji:

  const loadProductsFromStorage = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('shoppingList');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Błąd podczas ładowania danych:', error);
    }
  };
  
  useEffect(() => {
    loadProductsFromStorage();
  }, []);

  //    Zapisywanie listy produktów po każdej zmianie:
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  const addProduct = () => {
    if (
      newProductName.trim() !== "" &&
      newProductPrice.trim() !== "" &&
      newProductStore.trim() !== ""
    ) {
      const formattedPrice = newProductPrice.replace(",", "."); // Zamiana przecinka na kropkę
      const newProduct = {
        id: Date.now().toString(), // Unikalny identyfikator oparty na czasie
        name: newProductName.trim(),
        price: parseFloat(formattedPrice), // Konwersja na liczbę
        store: newProductStore.trim(),
        purchased: false,
        isNew: true, // Flaga dla nowego elementu
      };

      // Zaktualizuj stan produktów
      setProducts([newProduct, ...products]); // TUTAJ AKTUALIZUJEMY STAN

      // Po animacji resetujemy flagę `isNew`
      setTimeout(() => {
        setProducts((prevProducts) =>
          prevProducts.map((product) => ({ ...product, isNew: false }))
        );
      }, 500); // Czas trwania animacji

      // Resetujemy wszystkie pola
      setNewProductName("");
      setNewProductPrice("");
      setNewProductStore("");
      setSorted(false); // Reset sortowania
      // Ukrywamy klawiaturę
      Keyboard.dismiss();
    } else {
      // Wyświetlamy alert, jeśli któryś z inputów jest pusty
      Alert.alert(
        "Błąd", // Tytuł okienka
        "Wszystkie pola muszą być wypełnione!", // Treść wiadomości
        [{ text: "OK", onPress: () => console.log("Alert zamknięty") }] // Opcje przycisków
      );
    }
  };

  // usuwania produktu z listy na podstawie jego indeksu
  // Tworzy się kopia tablicy products za pomocą spread operatora [...products]
  // Metoda splice() wywołana na kopii tablicy updatedProducts usuwa element o podanym indeksie z tablicy
  const removeProduct = (id) => {
    // Oznaczamy produkt jako usuwany
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, exiting: true } : product
      )
    );

    // Usuwamy element po zakończeniu animacji
    setTimeout(() => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    }, 500); // Czas trwania animacji
  };

  // renderujemy dodanie produktu

  // renderuje widok pojedynczego produktu -> do przycisku Dodaj
  const renderProduct = ({ item, index }) => (
    <Animated.View
      key={item.id} // Klucz oparty na unikalnym id
      entering={item.isNew ? SlideInLeft.duration(500) : undefined} // Animacja dla nowo dodanych elementów
      exiting={item.exiting ? SlideOutRight.duration(500) : undefined} // Animacja przy usuwaniu elementów
      style={[styles.productItemRow, styles.productItem]}
    >
      {/* Dane produktu */}
      <Animated.View style={styles.productItem}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toFixed(2)} zł</Text>
        <Text style={styles.productStore}>{item.store}</Text>
      </Animated.View>

      {/* Przyciski */}
      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.pressableButton, styles.toBuyButton]}
          onPress={() => togglePurchased(item.id)}
        >
          <Text
            style={[
              styles.buttonText,
              item.purchased ? styles.purchasedText : styles.toBuyText, // Zmiana koloru tekstu
            ]}
          >
            {item.purchased ? "Kupione" : "Do kupienia"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.pressableButton, styles.deleteButton]}
          onPress={() => removeProduct(item.id)}
        >
          <Text style={styles.buttonText}>Usuń</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  // przełączania stanu zakupu produktu: kupione <-> do zakupu
  const togglePurchased = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, purchased: !product.purchased }
          : product
      )
    );
  };

  const filterProducts = () => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const sortProducts = () => {
    const sortedProducts = [...products].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setProducts(sortedProducts);
    setSorted(true);
  };

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
          sections={[{ title: "Lista zakupów", data: filterProducts() }]}
          keyExtractor={(item) => item.id} // Użyj `id` jako klucza
          renderItem={renderProduct}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.listContainer} // Styl listy
        />
      </View>
    </SafeAreaView>
  );
};

// Komponent ProductInput
const ProductInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}) => (
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
  productItemRow: {
    flexDirection: "row", // Ustawia elementy w jednej linii poziomo
    justifyContent: "center", // Odstępy między elementami
    alignItems: "center", // Wyśrodkowanie w pionie
  },
  productItem: {
    flexDirection: "row", // Wszystkie elementy w jednym wierszu
    alignItems: "flex-start", // Wyśrodkowanie w pionie
    justifyContent: "space-between", // Odstępy między elementami
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "85%", // Szerokość całego wiersza
    alignSelf: "center", // Wycentrowanie na ekranie
  },
  textContainer: {
    flex: 2, // Zajmuje więcej miejsca
    justifyContent: "flex-start", // Pozycjonowanie w pionie
    alignItems: "flex-start", // Wyrównanie do lewej
    textAlign: "left", // Tekst wewnątrz wyrównany do lewej
    flexDirection: "column", // Ustawiamy kierunek flex na kolumnę
  },
  buttonGroup: {
    flexDirection: "row", // Przyciski w jednej linii
    //alignItems: 'flex-end', // Wyśrodkowanie w pionie
    // justifyContent: 'flex-end', // Wyrównanie do prawej
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#555",
  },
  productStore: {
    fontSize: 14,
    color: "#888",
  },
  pressableButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100, // Minimalna szerokość przycisków
    marginLeft: 10, // Odstęp między przyciskami
  },
  toBuyButton: {
    backgroundColor: "orange", // Pomarańczowe tło
  },
  toBuyText: {
    color: "red", // Czerwony tekst dla "Do kupienia"
  },
  purchasedText: {
    color: "#fff", // Biały tekst dla "Kupione"
  },
  deleteButton: {
    backgroundColor: "red", // Czerwone tło
  },
  buttonText: {
    color: "#fff", // Biały tekst
    fontWeight: "bold",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#add8e6", // Jasnoniebieskie tło
    alignItems: "center", // Wycentrowanie w poziomie
    justifyContent: "flex-start", // Wycentrowanie w pionie
    padding: 20,
    paddingTop: 50,
  },
  inputContainer: {
    alignItems: "center", // Wycentrowanie wewnętrznych elementów
    width: "100%",
  },
  titleContainer: {
    backgroundColor: "#ffff00", // Żółte tło
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00008b", // Ciemnogranatowy kolor
    textAlign: "center",
  },
  innerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red", // Czerwony kolor
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff", // Białe wnętrze inputa
    fontSize: 16,
    width: "85%", // 85% szerokości ekranu
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: 120,
    marginHorizontal: 15, // Odstęp między przyciskami
    marginVertical: 10, // Odstęp góra/dół
  },
  addButton: {
    backgroundColor: "#28a745",
  },
  sortButton: {
    backgroundColor: "#007BFF",
  },
  buttonSpacer: {
    width: 30, // Odstęp między przyciskami
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#555",
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productText: {
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20, // Dodatkowy odstęp na końcu listy
  },
});

export default ShopListApp;
