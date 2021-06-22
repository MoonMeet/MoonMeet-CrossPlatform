import * as React from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { Button, Colors, TextInput } from "react-native-paper";
import AsyncStorage from '@react-native-community/async-storage'
import Modal from "react-native-modal";

const LoginScreen = () => {

  const [CountryText, CountrySetText] = React.useState("");
  const [NumberText, NumberSetText] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  let isUserAcceptedPrivacyPolicy = React.useState(false);
  const SaveUserAcceptedPrivacyPolicy = 'save_state'
  const readData = async () => {
    try {
      const getSavedPrivacyPolicyState = await AsyncStorage.getItem(SaveUserAcceptedPrivacyPolicy)

      if (getSavedPrivacyPolicyState !== null) {
        alert(getSavedPrivacyPolicyState)
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
    }
  }

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(SaveUserAcceptedPrivacyPolicy, isUserAcceptedPrivacyPolicy)
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
    }
  }

  function onCodeTextInputFocus() {
    return (
      console.log("Focused!")
    );
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
                   value={CountryText}
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
            setModalVisible(!modalVisible)
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
            console.log('send code button pressed')
          }}>
          Send Code
        </Button>
        <View style={{
          padding: 10,
          flex: 1,
        }}>
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                <Text style={{
                  color: COLORS.accent,
                  fontFamily: FONTS.regular,
                  fontSize: 20,
                  padding: 8,
                  textAlign: 'left', }}>
                  Privacy Policy :
              </Text>
                <Text style={{
                  color: Colors.black,
                  fontFamily: FONTS.regular,
                  fontSize: 18,
                  padding: 8,
                  opacity: 0.7,
                  textAlign: "left",
                }}>
                  Rayen Mark & Aziz Becha built the Moon Meet Application and Website. This SERVICE is provided by Rayen Mark & Aziz Becha at no cost and is intended for use as is.
                  This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.
                  If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that you add here are not used to anything like tracking or these stuffs. I will not use or share your information with anyone except as described in this Privacy Policy.
                  The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Moon Meet unless otherwise defined in this Privacy Policy.
                  Information Collection and Use:

                  For a better experience, while using our Service, I may require you to provide us with certain personally identifiable information, including but not limited to We only collect username, firstname, lastname, or any public information. The information that I request will be retained on your device and is not collected by me in any way.
                  The app / site does use third party services that may collect information used to identify you.
                  Reference to third party service used by the app / site are below:

                  - Firebase. Google Play Services.
                  - Log Data

                  I want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app / site when utilizing my Service, the time and date of your use of the Service, and other statistics.
                  Cookies.

                  Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
                  This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
                  Service Providers:

                  I may employ third-party companies and individuals due to the following reasons:

                  To facilitate our Service, To provide the Service on our behalf, To perform Service-related services or To assist us in analyzing how our Service is used.

                  I want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                  Security:

                  I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.
                  Children’s Privacy:

                  These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13. In a case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to take necessary actions.
                  Changes to This Privacy Policy:

                  I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.
                  This policy is effective as of 26-8-2021

                  Contact Us:

                  If you have any questions or suggestions about Moon Meet Privacy Policy, do not hesitate to contact me at Rayensbai2@gmail.com or aziz07becha@gmail.com .
                </Text>
              </ScrollView>
            <View style={{
              position: 'relative',
              marginTop: 10,
            }}>
            <Button
              style={{
                position: "relative",
                textAlign: "center",
                fontSize: 22,
                fontFamily: FONTS.regular,
              }}
              uppercase={false}
              color="#566193"
              mode="outlined"
              onPress={() => {
                setModalVisible(!modalVisible)
              }}>
              Accept Privacy Policy
            </Button>
            </View>
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
