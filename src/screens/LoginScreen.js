/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect, useRef, useMemo} from 'react';
import {BackHandler, Image, Keyboard, StyleSheet, View} from 'react-native';
import {
  Button,
  FAB,
  IconButton,
  Menu,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

import {
  useFocusEffect,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';

import {isAndroid} from '../utils/device/DeviceInfo';
import auth from '@react-native-firebase/auth';
import CountriesList from '../components/Modals/LoginScreen/CountriesList';
import {COLORS, FONTS} from '../config/Miscellaneous';
import OTPTextView from '../components/OtpView/OTPTextInput';
import firestore from '@react-native-firebase/firestore';
import LoginHelp from '../components/Modals/LoginScreen/LoginHelp';
import BaseView from '../components/BaseView/BaseView';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import TermsConditions from '../components/Modals/TermsConditions/TermsConditions';

import DeviceInfo from 'react-native-device-info';

import ArrowForward from '../assets/images/arrow-forward.png';
import DotsImage from '../assets/images/dots.png';
import WelcomeImage from '../assets/images/welcome.png';

import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {getRandomInt} from '../utils/generators/getRandomNumber';
import {JwtKeyMMKV} from '../config/MMKV/JwtKeyMMKV';
import {ErrorToast} from '../components/ToastInitializer/ToastInitializer';
import {UserDataMMKV} from '../config/MMKV/UserDataMMKV';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import axios from 'axios';
import {waitForAnd} from '../utils/timers/delay';
import {getRandomString} from '../utils/generators/getRandomString';
import {EncryptAES} from '../utils/crypto/cryptoTools';
import OneSignal from 'react-native-onesignal';

const LoginScreen = () => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const [MoonMeetUser, setMoonMeetUser] = React.useState();

  function onAuthStateChanged(user) {
    if (user) {
      setMoonMeetUser(user);
      setCodeCorrect(true);
    }
  }

  const [pushToken, setPushToken] = React.useState();
  const [userId, setUserId] = React.useState();
  const [isSubscribed, setSubscribed] = React.useState();

  const initializeDevice = useCallback(async () => {
    try {
      const deviceState = await OneSignal.getDeviceState();
      setPushToken(deviceState?.pushToken);
      setUserId(deviceState?.userId);
      setSubscribed(deviceState?.isSubscribed);
      if (__DEV__) {
        console.log(pushToken, isSubscribed, userId);
      }
    } catch (e) {
      if (__DEV__) {
        console.error('OneSignal: ', e);
      }
    }
  }, [isSubscribed, pushToken, userId]);

  async function updateOneSignalValues() {
    firestore()?.collection('users')?.doc(auth()?.currentUser?.uid)?.update({
      pushToken: pushToken,
      OneSignalID: userId,
    });
  }

  useEffect(() => {
    initializeDevice();
    return () => {
      initializeDevice();
    };
  }, [initializeDevice]);

  useEffect(() => {
    const authStateChanges = auth()?.onAuthStateChanged(onAuthStateChanged);
    return () => {
      if (authStateChanges) {
        authStateChanges();
      }
    };
  }, []);

  useEffect(() => {
    const netEventListener = NetInfo?.addEventListener(listenerState => {
      if (listenerState?.isConnected) {
        getCountryCodeFromApi();
      } else {
        setErrorSnackbarText(
          'Please enable your Mobile Data or WiFi Network to can you access Moon Meet and Login',
        );
        setErrorSnackBarVisible(true);
      }
    });
    return netEventListener;
  }, []);

  const navigation = useNavigation();

  const [CountryText, CountrySetText] = React.useState('+');

  const [NumberText, NumberSetText] = React.useState('');

  const [MenuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  // Bottom Sheet Refs

  const helpRef = useRef(null);
  const termsRef = useRef(null);
  const countriesRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['50%', '100%'], []);

  const {dismissAll} = useBottomSheetModal();

  const [codeCorrect, setCodeCorrect] = React.useState(null);

  // Bottom Sheet Callbacks

  const handlePresentHelpModal = useCallback(() => {
    Keyboard.dismiss();
    dismissAll();
    helpRef?.current?.present();
  }, [dismissAll]);

  const handlePresentTCModal = useCallback(() => {
    Keyboard.dismiss();
    dismissAll();
    termsRef?.current?.present();
  }, [dismissAll]);

  const handlePresentCountriesModal = useCallback(() => {
    Keyboard.dismiss();
    dismissAll();
    countriesRef?.current?.present();
  }, [dismissAll]);

  /**
   * allow SMS sending if country code and number is probably real
   * @returns {boolean}
   */

  const isSMSSendingAcceptable = () => {
    return CountryText?.trim()?.length > 1 && NumberText?.trim()?.length > 4;
  };

  const phoneRef = useRef();

  const [ConfirmCode, setConfirmCode] = React.useState(null);

  /**
   * Loader stuff
   */
  const [LoaderVisible, setLoaderVisible] = React.useState(false);

  /**
   * function to send code to specific phone number.
   * @param {NaN, String} phoneNumber
   * @returns {Promise<void>}
   */

  async function signInWithPhoneNumber(phoneNumber) {
    try {
      setLoaderVisible(true);
      const signInResult = await auth()?.signInWithPhoneNumber(phoneNumber);
      setConfirmCode(signInResult);
      setLoaderVisible(false);
    } catch (error) {
      setLoaderVisible(false);
      if (error?.code === 'auth/invalid-phone-number') {
        ErrorToast(
          'bottom',
          'Invalid phone number',
          'please check your phone number again',
          true,
          1500,
        );
      } else {
        ErrorToast(
          'bottom',
          'Unexpected error occured',
          `${error?.message}`,
          true,
          1500,
        );
      }
    }
  }

  /**
   * SnackBar Stuff
   */

  const [mBottomMargin, setBottomMargin] = React.useState(0);

  const [ErrorSnackbarText, setErrorSnackbarText] = React.useState('');

  const [ErrorSnackBarVisible, setErrorSnackBarVisible] = React.useState(false);

  const onToggleErrorSnackBar = useCallback(() => {
    setErrorSnackBarVisible(!ErrorSnackBarVisible);
  }, [ErrorSnackBarVisible]);

  const onDismissErrorSnackBar = () => {
    setBottomMargin(0);
    setErrorSnackBarVisible(!ErrorSnackBarVisible);
  };

  /**
   * get dial code from internet API
   * @return {NaN, String} data to {CountryText}
   */
  const getCountryCodeFromApi = () => {
    const ApiURL = 'https://ipapi.co/country_calling_code';
    axios
      .get(ApiURL, {method: 'get'})
      .then(element => {
        if (element?.data?.includes('error')) {
          CountrySetText('+1');
        } else {
          CountrySetText(element?.data);
        }
      })
      .catch(error => {
        if (__DEV__) {
          console.error(error);
        }
        CountrySetText(+1);
      });
  };

  const countryInputOnFocus = () => {
    Keyboard.dismiss();
    dismissAll();
    handlePresentCountriesModal();
  };

  async function addCodeObserver(text) {
    if (text?.length > 5) {
      try {
        Keyboard?.dismiss();
        setLoaderVisible(true);
        await ConfirmCode?.confirm(text);
        setLoaderVisible(false);
      } catch (error) {
        setLoaderVisible(false);
        if (error !== null) {
          if (error.code === 'auth/invalid-verification-code') {
            setCodeCorrect(false);
            ErrorToast(
              'bottom',
              'Invalid code',
              'Please check the code again',
              true,
              2000,
            );
            waitForAnd(2000).then(() => setCodeCorrect(null));
          } else {
            ErrorToast(
              'bottom',
              'Unexpected error occured',
              `${error}`,
              true,
              2000,
            );
          }
          // }
        }
      }
    }
  }

  /**
   * What a bottom sheet, you need to close it to times to dismiss lol
   * @param {NaN, String} data
   */

  const setCountryCodeData = data => {
    CountrySetText(data);
    waitForAnd(0).then(() => dismissAll());
  };

  /**
   * Clean up NumberText
   * @param {NaN, String} text
   */
  const onNumberTextChange = text => {
    /**
     * Regex for removing crap characters in NumberText
     * @type {RegExp}
     * @private
     */
    const allowedCharactersRegex = /[^0-9]/g;
    NumberSetText(text?.replace(allowedCharactersRegex, ''));
  };

  if (MoonMeetUser) {
    return (
      <>
        <MiniBaseView>
          <View
            style={{
              flex: 1,
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                height: 225 - 0.1 * 225,
                width: 225 - 0.1 * 225,
                bottom: heightPercentageToDP(2.5),
              }}
              source={WelcomeImage}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                fontSize: fontValue(20),
                fontFamily: FONTS.regular,
                color: COLORS.accentLight,
                opacity: 0.9,
              }}>
              {auth()?.currentUser?.displayName
                ? `Welcome back, ${auth()?.currentUser?.displayName}`
                : 'The moon is shining'}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                fontSize: fontValue(16),
                fontFamily: FONTS.regular,
                color: COLORS.black,
                marginTop: 4,
                opacity: 0.6,
              }}>
              {auth()?.currentUser?.displayName
                ? "The moon can't shine without you."
                : 'Thank you for joining.'}
            </Text>
          </View>
          <Button
            mode="outlined"
            style={{
              fontFamily: FONTS.regular,
              bottom: '2%',
              textAlign: 'center',
              alignSelf: 'center',
            }}
            color={COLORS.accentLight}
            uppercase={false}
            hitSlop={20}
            onPress={() => {
              setLoaderVisible(true);
              firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .get()
                .then(async documentSnapshot => {
                  if (documentSnapshot?.exists) {
                    if (documentSnapshot?.data()?.uid) {
                      JwtKeyMMKV.set(
                        'currentUserJwtKey',
                        documentSnapshot?.data()?.jwtKey,
                      );

                      /**
                       * Used for getting Device Information.
                       */

                      let Manufacturer = await DeviceInfo?.getManufacturer();
                      let Product = await DeviceInfo?.getProduct();
                      let systemName = DeviceInfo.getSystemName();
                      let systemVersion = DeviceInfo.getSystemVersion();
                      let Model = DeviceInfo.getModel();
                      let appVersion = DeviceInfo.getVersion();
                      /**
                       * Pushing device information.
                       */
                      await firestore()
                        .collection('users')
                        .doc(auth()?.currentUser?.uid)
                        .collection('devices')
                        .add({
                          manufacturer: Manufacturer,
                          system_name: systemName,
                          system_version: systemVersion,
                          product: Product,
                          model: Model,
                          app_version: appVersion,
                          time: firestore?.Timestamp?.fromDate(new Date()),
                        });

                      /**
                       * Saving data to to UserDataMMKV preference.
                       */

                      UserDataMMKV?.set(
                        'Me',
                        JSON?.stringify(documentSnapshot?.data()),
                      );

                      // Due to OneSignal limitations, pushToken and UserID may change sometimes.

                      if (userId && pushToken) {
                        updateOneSignalValues();
                      }

                      navigation?.navigate('home');
                    }
                  } else {
                    const generatedUsername = auth()
                      ?.currentUser?.uid?.substring(0, 4)
                      .concat(getRandomInt(10000, 99999))
                      ?.concat(getRandomString(5));
                    navigation?.navigate('setup', {
                      user: {
                        uid: auth()?.currentUser?.uid,
                        username: generatedUsername,
                        phone: EncryptAES(NumberText),
                        phone_number: EncryptAES(
                          CountryText + ' ' + NumberText,
                        ),
                        phone_status: 'none',
                        country_code: EncryptAES(CountryText),
                        pushToken: pushToken,
                        OneSignalID: userId,
                      },
                    });
                  }
                });
              setLoaderVisible(false);
            }}>
            {auth()?.currentUser?.displayName
              ? "Let's go to your account"
              : "Let's setup your profile"}
          </Button>
        </MiniBaseView>
        <LoadingIndicator isVisible={LoaderVisible} />
      </>
    );
  } else {
    return (
      //////////////////////////// FIRST PART ////////////////////////////
      <>
        <BaseView>
          <View style={{flex: 1}}>
            <View style={{alignItems: 'flex-end'}}>
              <Menu
                visible={MenuVisible}
                onDismiss={closeMenu}
                anchor={
                  <IconButton
                    icon={DotsImage}
                    color={'#999999'}
                    size={24}
                    onPress={() => {
                      openMenu();
                    }}
                  />
                }>
                <Menu.Item
                  onPress={() => {
                    dismissAll();
                    handlePresentHelpModal();
                  }}
                  title="Help"
                />
              </Menu>
            </View>
            {!ConfirmCode ? (
              <MiniBaseView>
                <View style={styles.top_bar}>
                  <Text style={styles.top_text}>
                    Enter your phone number to get started
                  </Text>
                </View>
                <View
                  style={{
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: fontValue(16),
                      textAlign: 'center',
                      paddingBottom: '4%',
                      opacity: 0.4,
                      fontFamily: FONTS.regular,
                    }}>
                    {`You will receive a verification code, Carrier rates ${'\n'} may apply.`}
                  </Text>
                </View>
                <View
                  style={{
                    padding: '2%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    style={{
                      width: '36%',
                    }}
                    mode="outlined"
                    keyboardType={isAndroid ? 'numeric' : 'number-pad'}
                    label="Country Code"
                    value={CountryText}
                    maxLength={5}
                    onFocus={() => {
                      countryInputOnFocus();
                    }}
                    multiline={false}
                    theme={{
                      colors: {
                        text: COLORS.accentLight,
                        primary: COLORS.accentLight,
                        backgroundColor: COLORS.rippleColor,
                        placeholder: COLORS.darkGrey,
                        underlineColor: '#566193',
                        selectionColor: '#DADADA',
                        outlineColor: '#566193',
                      },
                    }}
                    onChangeText={text => {
                      CountrySetText(text);
                    }}
                  />
                  <TextInput
                    style={{
                      width: '62%',
                      paddingRight: '2%',
                    }}
                    mode="outlined"
                    keyboardType={isAndroid ? 'numeric' : 'number-pad'}
                    label="Phone Number"
                    value={NumberText}
                    placeholder={'eg, (123) 456 7890'}
                    maxLength={12}
                    multiline={false}
                    theme={{
                      colors: {
                        text: COLORS.accentLight,
                        primary: COLORS.accentLight,
                        backgroundColor: COLORS.rippleColor,
                        placeholder: COLORS.darkGrey,
                        underlineColor: '#566193',
                        selectionColor: '#DADADA',
                        outlineColor: '#566193',
                      },
                    }}
                    onChangeText={_NumberText => {
                      onNumberTextChange(_NumberText);
                    }}
                  />
                </View>
                <View
                  style={{
                    paddingLeft: '4%',
                    paddingRight: '2%',
                    position: 'relative',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: fontValue(16),
                      opacity: 0.4,
                      fontFamily: FONTS.regular,
                    }}>
                    By signing up.
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    position: 'relative',
                    paddingLeft: '4%',
                    paddingRight: '2%',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: fontValue(16),
                      opacity: 0.4,
                      fontFamily: FONTS.regular,
                    }}>
                    {'You agree to the '}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.accentLight,
                      fontSize: fontValue(15.5),
                      fontFamily: FONTS.regular,
                    }}
                    onPress={() => {
                      dismissAll();
                      handlePresentTCModal();
                    }}>
                    {'Terms & Conditions'}
                  </Text>
                </View>
                <Snackbar
                  visible={ErrorSnackBarVisible}
                  onDismiss={onDismissErrorSnackBar}
                  duration={3000}
                  action={{
                    label: 'OK',
                    onPress: () => {
                      onDismissErrorSnackBar();
                    },
                  }}
                  theme={{
                    colors: {
                      onSurface: COLORS.redLightError,
                      accent: COLORS.white,
                    },
                  }}
                  style={{
                    margin: '4%',
                  }}>
                  {ErrorSnackbarText}
                </Snackbar>
                <FAB
                  style={styles.fab(mBottomMargin)}
                  normal
                  icon={ArrowForward}
                  color={COLORS.primaryLight}
                  animated={true}
                  theme={{
                    colors: {
                      accent: COLORS.accentLight,
                    },
                  }}
                  onPress={async () => {
                    Keyboard.dismiss();
                    const isConnected = await NetInfo?.fetch();
                    if (isConnected.isConnected) {
                      if (isSMSSendingAcceptable()) {
                        signInWithPhoneNumber(CountryText + NumberText);
                      } else {
                        setBottomMargin(heightPercentageToDP(7.5));
                        setErrorSnackbarText(
                          'Please enter a valid Country Code and Phone Number',
                        );
                        onToggleErrorSnackBar();
                      }
                    } else {
                      setBottomMargin(heightPercentageToDP(7.5));
                      setErrorSnackbarText(
                        'Please enable your Mobile Data or WiFi Network to can you access Moon Meet and Login',
                      );
                      onToggleErrorSnackBar();
                    }
                  }}
                />
              </MiniBaseView>
            ) : (
              //////////////////////////// SECOND PART ////////////////////////////
              /**
               * Render ConfirmScreen when user is in ConfirmCode mode.
               */
              <MiniBaseView style={styles.container}>
                <View style={styles.top_bar}>
                  <Text style={styles.top_text}>
                    {`Enter the code that we sent ${'\n'} to ${CountryText} ${NumberText}`}
                  </Text>
                </View>
                <View style={styles.centredView}>
                  <OTPTextView
                    inputCount={6}
                    ref={phoneRef}
                    tintColor={
                      codeCorrect === true
                        ? COLORS.green
                        : codeCorrect === false
                        ? COLORS.redLightError
                        : COLORS.accentLight
                    }
                    offTintColor={
                      codeCorrect
                        ? COLORS.green
                        : codeCorrect === false
                        ? COLORS.redLightError
                        : COLORS.controlHighlight
                    }
                    containerStyle={styles.TextInputContainer}
                    textInputStyle={styles.RoundedTextInput}
                    handleTextChange={text => {
                      addCodeObserver(text);
                    }}
                    editable={!codeCorrect === true}
                    keyboardType={isAndroid ? 'numeric' : 'number-pad'}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: '3%',
                    paddingBottom: '3%',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: fontValue(14),
                        color: COLORS.black,
                        opacity: 0.6,
                        textAlign: 'left',
                        fontFamily: FONTS.regular,
                      }}
                      onPress={() => {
                        navigation?.dispatch(
                          CommonActions?.reset({
                            index: 0,
                            routes: [{name: 'login'}],
                          }),
                        );
                      }}>
                      WRONG NUMBER
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: fontValue(14),
                      color: COLORS.black,
                      opacity: 0.6,
                      textAlign: 'right',
                      fontFamily: FONTS.regular,
                    }}
                    onPress={() => {
                      phoneRef?.current?.clear();
                    }}>
                    CLEAR CODE
                  </Text>
                </View>
              </MiniBaseView>
            )}
          </View>
        </BaseView>
        <TermsConditions
          sheetRef={termsRef}
          index={0}
          snapPoints={sheetSnapPoints}
        />
        <CountriesList
          sheetRef={countriesRef}
          index={0}
          snapPoints={sheetSnapPoints}
          sharedData={setCountryCodeData}
        />
        <LoginHelp sheetRef={helpRef} index={0} snapPoints={sheetSnapPoints} />
        <LoadingIndicator isVisible={LoaderVisible} />
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  top_bar: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'center',
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(28),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  TextInputContainer: {
    marginRight: heightPercentageToDP(8),
    marginLeft: heightPercentageToDP(8),
  },
  RoundedTextInput: {
    borderRadius: heightPercentageToDP(1),
    borderWidth: 2,
  },
  centredView: {
    paddingLeft: '2%',
    paddingRight: '2%',
    alignSelf: 'center',
  },
  fab: bottomMargin => {
    return {
      position: 'absolute',
      margin: 16 - 0.1 * 16,
      right: 0,
      bottom: bottomMargin,
    };
  },
});
export default LoginScreen;
