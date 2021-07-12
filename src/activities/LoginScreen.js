import React, { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, FONTS } from "../config/Miscellaneous";
import { Button, IconButton, Menu, Provider, Snackbar, TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import CountriesList from "../modals/CountriesList";
import PrivacyPolicy from "../modals/PrivacyPolicy";
import NetInfo from "@react-native-community/netinfo";

import { useNavigation } from "@react-navigation/native";
import { isAndroid, isIOS } from "../utils/device/DeviceInfo";

const LoginScreen = () => {

  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState.isConnected
  })

  const addNetInfoObserver = () => {
    NetInfo.addEventListener(networkState => {
      console.log(networkState.details)
      console.log(networkState.type)
    });
  }

  useEffect(() => {
    addNetInfoObserver()
    setTimeout(() => {
      console.log(isConnected)
      if (isConnected) {
        getCountryCodeFromApi()
      } else {
        setErrorSnackbarText('Please enable your Mobile Data or WiFi Network to can you access Moon Meet and Login')
        onToggleErrorSnackBar()
      }
    }, 500)
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

  const isSMSSendingAcceptable = () => {
    return CountryText.length > 1 && NumberText.length > 4;
  }

  const [ErrorSnackbarText, setErrorSnackbarText] = React.useState(false)

  const [ErrorSnackBarVisible, setErrorSnackBarVisible] = React.useState(false);

  const onToggleErrorSnackBar = () => setErrorSnackBarVisible(!ErrorSnackBarVisible);

  const onDismissErrorSnackBar = () => setErrorSnackBarVisible(!ErrorSnackBarVisible);

  const getCountryCodeFromApi = () => {
    try {
      const ApiURL = "https://ipapi.co/country_calling_code"
      fetch(ApiURL).then(function(_countryDialCode) {
        return _countryDialCode.text();
      })
        .then(function(data) {
          console.warn(data);
          CountrySetText(data);
        });
    } catch (e) {
      console.error(e)
    }
  };


  const _countryCodeOnFocus = () => {
    Keyboard.dismiss()
    setCountriesVisible(!CountriesVisible)
  }

  const changeCountriesVisibility = (bool) => {
    setCountriesVisible(bool);
  };

  const changePrivacyPolicyVisibility = (bool) => {
    setPrivacyPolicyVisible(bool);
  };

  const setData = (data) => {
    CountrySetText(data);
  };

  const DotsImage = require("../assets/images/dots.png");

  return (
    <KeyboardAvoidingView
      behavior={isIOS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
                navigation.navigate("login_help");
              }} title="Help" />
            </Menu>
          </View>
          <View style={styles.top_bar}>
            <Text style={styles.top_text}>
              Enter your phone number to
              get started
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
              paddingBottom: '4%',
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
            <TextInput style={{
              width: "37%",
              padding: "1%",
            }}
                       mode="outlined"
                       keyboardType={isAndroid === "android" ? "numeric" : "number-pad"}
                       label="Country Code"
                       value={CountryText}
                       onFocus={() => {
                         _countryCodeOnFocus()
                       }}
                       multiline={false}
                       theme={{
                         colors: {
                           text: COLORS.accentLight,
                           primary: COLORS.accentLight,
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
                backgroundColor: COLORS.primaryLight,
              }}>
                <CountriesList
                  changeCountriesVisibility={changeCountriesVisibility}
                  setModalData={setData}
                />
              </SafeAreaView>
            </Modal>
            <TextInput style={{
              width: "65%",
              paddingRight: "2%",
              paddingTop: "1%",
            }}
                       mode="outlined"
                       keyboardType={isAndroid === "android" ? "numeric" : "number-pad"}
                       label="Phone Number"
                       value={NumberText}
                       onFocus={() => {
                       }}
                       placeholder={"eg, +1 (566) 874 364"}
                       multiline={false}
                       theme={{
                         colors: {
                           text: COLORS.accentLight,
                           primary: COLORS.accentLight,
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
              color: COLORS.accentLight,
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
              mode="contained"
              onPress={() => {
                Keyboard.dismiss()
                if (isConnected) {
                  if (isSMSSendingAcceptable()) {
                    //TODO: Handle Code Sending
                  } else {
                    setErrorSnackbarText('Please enter a valid Country Code and Phone Number')
                    onToggleErrorSnackBar()
                  }
                } else {
                  setErrorSnackbarText('Please enable your Mobile Data or WiFi Network to can you access Moon Meet and Login')
                  onToggleErrorSnackBar()
                }
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
          <Snackbar
            visible={ErrorSnackBarVisible}
            onDismiss={onDismissErrorSnackBar}
            duration={5000}
            action={{
              label: 'OK',
              onPress: () => {
                onDismissErrorSnackBar()
              },
            }}
            theme={{
              colors: {
                onSurface: COLORS.redLightError,
                accent: COLORS.white,
              }
            }}
            style={{
              margin: '4%',
            }}>
            {ErrorSnackbarText}
          </Snackbar>
        </SafeAreaView>
      </Provider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  top_bar: {
    flexDirection: "row",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "2%",
    paddingRight: "2%",
    justifyContent: 'center',
  },
  divider: {
    width: "-1%",
    height: "1%",
    backgroundColor: COLORS.controlHighlight,
  },
  top_text: {
    position: "relative",
    fontSize: 28,
    paddingLeft: "3%",
    paddingRight: "3%",
    textAlign: "center",
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  SendCode: {
    position: "relative",
    textAlign: "center",
    fontSize: 22,
    fontFamily: FONTS.regular,
  },
});

export default LoginScreen;
