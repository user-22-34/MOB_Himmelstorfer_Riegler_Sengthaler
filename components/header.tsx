import {View, Text, StyleSheet} from "react-native";
import {colors} from "../colors.js";

export default function Header({hTitle}){
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{hTitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 80,
        paddingTop: 38,
        backgroundColor: colors.darkgreen,
        width: "100%",
        marginBottom: 20
    },
    title: {
        textAlign: "center",
        color: colors.offwhite,
        fontSize: 20,
        fontWeight: "bold"
    },
});
