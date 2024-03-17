/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect, useRef} from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {fontValue, heightPercentageToDP} from 'config/Dimensions';
import {COLORS, FONTS} from 'config/Miscellaneous';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Avatar, FAB, HelperText, Snackbar, TextInput} from 'react-native-paper';
import OTPTextView, {OTPTextViewHandle} from 'components/OtpView/OTPTextInput';
import {InfoToast} from 'components/ToastInitializer/ToastInitializer';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes';
import {
  ArrowForward,
  AuthenticationImage,
  BackImage,
  RecoveryImage,
} from 'index.d';

const VerifyPasscodeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const pinRef = useRef<OTPTextViewHandle | null>(null);

  const [forgottenPassword, setForgottenPassword] = React.useState(false);
  const [pinCode, setPINCode] = React.useState('');
  const [passcodeHint, setPasscodeHint] = React.useState('');
  const [passRecovery, setPassRecovery] = React.useState('');

  const [recoveryTextInput, setRecoveryTextInput] = React.useState('');
  const onRecoveryTextInputChange = (RePass: string) => {
    setRecoveryTextInput(RePass);
  };
  const passwordHasLessLength = () => {
    if (recoveryTextInput?.trim()?.length === 0) {
      return false;
    }
    return recoveryTextInput?.trim()?.length < 3;
  };

  const checkCode = (code: string) => {
    if (code === pinCode) {
      navigation?.navigate('home');
    } else {
      setErrorSnackbarText('Wrong PIN, Try again.');
      setErrorSnackBarVisible(!ErrorSnackBarVisible);
    }
  };

  const [bottomMargin, setBottomMargin] = React.useState(0);

  const [ErrorSnackbarText, setErrorSnackbarText] = React.useState('');

  const [ErrorSnackBarVisible, setErrorSnackBarVisible] = React.useState(false);

  const onDismissErrorSnackBar = () => {
    setBottomMargin(0);
    setErrorSnackBarVisible(!ErrorSnackBarVisible);
  };

  const fabStyle = (bottomMargin: number) => {
    return {
      position: 'absolute' as 'absolute',
      margin: 16 - 0.1 * 16,
      right: 0,
      bottom: bottomMargin,
    };
  };

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (
            documentSnapshot?.data()?.passcode?.pin &&
            documentSnapshot?.data()?.passcode?.recovery_password &&
            documentSnapshot?.data()?.passcode?.password_hint
          ) {
            setPINCode(documentSnapshot?.data()?.passcode?.pin);
            setPassRecovery(
              documentSnapshot?.data()?.passcode?.recovery_password,
            );
            setPasscodeHint(documentSnapshot?.data()?.passcode?.password_hint);
          }
        }
      });
  });

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

  if (forgottenPassword) {
    return (
      <BaseView>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            <Pressable onPress={() => setForgottenPassword(!forgottenPassword)}>
              <Avatar.Icon
                icon={BackImage}
                size={37.5}
                color={COLORS.black}
                style={{
                  marginRight: '-1%',
                  opacity: 0.4,
                }}
                theme={{
                  colors: {
                    primary: COLORS.transparent,
                  },
                }}
              />
            </Pressable>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.mid_side}>
              <Text style={styles.top_text}>Recovery</Text>
            </View>
          </View>
        </View>
        <View>
          <Image style={styles.illustration} source={RecoveryImage} />
          <Text style={styles.sub_text}>
            Please submit your Recovery Password {'\n'} to disable PIN code
          </Text>
        </View>
        <View
          style={{
            paddingLeft: heightPercentageToDP(0.5),
            paddingRight: heightPercentageToDP(0.5),
          }}>
          <TextInput
            style={{
              width: '100%',
            }}
            mode="outlined"
            label="Recovery Password"
            multiline={false}
            value={recoveryTextInput}
            maxLength={20}
            theme={{
              colors: {
                primary: COLORS.accentLight,
              },
            }}
            onChangeText={onRecoveryTextInputChange}
          />
          {passwordHasLessLength() ? (
            <HelperText type="error" visible={passwordHasLessLength()}>
              Recovery Password must be longer than 2 characters.
            </HelperText>
          ) : null}
          <HelperText
            style={{
              fontSize: fontValue(12),
              color: COLORS.accentLight,
              fontFamily: FONTS.regular,
            }}
            type="info"
            visible={true}>
            Password Hint:{' '}
            <Text
              style={{
                fontSize: fontValue(12),
                color: COLORS.darkGrey,
                fontFamily: FONTS.regular,
              }}>
              {passcodeHint}
            </Text>
          </HelperText>
        </View>
        <FAB
          style={fabStyle(bottomMargin)}
          icon={ArrowForward}
          color={COLORS.primaryLight}
          animated={true}
          theme={{
            colors: {
              accent: COLORS.accentLight,
            },
          }}
          onPress={() => {
            if (recoveryTextInput?.trim()?.length < 1) {
              setBottomMargin(heightPercentageToDP(7));
              setErrorSnackbarText('Please submit your recovery password');
              setErrorSnackBarVisible(!ErrorSnackBarVisible);
            } else if (recoveryTextInput !== passRecovery) {
              setBottomMargin(heightPercentageToDP(7));
              setErrorSnackbarText('Wrong Password, Try again.');
              setErrorSnackBarVisible(!ErrorSnackBarVisible);
            } else {
              firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .update({
                  passcode: firestore?.FieldValue?.delete(),
                })
                .finally(() => {
                  firestore()
                    .collection('users')
                    .doc(auth()?.currentUser?.uid)
                    .update({
                      passcode: {
                        passcode_enabled: false,
                      },
                    })
                    .finally(() => {
                      navigation?.navigate('home');
                      InfoToast(
                        'bottom',
                        'Passcode Removed',
                        'You can set up a new one from settings.',
                        true,
                        3000,
                      );
                    });
                });
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
          <Text style={styles.top_text}>Authentication</Text>
          <Image style={styles.illustration} source={AuthenticationImage} />
          <Text style={styles.sub_text}>
            Please verify your passcode to {'\n'} access your account
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
            ref={pinRef}
            tintColor={COLORS.accentLight}
            offTintColor={COLORS.controlHighlight}
            containerStyle={styles.TextInputContainer}
            textInputStyle={styles.RoundedTextInput}
            handleTextChange={code => {
              if (code.length > 3) {
                checkCode(code);
              }
            }}
            keyboardType={'numeric'}
          />
          <Pressable onPress={() => setForgottenPassword(!forgottenPassword)}>
            <Text style={styles.forget_password}>Forget Password ?</Text>
          </Pressable>
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
      </BaseView>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    padding: heightPercentageToDP(0.5),
    flexDirection: 'row',
  },
  left_side: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: heightPercentageToDP(0.5),
    flexDirection: 'row',
  },
  mid_side: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    justifyContent: 'center',
    marginLeft: '2.5%',
    marginRight: heightPercentageToDP(6),
  },
  top_bar: {
    flexDirection: 'column',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'center',
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  illustration: {
    height: 125,
    width: 125,
    position: 'relative',
    alignSelf: 'center',
  },
  sub_text: {
    position: 'relative',
    fontSize: fontValue(16),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.darkGrey,
    fontFamily: FONTS.regular,
  },
  forget_password: {
    position: 'relative',
    fontSize: fontValue(14),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  TextInputContainer: {
    marginBottom: 20,
    marginRight: heightPercentageToDP(8),
    marginLeft: heightPercentageToDP(8),
  },
  RoundedTextInput: {
    borderRadius: heightPercentageToDP(1),
    borderWidth: 2,
  },
});

export default VerifyPasscodeScreen;
