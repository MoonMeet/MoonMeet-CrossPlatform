import React, {useEffect} from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import {useNavigation} from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation()
  useEffect(()=>{
    setTimeout(()=>{
      navigation.navigate('onboarding')
    }, 2000)
  })
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"} />
      <Image style={styles.logo} source={require("../assets/images/logo.png")} />
      <Text style={styles.bottom_text}>
        Moon Meet
      </Text>
      <Text style={styles.slogan_text}>
        We give people the closest distances
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 8,
  },
  logo: {
    height: 230,
    width: 230,
    position: "relative",
    bottom: 100,
  },
  bottom_text: {
    position: "absolute",
    textAlign: "center",
    fontSize: 20,
    bottom: 50,
    color: "#566193",
  },
  slogan_text: {
    position: "absolute",
    textAlign: "center",
    fontSize: 16,
    bottom: 20,
    color: "#999999",
  },
});

export default SplashScreen;
