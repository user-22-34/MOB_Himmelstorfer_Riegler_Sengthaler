import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../colors';
import { serverTimestamp, deleteDoc, doc, getDocs, query, where } from '@firebase/firestore';
import { FIRESTORE_DB } from '../config/FirebaseConfig';
import {addDoc, collection} from "firebase/firestore";

export default function BookDetails({ route }) {
    // Buch aus gegebenen Daten erstellen (alle Daten werden übergeben)
    const { book } = route.params;
    // Variablen/Konstanten definieren
    const [bookDesc, setBookDesc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notSaved, setNotSaved] = useState(false); // State to track if book is saved
    const [docId, setDocId] = useState(null); // State to store the document ID

    // Fetchen der Buchbeschreibung
    // (In der Open Library API Abfrage aus search.tsx fehlt die Beschreibung
    //  -> diese wird hier mit einer anderen Abfragen-Art an Open Library API
    //  gefetcht. BookDesc ist also ein Objekt das weit mehr als nur die Buch-
    //  Beschreibung enthält, aber wir brauchen nur die Beschreibung weil wir
    //  den Rest aus den mitgegebenen Parametern haben.)
    useEffect(() => {
        const fetchBookDesc = async () => {
            try {
                const response = await fetch(`https://openlibrary.org${book.key}.json`);
                const data = await response.json();
                setBookDesc(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Speicher-Stand updaten
            }
        };
        fetchBookDesc();
    }, [book.key]);

    // Kontrollieren, ob Buch das in Detailansicht geöffnet ist, bereits in
    // Datenbank vorhanden ist
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const q =
                    query(collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks'),
                        where("bookId", "==", book.key));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setDocId(querySnapshot.docs[0].id); // document ID speichern
                    setNotSaved(false); // Book bereits gespeichert
                } else {
                    setNotSaved(true); // Buch noch nicht gespeichert
                }
            } catch (error) {
                console.error("Error while checking if book is saved: ", error);
            }
        };
        checkIfSaved();
    }, [book.key]);

    // Funktion um Buch zu speichern und in Datenbank zu savedBooks hinzuzufügen
    const saveBook = async () => {
        const newBook = {
            bookId: book.key,
            title: book.title,
            authors: book.author_name,
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '',
            description: bookDesc?.description?.value || 'No description available',
            created: serverTimestamp()
        };
        const docRef = await addDoc(
            collection(FIRESTORE_DB, 'users', 'markus', 'savedBooks'), newBook);
        setDocId(docRef.id); // neue document ID speichern
        setNotSaved(false); // Speicher-Status updaten / Buch gespeichert
    };

    // Funktion um Buch zu ent-speichern und in Datenbank von savedBooks zu löschen
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

    // Speicherstand der Kurzbeschreibung anzeigen durch Lade-Kreis
    if (loading) {
        return <ActivityIndicator size="large" color={colors.salmon} />;
    }

    // Visuelle Ausgabe der Buchdetails
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

                {/* Button um Buch zu speichern / zu ent-speichern */}
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
