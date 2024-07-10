import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {colors} from "../colors.js";

export default function LibraryScreen() {
    const styles = StyleSheet.create({
        screenContainer: {
            flex: 1,
            backgroundColor: colors.offwhite,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.screenContainer}>
            <Text>*noch nicht existierend*</Text>
        </View>
    );
}