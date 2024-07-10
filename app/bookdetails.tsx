import {View, Text, StyleSheet, Image, ActivityIndicator, ScrollView} from 'react-native';
import { colors } from '../colors';
import {useEffect, useState} from "react";

export default function BookDetails({ route }) {
    const { book } = route.params;

    const [bookDesc, setBookDesc] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <Text style={styles.description}>{bookDesc.description?.value
                    || 'No description available'}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.offwhite,
    },
    screenContainer: {
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
});
