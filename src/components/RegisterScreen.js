import * as React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { TextInput } from "react-native-paper";

const RegisterScreen = () => {
  const [text, setText] = React.useState("");
  return (
    <SafeAreaView nativeID={"container"} style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"} />
      <View nativeID={"top_view"} style={styles.top_bar}>
        <Text nativeID={"top_text"} style={styles.top_text}>
          Your Phone
        </Text>
      </View>
      <View nativeID={"top_view_divider"} style={styles.divider} />
      <View style={{ height: 35 }} nativeID={"first_dummy_view"}>
      </View>
      /*<View nativeID={"country_holder"} style={styles.country_holder}>
        <Text nativeID={"country_text"} style={styles.country_text}>
          Invalid Country Code
        </Text>
        <View nativeID={"country_divider"} style={styles.divider} />*/
      </View>
      <View nativeID={"second_dummy_view"} style={{ height: 35 }} />
      <View nativeID={"dial_and_number_holder"} style={styles.dial_and_number}>
        <View nativeID={"dial_holder"} style={styles.dial_holder}>
          <TextInput style={styles.dial_edittext}
                     label="Dial Code"
                     value={text}
                     numberOfLines={1}
                     onChangeText={text => setText(text)}>
          </TextInput>
        </View>
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
  country_holder: {
    padding: 16,
  },
  country_text: {
    position: "relative",
    fontSize: 18,
    bottom: 5,
    textAlign: "center",
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  dial_and_number: {
    position: "relative",
    flexDirection: "row",
  },
  dial_holder: {
    position: "relative",
    padding: 16,
  },
  dial_edittext: {
    width: 50,
  },
});

export default RegisterScreen;
