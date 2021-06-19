import React from "react";
import { StyleSheet, View, Text, Image, StatusBar } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
     <StatusBar
      animated={true}
      backgroundColor="#fff"
      barStyle={'dark-content'} />
      <Image style={styles.logo} source={require('../src/logo.png')} />
      <Text style={styles.bottomText}>
        Moon Meet
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  logo: {
    height: 180,
    width: 180,
    position: "absolute",
    top: "80%"
  },
  bottomText: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    bottom: 10,
    color: '#566193',
  },
});

export default SplashScreen;
