import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../colors';
import { serverTimestamp, deleteDoc, doc, getDocs, query, where } from '@firebase/firestore';
import { FIRESTORE_DB } from '../config/FirebaseConfig';
import {addDoc, collection} from "firebase/firestore";

export default function BookDetails({ route }) {
    const { book } = route.params;

    const [bookDesc, setBookDesc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notSaved, setNotSaved] = useState(false); // State to track if book is saved
    const [docId, setDocId] = useState(null); // State to store the document ID


    useEffect(() => {
        const fetchBookDesc = async () => {
            try {
                const response = await fetch(`https://openlibrary.org${book.key}.json`);
                const data = await response.json();
                setBookDesc(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDesc();
    }, [book.key]);

/*
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const q = query(collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks'), where("bookId", "==", book.key));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setNotSaved(false); // Book is already saved
                }
                else{
                    setNotSaved(true);
                }
            } catch (error) {
                console.error("Error checking if book is saved: ", error);
            }
        };

        checkIfSaved();
    }, [book.key]);

 */

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const q = query(collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks'), where("bookId", "==", book.key));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setDocId(querySnapshot.docs[0].id); // Save the document ID
                    setNotSaved(false); // Book is already saved
                } else {
                    setNotSaved(true);
                }
            } catch (error) {
                console.error("Error checking if book is saved: ", error);
            }
        };

        checkIfSaved();
    }, [book.key]);

    /*
    const saveBook = async () => {
        const newBook = {
            bookId: book.key,
            title: book.title,
            authors: book.author_name,
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '',
            description: bookDesc?.description?.value || 'No description available',
            created: serverTimestamp()
        };
        // Add `newBook` to Firestore
        await addDoc(collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks'), newBook);
        setNotSaved(false); // Update state to indicate book is saved
    };

     */

    /*
    const removeBook = async () => {
        // Implement logic to remove the book from Firestore
        // Example: Delete the document by its ID
        await deleteDoc(doc(FIRESTORE_DB, 'users', 'markus', 'savedBooks', 'works', book.key));
        //const fbDoc = doc(FIRESTORE_DB, `users/markus/savedBooks/${id}`);
        //deleteDoc(fbDoc);
        setNotSaved(true); // Update state to indicate book is removed
    };

     */

    const saveBook = async () => {
        const newBook = {
            bookId: book.key,
            title: book.title,
            authors: book.author_name,
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '',
            description: bookDesc?.description?.value || 'No description available',
            created: serverTimestamp()
        };
        const docRef = await addDoc(collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks'), newBook);
        setDocId(docRef.id); // Save the new document ID
        setNotSaved(false); // Update state to indicate book is saved
    };

    const removeBook = async () => {
        try {
            if (docId) {
                await deleteDoc(doc(FIRESTORE_DB, 'users', 'markus', 'savedBooks', docId));
                setNotSaved(true); // Update state to indicate book is removed
                setDocId(null); // Reset the document ID
            }
        } catch (error) {
            console.error('Error removing book:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color={colors.salmon} />;
    }

    return (
        <ScrollView style={styles.screenContainer}>
            <View style={styles.card}>
                {book.cover_i ? (
                    <Image
                        source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` }}
                        style={styles.cover}
                    />
                ) : (
                    <Image
                        source={require('../assets/images/noimagelogo.png')}
                        style={styles.cover}
                    />
                )}
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>{book.author_name && book.author_name.length > 0
                    ? book.author_name.join(', ')
                    : 'No author available'}</Text>
                <Text style={styles.publishDate}>{book.first_publish_year
                    || 'No date available'}</Text>
                <Text style={styles.description}>{bookDesc?.description?.value
                    || 'No description available'}</Text>

                {!notSaved ? (
                    <TouchableOpacity style={styles.removeButton} onPress={removeBook}>
                        <Text style={styles.removeButtonText}>Remove Book</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.saveButton} onPress={saveBook}>
                        <Text style={styles.saveButtonText}>Save Book</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.offwhite,
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
    saveButton: {
        backgroundColor: colors.darkgreen,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center'
    },
    saveButtonText: {
        color: colors.offwhite,
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: colors.salmon,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center'
    },
    removeButtonText: {
        color: colors.offwhite,
        fontSize: 16,
    },
});
