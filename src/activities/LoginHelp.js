import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const LoginHelp = () => {

  const BackImage = require("../assets/images/back.png");
  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"}
      />
      <View style={{
        alignItems: "flex-start",
      }}>
        <IconButton icon={BackImage}
                    color={"#999999"}
                    size={24}
                    onPress={() => {
                      navigation.goBack();
                    }}
        />
      </View>
      <ScrollView nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}>
      <Text style={styles.headerText}>
        Verifying your number
      </Text>
      <Text style={styles.subText}>
        Requirements
      </Text>
        <Text style={styles.instruction}>
          - You can only verify a phone number you own.
        </Text>
        <Text style={styles.instruction}>
          - You must be able to receive SMS to the phone number you are trying to verify.
        </Text>
        <Text style={styles.instruction}>
          - You must have any SMS-blocking settings, apps or task killers disabled.
        </Text>
        <Text style={styles.instruction}>
          - You must have a working internet connection through mobile data or Wi-Fi, if you're roaming or have a bad connection, verification may not work.
        </Text>
        <Text style={styles.headerText}>
          How to verify
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  headerText: {
    color: COLORS.accent,
    fontFamily: FONTS.regular,
    fontSize: 25,
    paddingLeft: '4%',
    textAlign: "left",
  },
  subText: {
    color: COLORS.darkGrey,
    fontFamily: FONTS.regular,
    fontSize: 23,
    paddingLeft: '4%',
    textAlign: "left",
  },
  instruction: {
    color: '#000000',
    fontFamily: FONTS.regular,
    fontSize: 18,
    paddingLeft: '4%',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingRight: '1%',
    textAlign: "left",
    opacity: 0.75,
  }
});
export default LoginHelp;
