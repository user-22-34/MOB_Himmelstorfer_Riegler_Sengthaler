import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { getBookByISBN } from "../api/books";
import { addDoc, collection, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/FirebaseConfig";
import { useRouter } from "expo-router";
import { colors } from "../colors";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

export default function List() {
  // BarCode scan handling
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
    if (!bookData.items) return;
    await addBook(bookData.items[0]);
    setScanned(false);
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
    await addDoc(collection(FIRESTORE_DB, 'users', 'markus', 'books'), newBook);
  };

  const removeBook = async (bookId: string) => {
    try {
      await deleteDoc(doc(FIRESTORE_DB, 'users', 'markus', 'books', bookId));
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('BookPage', { id: item.id })}>
          <View style={styles.bookItem}>
            <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.cover} />
            <View style={styles.bookInfo}>
              <Text style={styles.title}>{item.volumeInfo.title}</Text>
              <Text style={styles.author}>{item.volumeInfo.authors[0]}</Text>
            </View>
            <View style={styles.trashContainer}>
              <TouchableOpacity style={styles.trash} onPress={() => removeBook(item.id)}>
                <Ionicons name={'trash-outline'} size={35} color={colors.offwhite} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  return (
      <View style={styles.container}>
        {showScanner &&
            <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={styles.barCodeScanner}/>
        }
        <FlatList data={books} renderItem={renderItem} keyExtractor={(item) => item.id}/>
        {hasPermission &&
            <TouchableOpacity style={styles.fab} onPress={() => {
              if (showScanner) {
                setShowScanner(false);
              } else {
                setShowScanner(true);
              }
            }}>
              <Text style={styles.fabIcon}>{showScanner ? '×' : '+'}</Text>
            </TouchableOpacity>
        }
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.offwhite,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: colors.salmon,
    borderRadius: 30,
    elevation: 8,
    zIndex: 3,
  },
  trash: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.salmon,
    borderRadius: 30,
    elevation: 8,
    marginLeft: 14,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white'
  },
  bookItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.lightgreen,
    marginTop: 10,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookInfo: {
    flex: 1,
  },
  author: {
    fontSize: 16,
    color: colors.midgreen,
  },
  cover: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  trashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barCodeScanner: {
    width: '100%',
    height: '100%',
    elevation: 2,
    zIndex: 2}
});
