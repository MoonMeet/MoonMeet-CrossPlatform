import React from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {COLORS} from "../config/Miscellaneous";

const SetupScreen = () => {
    return(
        <SafeAreaView style={styles.container}>
            <View>
            <Text>
                test
            </Text>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryLight,
    }
})
export default SetupScreen;
