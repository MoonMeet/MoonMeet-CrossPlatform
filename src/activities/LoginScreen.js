import React, {useCallback, useEffect, useRef} from 'react';
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Button,
  FAB,
  IconButton,
  Menu,
  Provider,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {isAndroid, isIOS, isWeb, isWindows} from '../utils/device/DeviceInfo';

import auth from '@react-native-firebase/auth';
import CountriesList from '../components/Modals/LoginScreen/CountriesList';
import PrivacyPolicy from '../components/Modals/PrivacyPolicy/PrivacyPolicy';
import {COLORS, FONTS} from '../config/Miscellaneous';
import OTPTextView from '../components/OtpView/OTPTextInput';
import database from '@react-native-firebase/database';
import LoginHelp from '../components/Modals/LoginScreen/LoginHelp';
import ArrowForward from '../assets/images/arrow-forward.png';
import BaseView from '../components/BaseView/BaseView';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getManufacturer,
  getModel,
  getProduct,
  getSystemName,
  getSystemVersion,
  getVersion,
} from 'react-native-device-info';

const LoginScreen = () => {
  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   * @type {Promise<NetInfoState>}
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState.isConnected;
  });

  /**
   * Dummy NetInfoObserver
   */

  const addNetInfoObserver = () => {
    NetInfo.addEventListener(networkState => {
      console.info(networkState.details);
      console.info(networkState.type);
    });
  };

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

  useEffect(() => {
    addNetInfoObserver();
    const currentSubscriber = auth().onAuthStateChanged(onAuthStateChanged);
    const LoginScreenTimerTask = setTimeout(() => {
      if (isConnected) {
        getCountryCodeFromApi();
      } else {
        setErrorSnackbarText(
          'Please enable your Mobile Data or WiFi Network to can you access Moon Meet and Login',
        );
        onToggleErrorSnackBar();
      }
    }, 500);
    return () => {
      currentSubscriber();
      clearTimeout(LoginScreenTimerTask);
    };
  }, []);

  const navigation = useNavigation();

  const [CountryText, CountrySetText] = React.useState('+');

  const [NumberText, NumberSetText] = React.useState('');

  const [PrivacyPolicyVisible, setPrivacyPolicyVisible] = React.useState(false);

  const [CountriesVisible, setCountriesVisible] = React.useState(false);

  const [MenuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  /**
   * allow SMS sending if country code and number is probably real
   * @returns {boolean}
   */

  const isSMSSendingAcceptable = () => {
    return CountryText.length > 1 && NumberText.length > 4;
  };

  /**
   * Firebase Phone Auth Stuff
   */

  function onAuthStateChanged(currentUser) {
    setMoonMeetUser(currentUser);
  }
  const phoneRef = useRef();

  const [MoonMeetUser, setMoonMeetUser] = React.useState();

  const [ConfirmCode, setConfirmCode] = React.useState(null);

  /**
   * LoginHelp stuff :PensiveFast:
   */
  const [isLoginHelpVisible, setLoginHelpVisible] = React.useState(false);

  /**
   * Loader stuff
   */
  const [LoaderVisible, setLoaderVisible] = React.useState(false);
  const [isFABLoading, setFABLoading] = React.useState(false);

  /**
   * function to send code to specific phone number.
   * @param {NaN, String} phoneNumber
   * @returns {Promise<void>}
   */

  async function signInWithPhoneNumber(phoneNumber) {
    const _sendCode = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirmCode(_sendCode);
    setLoaderVisible(!LoaderVisible);
  }

  /**
   * void to confirm code, else we handle an Exception.
   * @returns {Promise<void>}
   */

  async function confirmCode(text) {
    try {
      await ConfirmCode.confirm(text);
    } catch (error) {
      if (isFABLoading) {
        setFABLoading(!isFABLoading);
      }
      if (error !== null) {
        if (error.code === 'auth/invalid-verification-code') {
          console.log('Invalid code.');
        } else {
          console.log('Account linking error');
          console.log(error.toString());
        }
      }
    }
  }

  /**
   * SnackBar Stuff
   */

  const [ErrorSnackbarText, setErrorSnackbarText] = React.useState(false);

  const [ErrorSnackBarVisible, setErrorSnackBarVisible] = React.useState(false);

  const onToggleErrorSnackBar = () =>
    setErrorSnackBarVisible(!ErrorSnackBarVisible);

  const onDismissErrorSnackBar = () =>
    setErrorSnackBarVisible(!ErrorSnackBarVisible);

  /**
   * get Country code from internet API
   * @return {NaN, String} data to {CountryText}
   */
  const getCountryCodeFromApi = async () => {
    try {
      const ApiURL = 'https://ipapi.co/country_calling_code';
      await fetch(ApiURL)
        .then(function (_countryDialCode) {
          return _countryDialCode.text();
        })
        .then(function (data) {
          if (data?.includes('error')) {
            CountrySetText('+1');
          } else {
            CountrySetText(data);
          }
        });
    } catch (e) {
      console.error(e);
      CountrySetText(+1);
    }
  };

  const _countryCodeOnFocus = () => {
    Keyboard.dismiss();
    setCountriesVisible(!CountriesVisible);
  };

  /**
   * Loader stuff
   */

  const [LoaderText, setLoaderText] = React.useState('');

  /**
   * this function is amazing, it gives you a drink
   * @param min
   * @param max
   * @return {*}
   */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Used for getting Device Information, useful for DeviceScreen.js
   */

  const [systemName, setSystemName] = React.useState(getSystemName());
  const [systemVersion, setSystemVersion] = React.useState(getSystemVersion());
  const [Manufacturer, setManufacturer] = React.useState(
    getManufacturer().then(manufacturer => {
      setManufacturer(manufacturer);
    }),
  );
  const [Product, setProduct] = React.useState(
    getProduct().then(product => {
      setProduct(product);
    }),
  );
  const [Model, setModel] = React.useState(getModel());
  const [appVersion, setAppVersion] = React.useState(getVersion());

  function addCodeObserver(text) {
    if (text.length > 5) {
      Keyboard.dismiss();
      confirmCode(text).then(() => {
        if (auth().currentUser != null) {
          database()
            .ref(`/users/${auth().currentUser.uid}`)
            .once('value')
            .then(snapshot => {
              if (snapshot?.val()?.uid && snapshot?.val().jwtKey) {
                AsyncStorage.setItem(
                  'currentUserJwtKey',
                  snapshot?.val().jwtKey,
                ).then(() => {
                  AsyncStorage.getItem('currentUserJwtKey').then(val => {
                    /**
                     * pushing device information for later use in DeviceScreen.js
                     */
                    if (!isWindows && !isWeb) {
                      const referenceKey = database()
                        .ref(`/devices/${auth()?.currentUser.uid}`)
                        .push().key;

                      database()
                        .ref(
                          `/devices/${auth()?.currentUser.uid}/${referenceKey}`,
                        )
                        .set({
                          manufacturer: Manufacturer,
                          system_name: systemName,
                          system_version: systemVersion,
                          product: Product,
                          model: Model,
                          app_version: appVersion,
                          time: Date.now(),
                        })
                        .catch(error => {
                          console.error(error);
                        });
                    }
                    navigation.navigate('home');
                  });
                });
              } else {
                const _username = auth()
                  .currentUser.uid.substring(0, 4)
                  .concat(getRandomInt(100000, 999999));
                navigation.navigate('setup', {
                  user: {
                    uid: auth().currentUser.uid,
                    username: _username,
                    phone: NumberText,
                    phone_number: CountryText + ' ' + NumberText,
                    phone_status: 'none',
                    country_code: CountryText,
                  },
                });
              }
            });
        } else {
          if (isFABLoading) {
            setFABLoading(!isFABLoading);
          }
          console.log('our user is null');
        }
      });
    }
  }

  /**
   *
   * @param {NaN, String} data
   */

  const setData = data => {
    CountrySetText(data);
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
    let _regexNumberOnly = /[^0-9]/g;
    NumberSetText(text.replace(_regexNumberOnly, ''));
  };

  const DotsImage = require('../assets/images/dots.png');

  return (
    //////////////////////////// FIRST PART ////////////////////////////
    <BaseView>
      <Provider>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
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
                setLoginHelpVisible(!isLoginHelpVisible);
              }}
              title="Help"
            />
          </Menu>
        </View>
        {!ConfirmCode ? (
          <MiniBaseView>
            <View style={styles.top_bar}>
              <Text style={styles.top_text}>
                Enter your phone number
                to get started
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
                  fontSize: 16,
                  textAlign: 'center',
                  paddingBottom: '4%',
                  opacity: 0.4,
                  fontFamily: FONTS.regular,
                }}>
                You will receive a verification code, Carrier rates may apply.
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
                onFocus={() => {
                  _countryCodeOnFocus();
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
                onChangeText={_CountryText => {
                  CountrySetText(_CountryText);
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
                onFocus={() => {}}
                placeholder={'eg, +1 (566) 874 364'}
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
                  fontSize: 18,
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
                  fontSize: 18,
                  opacity: 0.4,
                  fontFamily: FONTS.regular,
                }}>
                You agree to the{' '}
              </Text>
              <Text
                style={{
                  color: COLORS.accentLight,
                  fontSize: 18,
                  fontFamily: FONTS.regular,
                }}
                onPress={() => setPrivacyPolicyVisible(!PrivacyPolicyVisible)}>
                Terms of Service
              </Text>
            </View>
            <Snackbar
              visible={ErrorSnackBarVisible}
              onDismiss={onDismissErrorSnackBar}
              duration={5000}
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
              style={styles.fab}
              normal
              icon={ArrowForward}
              color={COLORS.primaryLight}
              animated={true}
              loading={isFABLoading}
              theme={{
                colors: {
                  accent: COLORS.accentLight,
                },
              }}
              onPress={() => {
                try {
                  Keyboard.dismiss();
                  if (isConnected) {
                    if (isSMSSendingAcceptable()) {
                      setLoaderText('Loading');
                      setLoaderVisible(!LoaderVisible);
                      setFABLoading(!isFABLoading);
                      signInWithPhoneNumber(CountryText + NumberText).catch(
                        () => {
                          setLoaderVisible(false);
                        },
                      );
                    } else {
                      setErrorSnackbarText(
                        'Please enter a valid Country Code and Phone Number',
                      );
                      onToggleErrorSnackBar();
                    }
                  } else {
                    setErrorSnackbarText(
                      'Please enable your Mobile Data or WiFi Network to can you access Moon Meet and Login',
                    );
                    onToggleErrorSnackBar();
                  }
                } catch (e) {
                  console.log(e.toString());
                  setFABLoading(!isFABLoading);
                }
              }}
            />
            <PrivacyPolicy
              hideModal={() => {
                setPrivacyPolicyVisible(!PrivacyPolicyVisible);
              }}
              isVisible={PrivacyPolicyVisible}
            />
            <CountriesList
              isVisible={CountriesVisible}
              hideModal={() => {
                setCountriesVisible(!CountriesVisible);
              }}
              CountriesData={setData}
            />
            <LoginHelp
              isVisible={isLoginHelpVisible}
              hideModal={() => {
                setLoginHelpVisible(!isLoginHelpVisible);
              }}
            />
            <LoadingIndicator
              isVisible={LoaderVisible}
              loaderText={LoaderText}
            />
          </MiniBaseView>
        ) : (
          //////////////////////////// SECOND PART ////////////////////////////
          /**
           * Render ConfirmScreen when user is in ConfirmCode mode.
           */
          <SafeAreaView style={styles.container}>
            <View style={styles.top_bar}>
              <Text style={styles.top_text}>
                Enter the code that we sent
                to {CountryText + ' ' + NumberText}
              </Text>
            </View>
            <View
              style={{
                paddingLeft: '2%',
                paddingRight: '2%',
              }}>
              <OTPTextView
                inputCount={6}
                ref={phoneRef}
                tintColor={COLORS.accentLight}
                offTintColor={COLORS.controlHighlight}
                containerStyle={styles.TextInputContainer}
                textInputStyle={styles.RoundedTextInput}
                handleTextChange={text => {
                  addCodeObserver(text);
                }}
                keyboardType={'numeric'}
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
                    position: 'relative',
                    fontSize: 16,
                    color: COLORS.black,
                    opacity: 0.4,
                    textAlign: 'left',
                    fontFamily: FONTS.regular,
                  }}>
                  WRONG NUMBER
                </Text>
              </View>
              <Text
                style={{
                  position: 'relative',
                  fontSize: 16,
                  color: COLORS.black,
                  opacity: 0.4,
                  textAlign: 'right',
                  fontFamily: FONTS.regular,
                }}
                onPress={() => {
                  phoneRef.current.clear();
                }}>
                CLEAR CODE
              </Text>
            </View>
          </SafeAreaView>
        )}
      </Provider>
    </BaseView>
  );
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
  divider: {
    width: '-1%',
    height: '1%',
    backgroundColor: COLORS.controlHighlight,
  },
  top_text: {
    position: 'relative',
    fontSize: 28,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  SendCode: {
    position: 'relative',
    textAlign: 'center',
    fontSize: 22,
    fontFamily: FONTS.regular,
  },
  TextInputContainer: {
    marginBottom: 20,
  },
  RoundedTextInput: {
    borderRadius: 10,
    borderWidth: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default React.memo(LoginScreen);
