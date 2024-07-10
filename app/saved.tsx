import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../config/FirebaseConfig';
import { colors } from '../colors';
import { Ionicons } from '@expo/vector-icons';

export default function LibraryScreen() {
    const [savedBooks, setSavedBooks] = useState([]);

    useEffect(() => {
        const savedBooksCollection = collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks');
        const unsubscribe = onSnapshot(savedBooksCollection, (snapshot) => {
            const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSavedBooks(books);
        });
        return () => unsubscribe();
    }, []);

    const removeBook = async (bookId) => {
        try {
            await deleteDoc(doc(FIRESTORE_DB, 'users', 'markus', 'savedBooks', bookId));
        } catch (error) {
            console.error('Error removing book: ', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.bookItem}>
            {item.cover ? (
                <Image source={{ uri: item.cover }} style={styles.cover} />
            ) : (
                <Image source={require('../assets/images/noimagelogo.png')} style={styles.cover} />
            )}
            <View style={styles.bookInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.authors?.join(', ')}</Text>
            </View>
            <View style={styles.trashContainer}>
                <TouchableOpacity style={styles.trash} onPress={() => removeBook(item.id)}>
                    <Ionicons name={'trash-outline'} size={35} color={colors.offwhite} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={savedBooks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.offwhite,
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
    description: {
        fontSize: 14,
        color: colors.darkgreen,
    },
    cover: {
        width: 50,
        height: 75,
        marginRight: 10,
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
    trashContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
