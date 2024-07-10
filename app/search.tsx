import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, ActivityIndicator,
    Image, TouchableOpacity } from 'react-native';
import {colors} from "../colors";
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
    // Variablen/Konstanten definieren
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const searchBooks = async () => {
        // Lade-Status setzen
        setLoading(true);
        // Daten aus Open Library API fetchen
        try {
            // aktuell: "?q=" -> verschiedene Bereiche werden durchsucht (Titel, Autor, mehr)
            // alternativ möglich: "?title=" -> nur nach Titel wird gesucht
            const response = await fetch(`http://openlibrary.org/search.json?q=${query}`);
            const data = await response.json();
            setBooks(data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            // Lade-Status aufheben
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Search for a book title"
                value={query}
                onChangeText={setQuery}
            />

            {/* Suche starten */}
            <View style={styles.searchButtonContainer}>
                <Button title="Search" onPress={searchBooks} color={colors.salmon}/>
            </View>
            {/* Lade-Kreis anzeigen während Ladezeit, erst wenn fertig Ergebnisse */}
            {loading ? (
                <ActivityIndicator size="large" color={colors.salmon} style={styles.indicatorContainer}/>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('BookDetails', { book: item })}
                            style={styles.bookItem}
                        >
                            {item.cover_i ? (
                                <Image
                                    source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` }}
                                    style={styles.cover}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/images/noimagelogo.png')}
                                    style={styles.cover}
                                />
                            )}
                            <View style={styles.bookInfo}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.author}>{item.author_name?.join(', ')}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.offwhite,
    },
    input: {
        height: 40,
        borderColor: colors.darkgreen,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        backgroundColor: colors.purewhite,
    },
    bookItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.lightgreen,
        marginTop: 10,
        borderRadius: 10,
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
    searchButtonContainer: {
        paddingBottom: 10,
        borderBottomColor: colors.darkgreen,
        borderBottomWidth: 2,
    },
    indicatorContainer: {
        padding: 30,
    },
});