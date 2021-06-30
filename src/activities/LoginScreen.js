import * as React from "react";
import { Keyboard, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { Button, TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import CountriesList from "../modals/CountriesList";
import PrivacyPolicy from "../modals/PrivacyPolicy";

const LoginScreen = () => {
  const [CountryText, CountrySetText] = React.useState("+");
  const [NumberText, NumberSetText] = React.useState("");
  const [PrivacyPolicyVisible, setPrivacyPolicyVisible] = React.useState(false);
  const [CountriesVisible, setCountriesVisible] = React.useState(false);
  const UserSelectedCountry = React.useState("+");
  const [chooseData, setChooseData] = React.useState();

  const changeCountriesVisibility = (bool) => {
    setCountriesVisible(bool);
  };

  function onCodeTextInputFocus() {
    Keyboard.dismiss();
    setCountriesVisible(!CountriesVisible);
  }

  const setData = (data) => {
    setChooseData(data);
  };

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
        paddingLeft: 8,
        paddingRight: 8,
      }}>
        <Text style={{
          color: COLORS.accent,
          fontSize: 18,
          textAlign: "center",
          fontFamily: FONTS.regular,
        }}>
          Please enter your mobile number to receive a verification code. Carrier rates may apply.
        </Text>
      </View>
      <View style={{
        padding: 8,
        flexDirection: "row",
      }}>
        <TextInput style={{
          width: "37%",
          padding: 4,
        }}
                   mode="outlined"
                   keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
                   label="Country Code"
                   value={chooseData || "+"}
                   onFocus={() => onCodeTextInputFocus()}
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
        <Modal
          style={{
            margin: "5%",
          }}
          animationType={"slide"}
          transparent={false}
          visible={CountriesVisible}
          onRequestClose={() => {
            changeCountriesVisibility(!CountriesVisible);
          }}>
          <SafeAreaView style={{
            flex: 1,
            backgroundColor: COLORS.primary,
          }}>
            <CountriesList
              changeCountriesVisibility={changeCountriesVisibility}
              setModalData={setData}
            />
          </SafeAreaView>
        </Modal>
        <TextInput style={{
          width: "65%",
          paddingRight: 8,
          paddingTop: 4,
        }}
                   mode="outlined"
                   keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
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
        paddingLeft: 16,
        paddingRight: 8,
        position: "relative",
      }}>
        <Text
          onPress={() => {
            setPrivacyPolicyVisible(!PrivacyPolicyVisible);
          }}
          style={{
            color: COLORS.accent,
            fontSize: 18,
            fontFamily: FONTS.regular,
          }}>
          Click to read our Privacy Policy.
        </Text>
      </View>
      <View style={{
        paddingTop: 12,
        paddingLeft: 8,
        paddingRight: 8,
        position: "relative",
      }}>
        <Button
          style={styles.SendCode}
          uppercase={false}
          color="#566193"
          mode="outlined"
          onPress={() => {
            console.log("send code button pressed");
          }}>
          Send Code
        </Button>
        <View style={{
          padding: 10,
          flex: 1,
        }}>
          <Modal
            style={{
              margin: "4%",
            }}
            animationType={"slide"}
            transparent={false}
            visible={PrivacyPolicyVisible}
            onRequestClose={() => {
              setPrivacyPolicyVisible(!PrivacyPolicyVisible);
            }}>
            <PrivacyPolicy />
          </Modal>
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
  dummy: {
    height: 30,
    width: -1,
  },
  SendCode: {
    position: "relative",
    textAlign: "center",
    fontSize: 22,
    fontFamily: FONTS.regular,
  },
});

export default LoginScreen;
