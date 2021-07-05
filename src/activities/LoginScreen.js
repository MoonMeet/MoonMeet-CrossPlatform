import React, { useEffect } from "react";
import { Keyboard, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { Button, IconButton, Menu, Provider, TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import CountriesList from "../modals/CountriesList";
import PrivacyPolicy from "../modals/PrivacyPolicy";

import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {

  useEffect(() => {
    getCountryNameFromApiAsync();
    return () => {

    };
  }, []);

  const navigation = useNavigation();

  const [CountryText, CountrySetText] = React.useState("+");
  const [NumberText, NumberSetText] = React.useState("");
  const [PrivacyPolicyVisible, setPrivacyPolicyVisible] = React.useState(false);
  const [CountriesVisible, setCountriesVisible] = React.useState(false);

  const [MenuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const [chooseData, setChooseData] = React.useState();

  const getCountryNameFromApiAsync = () => {
    try {
      let response = fetch(
        "https://ipapi.co/country_calling_code",
      );
      setChooseData(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const changeCountriesVisibility = (bool) => {
    setCountriesVisible(bool);
  };

  const changePrivacyPolicyVisibility = (bool) => {
    setPrivacyPolicyVisible(bool);
  };


  function onCodeTextInputFocus() {
    Keyboard.dismiss();
    setCountriesVisible(!CountriesVisible);
  }

  const setData = (data) => {
    setChooseData(data);
  };

  const DotsImage = require("../assets/images/dots.png");

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle={"dark-content"} />
        <View style={{
          alignItems: "flex-end",
        }}>
          <Menu
            visible={MenuVisible}
            onDismiss={closeMenu}
            anchor={<IconButton icon={DotsImage}
                                color={"#999999"}
                                size={24}
                                onPress={() => {
                                  openMenu();
                                }} />
            }>
            <Menu.Item onPress={() => {
              console.log(getCountryNameFromApiAsync());
              navigation.navigate("login_help");
            }} title="Help" />
          </Menu>
        </View>
        <View style={styles.dummy} />
        <View style={styles.top_bar}>
          <Text style={styles.top_text}>
            Enter your phone number
            to get started
          </Text>
        </View>
        <View style={{
          paddingLeft: "2%",
          paddingRight: "2%",
        }}>
          <Text style={{
            color: COLORS.darkGrey,
            fontSize: 16,
            textAlign: "center",
            fontFamily: FONTS.regular,
          }}>
            You will receive a verification code, Carrier rates may apply.
          </Text>
        </View>
        <View style={{
          padding: "2%",
          flexDirection: "row",
          justifyContent: "center",
        }}>
          <Text style={{
            padding: "2%",
            fontSize: 24,
            fontFamily: FONTS.regular,
          }}>+</Text>
          <TextInput style={{
            width: "37%",
            padding: "1%",
          }}
                     mode="outlined"
                     keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
                     label="Country Code"
                     value={chooseData}
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
            width: "57%",
            paddingRight: "2%",
            paddingTop: "1%",
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
          paddingLeft: "4%",
          paddingRight: "2%",
          position: "relative",
        }}>
          <Text
            style={{
              color: COLORS.darkGrey,
              fontSize: 18,
              fontFamily: FONTS.regular,
            }}>
            By signing up.
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          position: "relative",
          paddingLeft: "4%",
          paddingRight: "2%",
        }}>
          <Text style={{
            color: COLORS.darkGrey,
            fontSize: 18,
            fontFamily: FONTS.regular,
          }}>You agree to the</Text>
          <Text style={{
            color: COLORS.accent,
            fontSize: 18,
            fontFamily: FONTS.regular,
          }}
                onPress={() => setPrivacyPolicyVisible(!PrivacyPolicyVisible)}> Terms of Service</Text>
        </View>
        <View style={{
          paddingTop: "4%",
          paddingLeft: "3%",
          paddingRight: "3%",
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
            padding: "3%",
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
              <PrivacyPolicy
                changePrivacyPolicyVisibility={changePrivacyPolicyVisibility}
              />
            </Modal>
          </View>
        </View>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  top_bar: {
    flexDirection: "row",
    padding: "3%",
  },
  divider: {
    width: "-1%",
    height: "1%",
    backgroundColor: COLORS.controlHighlight,
  },
  top_text: {
    position: "relative",
    fontSize: 26,
    textAlign: "center",
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  dummy: {
    height: "1%",
    width: "-1%",
  },
  SendCode: {
    position: "relative",
    textAlign: "center",
    fontSize: 22,
    fontFamily: FONTS.regular,
  },
});

export default LoginScreen;
