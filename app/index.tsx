import {View, Text, StyleSheet, Image} from "react-native";
import {colors} from "../colors";

export default function IndexScreen() {
    // Visuelle Darstellung des HomeScreens
    return (
        <View style={styles.screenContainer}>
            <Image
                source={require('../assets/images/inkpathlogocrop.png')}
                style={styles.logo}
            />
            <View style={styles.container}>
                <Text style={styles.welcomeTitle}>Welcome to Inkpath!</Text>
                <View style={styles.normalTextContainer}>
                    <Text style={styles.normalText}>
                        Find books from all over the world!
                    </Text>
                    <Text style={styles.normalText}>
                        To find books, visit the Book Search and choose one of the many results.
                        You can save these books to your Saved Books so you know which
                        books to look out for the next time you go book shopping!
                    </Text>
                    <Text style={styles.normalText}>
                        You can also scan the ISBN of your own books with BookScan to keep
                        an overview of which books you've already got! Just use the scanner and track
                        your owned books - now you'll never buy the same book twice.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer:{
        backgroundColor: colors.offwhite,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    container:{
        backgroundColor: colors.offwhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 25,
        backgroundColor: colors.offwhite,
    },
    welcomeTitle:{
        fontSize: 30,
        fontWeight: "bold",
    },
    normalText:{
        padding: 2,
        textAlign: "center",
    },
    normalTextContainer:{
        marginVertical: 10,
        marginHorizontal: 20,
    }
})