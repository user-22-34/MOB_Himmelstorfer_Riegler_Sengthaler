import {View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Image} from "react-native";
import {BarCodeScanner} from "expo-barcode-scanner";
import {useEffect, useState} from "react";
import {getBookByISBN} from "../api/books";
import {addDoc, collection, onSnapshot, serverTimestamp} from "firebase/firestore";
import {FIRESTORE_DB} from "../config/FirebaseConfig";
import {useRouter} from "expo-router";
import {colors} from "../colors";

import { useNavigation } from '@react-navigation/native';

export default function List() {

  //BarCode scan handling
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();

  const navigation = useNavigation();

  useEffect(() => {
    const booksCollection = collection(FIRESTORE_DB, 'users', 'markus', 'books');
    onSnapshot(booksCollection, (snapshot) => {
      const books = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setBooks(books);
    });
  }, []);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    const code = data;
    const bookData = await getBookByISBN(code);
    console.log(`~ file: list.tsx:24 ~ ISBN scanned ~ data:`, bookData);
    setShowScanner(false);
    if(!bookData.items) return;
    await addBook(bookData.items[0]);
  };

  const addBook = async (book: any) => {
    const newBook = {
      bookId: book.id,
      volumeInfo: book.volumeInfo,
      webReaderLink: book.accessInfo?.webReaderLink,
      textSnippet: book.searchInfo.textSnippet,
      favourite: false,
      created: serverTimestamp()
    };
    const db = await addDoc(collection(FIRESTORE_DB, 'users', 'markus', 'books'), newBook)
  };

/*
  const renderItem: ListRenderItem<any> = ({item}) => {
    return (
      <TouchableOpacity onPress={() => router.push(`/(book)/${item.id}`)}>
        <View style={styles.bookItem}>
          <Image source={{uri: item.volumeInfo.imageLinks.thumbnail}} style={{width: 50, height: 50}}/>
          <View>
            <Text>{item.volumeInfo.title}</Text>
            <Text>{item.volumeInfo.authors[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
*/
  /*
  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
        <TouchableOpacity onPress={() => router.push(`/book/${item.id}`)}>
          <View style={styles.bookItem}>
            <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={{ width: 50, height: 50 }} />
            <View>
              <Text>{item.volumeInfo.title}</Text>
              <Text>{item.volumeInfo.authors[0]}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

   */

  const renderItem: ListRenderItem<any> = ({ item }) => {

    return (
        <TouchableOpacity onPress={() => navigation.navigate('BookPage', { id: item.id })}>
          <View style={styles.bookItem}>
            <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={{ width: 50, height: 50 }} />
            <View>
              <Text>{item.volumeInfo.title}</Text>
              <Text>{item.volumeInfo.authors[0]}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  };




  return (
    <View style={styles.container}>
      {showScanner &&
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}/>
      }
      <FlatList data={books} renderItem={renderItem} keyExtractor={(item) => item.id}/>
      {hasPermission &&
        <TouchableOpacity style={styles.fab} onPress={() => setShowScanner(true)}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fcf7ed'
  },
  fab:  {
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
  fabIcon: {
    fontSize: 24,
    color: 'white'
  },
  bookItem: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
    backgroundColor: 'white',
    padding: 5,
    elevation: 5,
    borderRadius: 3
  }
});