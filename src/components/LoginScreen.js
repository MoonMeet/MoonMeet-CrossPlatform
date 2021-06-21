import * as React from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { Button, TextInput } from "react-native-paper";

const LoginScreen = () => {
  const [CountryText, CountrySetText] = React.useState("");
  const [NumberText, NumberSetText] = React.useState("");
  const onCodeTextInputFocus = () => {
    console.log('CountryEditText focused!')
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"} />
      <View style={styles.top_bar}>
        <Text style={styles.top_text}>
          Your Phone
        </Text>
      </View>
      <View style={styles.divider}>
      </View>
      <View style={styles.dummy}>
      </View>
      <View style={{
        padding: 10,
        flexDirection: "row",
      }}>
        <TextInput style={{
          width: 140,
          padding: 4,
        }}
                   mode="outlined"
                   keyboardType={Platform.OS === 'android' ? "numeric" : "number-pad"}
                   label="Country Code"
                   value={CountryText}
                   onFocus={() => onCodeTextInputFocus()}
                   placeholder={"eg, +1"}
                   multiline={false}
                   theme={{
                     colors: {
                       text: COLORS.accent,
                       primary: COLORS.accent,
                       backgroundColor: COLORS.rippleColor,
                       placeholder: COLORS.darkGrey,
                       underlineColor: "#566193",
                       selectionColor: "#DADADA",
                       outlineColor: "#566193",
                     },
                   }}
                   onChangeText={CountryText => CountrySetText(CountryText)}
        />
        <TextInput style={{
          width: 240,
          padding: 4,
        }}
                   mode="outlined"
                   keyboardType={Platform.OS === 'android' ? "numeric" : "number-pad"}
                   label="Phone Number"
                   value={NumberText}
                   placeholder={"eg, +1 (566) 874 364"}
                   multiline={false}
                   theme={{
                     colors: {
                       text: COLORS.accent,
                       primary: COLORS.accent,
                       backgroundColor: COLORS.rippleColor,
                       placeholder: COLORS.darkGrey,
                       underlineColor: "#566193",
                       selectionColor: "#DADADA",
                       outlineColor: "#566193",
                     },
                   }}
                   onChangeText={NumberText => NumberSetText(NumberText)}
        />
      </View>
      <View style={{
        padding: 16,
        position: 'relative',
        bottom: 40,
      }}>
      <Button
        style={styles.SendCode}
        uppercase={false}
        color="#566193"
        mode="outlined"
        onPress={() => console.log("button clicked")}>
        Send Code
      </Button>
    </View>
</SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  top_bar: {
    flexDirection: "row",
    padding: 10,
  },
  divider: {
    width: -1,
    height: 1,
    backgroundColor: COLORS.controlHighlight,
  },
  top_text: {
    position: "relative",
    fontSize: 20,
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  dummy: {
    height: 35,
    width: -1,
  },
  SendCode: {
    position: "relative",
    top: 30,
    textAlign: "center",
    fontSize: 20,
    fontFamily: FONTS.regular,
  },
});

export default LoginScreen;
