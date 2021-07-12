import React, { useCallback } from "react";
import { BackHandler, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Button } from "react-native-paper";
import { COLORS, FONTS } from "../config/Miscellaneous";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";


const IntroScreen = () => {

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const [ViewPagerPassed, setIsViewPagerPassed] = React.useState('')

  const storeViewPagerCompleted = () => {
      AsyncStorage.setItem('isViewPagerCompleted', ViewPagerPassed);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PagerView style={styles.PagerView} initialPage={0}>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle={"dark-content"} />
        <View style={styles.PagerRender} key="1">
          <Image style={styles.illustration} source={require("../assets/images/startup_intro.png")} />
          <Text style={styles.introduction_top_text}>Welcome to Moon Meet</Text>
          <Text style={styles.introduction_bottom_text}>Moon Meet is a chat application that completely focus on
            Privacy, Connection and Features.</Text>
        </View>
        <View style={styles.PagerRender} key="2">
          <Image style={styles.illustration} source={require("../assets/images/chatting_intro.png")} />
          <Text style={styles.introduction_top_text}>Hanging out with your Relationships</Text>
          <Text style={styles.introduction_bottom_text}>Get in touch with your Relationships by inviting them to use
            Moon Meet and join the party with you.</Text>
        </View>
        <View style={styles.PagerRender} key="3">
          <Image style={styles.illustration} source={require("../assets/images/get_started.png")} />
          <Text style={styles.introduction_top_text}>Let's get started</Text>
          <Text style={styles.introduction_bottom_text}>Press the Continue button bellow to access to your Moon Meet
            Account or Sign Up</Text>
          <Button style={styles.introduction_button}
                  uppercase={false}
                  color="#566193"
                  mode="contained"
                  onPress={() => {
                    setIsViewPagerPassed('true')
                    storeViewPagerCompleted();
                    navigation.navigate("login")
                  }}>
            Continue
          </Button>
        </View>
      </PagerView>
    </SafeAreaView>
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
    backgroundColor: COLORS.primaryLight,
    padding: "2%",
  },
  illustration: {
    height: 300,
    width: 300,
    bottom: "12.5%",
    position: "relative",
  },
  introduction_top_text: {
    position: "relative",
    textAlign: "center",
    fontSize: 20,
    color: "#566193",
    fontFamily: FONTS.regular,
  },
  introduction_bottom_text: {
    position: "relative",
    textAlign: "center",
    fontSize: 16,
    top: "2.5%",
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  introduction_button: {
    position: "absolute",
    textAlign: "center",
    fontSize: 20,
    bottom: "2.5%",
    fontFamily: FONTS.regular,
  },
});

export default IntroScreen;
