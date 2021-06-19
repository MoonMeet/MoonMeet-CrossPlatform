import React from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Button } from "react-native-paper";

const IntroScreen = () => {
  return (
    <PagerView style={styles.PagerView} initialPage={0}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"} />
      <View style={styles.PagerRender} key="1">
        <Image style={styles.illustration} source={require("../src/assets/images/startup_intro.png")} />
        <Text style={styles.introduction_top_text}>Welcome to Moon Meet</Text>
        <Text style={styles.introduction_bottom_text}>Moon Meet is a chat application that completely focus on Privacy,
          Connection and Features.</Text>
      </View>
      <View style={styles.PagerRender} key="2">
        <Image style={styles.illustration} source={require("../src/assets/images/chatting_intro.png")} />
        <Text style={styles.introduction_top_text}>Hanging out with your Relationships</Text>
        <Text style={styles.introduction_bottom_text}>Get in touch with your Relationships by inviting them to use Moon
          Meet and join the party with you.</Text>
      </View>
      <View style={styles.PagerRender} key="3">
        <Image style={styles.illustration} source={require("../src/assets/images/get_started.png")} />
        <Text style={styles.introduction_top_text}>Let's get started</Text>
        <Text style={styles.introduction_bottom_text}>Press the Continue button bellow to access to your Moon Meet
          Account or Sign Up</Text>
        <Button style={styles.introduction_button} uppercase={false} color="#566193" mode="outlined"
                onPress={() => console.log("Pressed")}>
          Continue
        </Button>
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  PagerView: {
    flex: 1,
  },
  PagerRender: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 8,
  },
  illustration: {
    height: 300,
    width: 300,
    bottom: 100,
    position: "relative",
  },
  introduction_top_text: {
    position: "relative",
    textAlign: "center",
    fontSize: 20,
    color: "#566193",
  },
  introduction_bottom_text: {
    position: "relative",
    textAlign: "center",
    fontSize: 16,
    top: 20,
    color: "#999999",
  },
  introduction_button: {
    position: "absolute",
    textAlign: "center",
    fontSize: 20,
    bottom: 10,
  },
});

export default IntroScreen;
