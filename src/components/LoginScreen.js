import * as React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";

const LoginScreen = () => {
  return (
    <SafeAreaView nativeID={'container'} style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"} />
      <View nativeID={'top_view'} style={styles.top_bar}>
        <Text nativeID={'top_text'} style={styles.top_text}>
          Your Phone
        </Text>
      </View>
      <View nativeID={'top_view_divider'} style={styles.divider}>
      </View>
      <View nativeID={'dummy_view'}>
      </View>
      <View nativeID={'country_holder'} style={styles.country_holder}>
        <Text>
          ffff
        </Text>
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
    right: 0,
    fontSize: 20,
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  country_holder: {
    flexDirection: 'row',
    padding: 16,
  },
});

export default LoginScreen;
