import {View, Text, StyleSheet, Image} from "react-native";
import {colors} from "../colors";

export default function IndexScreen() {
    return (
        <View style={styles.screenContainer}>
            <Image
                source={require('../assets/images/inkpathlogocrop.png')}
                style={styles.logo}
            />
            <View style={styles.container}>
                <Text style={styles.welcomeTitle}>Welcome to Inkpath!</Text>
                <Text style={styles.normalText}>
                    Find books from all over the world and track your reading!
                    {"\n"}
                    To find books, visit the Book Search and choose one of the many results.
                    In your Library, you can see every book you saved.
                </Text>
            </View>
        </View>
        /*
        <Redirect href="/search"/>
         */
    );
}
/*
export default function HomePage(){
    return (
        <View style={styles.container}>
            <Text>index tsx - klappts??</Text>
        </View>
    )
}
*/
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
        marginVertical: 10,
        marginHorizontal: 20,
        textAlign: "center",
    }
})
