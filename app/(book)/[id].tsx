import {Animated, StyleSheet, View, Image, Text, TouchableOpacity} from "react-native";
import {Stack, useGlobalSearchParams, useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {FIRESTORE_DB} from "../../config/FirebaseConfig";
import {deleteDoc, doc, getDoc, updateDoc} from "@firebase/firestore";
import ScrollView = Animated.ScrollView;
import {Ionicons} from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';

export default function BookPage() {
  const route = useRoute();
  const { id } = route.params;
  const [book, setBook] = useState<any>(null);
  const navigation = useNavigation();

  console.log("TEST ID: ",id);
  console.log("TEST BOOK: ",book);

  useEffect(() => {
    if(!book) return;
    const favourite = book.favourite;



    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleFavourite}>
          <Ionicons name={favourite ? 'heart' : 'heart-outline'} size={24} color='red' />
        </TouchableOpacity>
      )
    });
  }, [book]);

  /*
  useEffect(() => {
    if(!id) return;
    const load = async () => {
      const fbDoc = await getDoc(doc(FIRESTORE_DB, `users/markus/books/${id}`));
      if(!fbDoc.exists()) return;
      const data = await fbDoc.data();
      setBook(data);
    };
    load();
  }, [id]);

   */
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



  const toggleFavourite = () => {
    const isFavourite = book.favourite;
    const fbDoc = doc(FIRESTORE_DB, `users/markus/books/${id}`);
    updateDoc(fbDoc, { favourite: !isFavourite });
    setBook({ ...book, favourite: !isFavourite });
  };

  const removeBook = () => {
    const fbDoc = doc(FIRESTORE_DB, `users/markus/books/${id}`);
    deleteDoc(fbDoc);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          {book && (
            <>
            <Image style={styles.image} source={{ uri: book.volumeInfo.imageLinks.thumbnail }} />
              <Text style={styles.title}>{book.volumeInfo.title}</Text>
              <Text>{book.volumeInfo.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.trash} onPress={() => removeBook()}>
        <Ionicons name={'trash-outline'} size={35}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*justifyContent: 'center',
    alignItems: 'flex-start',*/
    backgroundColor: '#fcf7ed'
  },
  card: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 4,
    marginBottom: 20,
    alignSelf: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 2
  },
  trash: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 8
  }
});