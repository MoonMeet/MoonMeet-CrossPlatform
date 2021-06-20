import * as React from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";


const WelcomeScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={"#FFFFFF"}
        barStyle={"dark-content"} />
      <View style={styles.top_view}>
        <Image style={styles.moon_meet_logo} source={require("../assets/images/logo.png")} />
        <Text style={styles.moon_meet_text}>
          Moon Meet
        </Text>
      </View>
      <Image style={styles.top_left_image} source={require("../assets/images/motivation.png")} />
      <Image style={styles.mid_right_image} source={require("../assets/images/innovation.png")} />
      <Image style={styles.bottom_right_image} source={require("../assets/images/flying_kite.png")} />
      <Text style={styles.welcome_bottom_text}>
        Say Hello to Moon Meet
      </Text>
      <Text style={styles.mini_text}>
        Join us with your relationships, It's time to hang out and have fun with them.
      </Text>
      <Button style={styles.register_button}
              uppercase={false}
              color="#566193"
              mode="outlined"
              onPress={() => navigation.navigate("register")}>
        Register
      </Button>
      <Button style={styles.login_button}
              uppercase={false}
              color="#999999"
              mode="outlined"
              onPress={() => navigation.navigate("splash")}>
        Login
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 5,
  },
  top_view: {
    flexDirection: "row",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  moon_meet_logo: {
    height: 100,
    width: 100,
    position: "relative",
  },
  moon_meet_text: {
    position: "relative",
    textAlign: "center",
    fontSize: 20,
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  top_left_image: {
    position: "relative",
    height: 200,
    width: 200,
    bottom: 40,
  },
  mid_right_image: {
    position: "relative",
    height: 200,
    width: 200,
    left: 200,
    bottom: 100,
  },
  bottom_right_image: {
    position: "relative",
    height: 200,
    width: 200,
    bottom: 200,
  },
  welcome_bottom_text: {
    position: 'relative',
    textAlign: 'center',
    fontSize: 22,
    bottom: 165,
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  mini_text: {
    position: 'relative',
    textAlign: 'center',
    fontSize: 16,
    bottom: 150,
    color: COLORS.darkGrey,
    fontFamily: FONTS.regular,
  },
  register_button: {
    position: "relative",
    textAlign: "center",
    width: -1,
    fontSize: 20,
    bottom: 70,
    fontFamily: FONTS.regular,
  },
  login_button: {
    position: "relative",
    textAlign: "center",
    width: -1,
    fontSize: 20,
    bottom: 60,
    fontFamily: FONTS.regular,
  },
});

export default WelcomeScreen;
