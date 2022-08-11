import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar, Text, TextInput, HelperText, FAB} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {COLORS, FONTS} from '../config/Miscellaneous';
import OTPTextView from '../components/OtpView/OTPTextInput';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import ArrowForward from '../assets/images/arrow-forward.png';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SetupPasscodeScreen = () => {
  const navigation = useNavigation();

  const [mRecoveryPassword, setRecoveryPassword] = React.useState('');
  const [mRecoveryPasswordHint, setRecoveryPasswordHint] = React.useState('');
  const passwordHasLessLength = () => {
    if (mRecoveryPassword?.trim()?.length === 0) {
      return false;
    }
    return mRecoveryPassword?.trim()?.length < 3;
  };

  const passwordHintHasLessLength = () => {
    if (mRecoveryPasswordHint?.trim()?.length === 0) {
      return false;
    }
    return mRecoveryPasswordHint?.trim()?.length < 3;
  };

  const mPINRef = useRef();

  const [mPinCode, setPINCode] = React.useState(null);
  const [mConfirmingCodeForSetup, setConfirmingCodeForSetup] =
    React.useState(false);

  const [ErrorSnackbarText, setErrorSnackbarText] = React.useState(false);

  const [ErrorSnackBarVisible, setErrorSnackBarVisible] = React.useState(false);

  const [mSettingRecoveryPassword, setSettingRecoveryPassword] =
    React.useState(false);

  const [mBottomMargin, setBottomMargin] = React.useState(0);

  const onDismissErrorSnackBar = () => {
    setBottomMargin(0);
    setErrorSnackBarVisible(!ErrorSnackBarVisible);
  };

  if (mSettingRecoveryPassword) {
    return (
      <BaseView>
        <View style={styles.top_bar}>
          <Text style={styles.top_text}>
            Please set a Recovery Password and Hint in case You forget your PIN
          </Text>
        </View>
        <View
          style={{
            padding: '2%',
            justifyContent: 'center',
          }}>
          <TextInput
            style={{
              width: '100%',
              paddingRight: '2%',
              paddingLeft: '2%',
            }}
            mode="outlined"
            label="Recovery Password"
            multiline={false}
            value={mRecoveryPassword}
            maxLength={20}
            theme={{
              colors: {
                text: COLORS.black,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={text => {
              setRecoveryPassword(text);
            }}
          />
          {passwordHasLessLength() ? (
            <HelperText type="error" visible={passwordHasLessLength()}>
              Recovery Password must be longer than 2 characters.
            </HelperText>
          ) : null}
          <TextInput
            style={{
              width: '100%',
              paddingRight: '2%',
              paddingLeft: '2%',
            }}
            mode="outlined"
            label="Password Hint"
            multiline={false}
            value={mRecoveryPasswordHint}
            maxLength={20}
            theme={{
              colors: {
                text: COLORS.black,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={text => {
              setRecoveryPasswordHint(text);
            }}
          />
          {passwordHintHasLessLength() ? (
            <HelperText type="error" visible={passwordHintHasLessLength()}>
              Password Hint must be longer than 2 characters.
            </HelperText>
          ) : null}
        </View>
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
          onPress={() => {
            if (
              mRecoveryPassword?.trim()?.length > 1 &&
              mRecoveryPassword?.trim()?.length > 1
            ) {
              firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .update({
                  passcode: {
                    pin: mPinCode,
                    recovery_password: mRecoveryPassword?.trim(),
                    password_hint: mRecoveryPasswordHint?.trim(),
                    time: Date.now(),
                    passcode_enabled: true,
                  },
                })
                .finally(() => {
                  if (navigation?.canGoBack()) {
                    navigation?.goBack();
                  }
                });
            } else {
              setBottomMargin(heightPercentageToDP(7));
              setErrorSnackbarText('Please fill the requirments above.');
              setErrorSnackBarVisible(!ErrorSnackBarVisible);
            }
          }}
        />
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
      </BaseView>
    );
  } else {
    return (
      <BaseView>
        <View style={styles.top_bar}>
          <Text style={styles.top_text}>
            {mConfirmingCodeForSetup
              ? 'Confirm you PIN Again'
              : 'Please enter your PIN that \n You want to setup as Passcode'}
          </Text>
        </View>
        <View
          style={{
            paddingLeft: '2%',
            paddingRight: '2%',
            alignSelf: 'center',
          }}>
          <OTPTextView
            inputCount={4}
            ref={mPINRef}
            tintColor={COLORS.accentLight}
            offTintColor={COLORS.controlHighlight}
            containerStyle={styles.TextInputContainer}
            textInputStyle={styles.RoundedTextInput}
            handleTextChange={text => {
              if (text.length > 3) {
                if (mConfirmingCodeForSetup) {
                  if (text != mPinCode) {
                    mPINRef.current.clear();
                    setErrorSnackbarText('Wrong PIN, Try again');
                    setErrorSnackBarVisible(true);
                  } else {
                    setSettingRecoveryPassword(true);
                  }
                } else {
                  setPINCode(text);
                  setConfirmingCodeForSetup(true);
                  mPINRef.current.clear();
                }
              }
            }}
            keyboardType={'numeric'}
          />
        </View>
        {mConfirmingCodeForSetup ? (
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
                  fontSize: 16,
                  color: COLORS.black,
                  opacity: 0.4,
                  textAlign: 'center',
                  fontFamily: FONTS.regular,
                }}
                onPress={() => {
                  mPINRef.current.clear();
                  setConfirmingCodeForSetup(false);
                  setPINCode(null);
                  setSettingRecoveryPassword(false);
                }}>
                WRONG PIN
              </Text>
            </View>
          </View>
        ) : null}
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
      </BaseView>
    );
  }
};

const styles = StyleSheet.create({
  top_bar: {
    flexDirection: 'row',
    paddingTop: heightPercentageToDP(1),
    paddingBottom: heightPercentageToDP(1),
    justifyContent: 'center',
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(28),
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
  fab: bottomMargin => {
    return {
      position: 'absolute',
      margin: 16 - 0.1 * 16,
      right: 0,
      bottom: bottomMargin,
    };
  },
});

export default SetupPasscodeScreen;
