import {Animated, StyleSheet, View, Image, Text, TouchableOpacity} from "react-native";
import {Stack, useGlobalSearchParams, useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {FIRESTORE_DB} from "../../config/FirebaseConfig";
import {deleteDoc, doc, getDoc, updateDoc} from "@firebase/firestore";
import ScrollView = Animated.ScrollView;
import {Ionicons} from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import { colors } from '../../colors';

export default function BookPage() {
  // Variablen/Konstanten definieren
  const route = useRoute();
  const { id } = route.params;
  const [book, setBook] = useState<any>(null);
  const navigation = useNavigation();

  // Favorite-Herz in rechter oberer Ecke anzeigen
  useEffect(() => {
    if(!book) return;
    const favourite = book.favourite;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleFavourite}>
          <Ionicons name={favourite ? 'heart' : 'heart-outline'} style={styles.heart} size={32}/>
        </TouchableOpacity>
      )
    });
  }, [book]);

  // Aktuell gewähltes Buch aus Datenbank (books) laden
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const fbDoc = await getDoc(doc(FIRESTORE_DB, `users/markus/books/${id}`));
      if (!fbDoc.exists()) return;
      const data = fbDoc.data();
      setBook(data);
    };
    load();
  }, [id]);

  // Funktion um Favorite-Herz zu aktivieren / zu deaktivieren
  const toggleFavourite = () => {
    const isFavourite = book.favourite;
    const fbDoc = doc(FIRESTORE_DB, `users/markus/books/${id}`);
    updateDoc(fbDoc, { favourite: !isFavourite });
    setBook({ ...book, favourite: !isFavourite });
  };

  // Funktion um eingescanntes Buch aus Datenbank löschen
  const removeBook = () => {
    const fbDoc = doc(FIRESTORE_DB, `users/markus/books/${id}`);
    deleteDoc(fbDoc);
    navigation.goBack();
  };

  // Visuelle Darstellung der Buch-Details des gewählten eingescannten Buches
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          {book && (
              <>
            <Image style={styles.cover} source={{ uri: book.volumeInfo.imageLinks.thumbnail }} />
              <Text style={styles.title}>{book.volumeInfo.title}</Text>
                <Text style={styles.author}>{book.volumeInfo.authors[0]}</Text>
                <Text style={styles.publishDate}>{book.volumeInfo.publishedDate}</Text>
              <Text style={styles.description}>{book.volumeInfo.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.trash} onPress={() => removeBook()}>
        <Ionicons name={'trash-outline'} size={35} color={colors.offwhite}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.offwhite,
  },
  cover: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    fontSize: 20,
    color: colors.midgreen,
    marginBottom: 2,
  },
  publishDate: {
    fontSize: 16,
    color: colors.midgreen,
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: 3,
    borderColor: colors.lightgreen,
  },
  description: {
    fontSize: 16,
    color: colors.darkgreen,
    paddingBottom: 40,
  },
  card: {
    flex: 1,
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 40,
    backgroundColor: colors.purewhite,
    borderRadius: 10,
    elevation: 5
  },
  trash: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: colors.salmon,
    borderRadius: 30,
    elevation: 8
  },
  heart: {
    color: colors.heart,
    marginRight: 20,
  }
});