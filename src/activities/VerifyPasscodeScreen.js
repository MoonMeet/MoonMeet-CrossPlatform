import React, {useEffect, useRef, useCallback} from 'react';
import {BackHandler, StyleSheet, View, Text} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Snackbar} from 'react-native-paper';
import OTPTextView from '../components/OtpView/OTPTextInput';

const VerifyPasscodeScreen = () => {
  const navigation = useNavigation();

  const mPINRef = useRef();

  const [mIsForgetpassword, setIsForgetPassword] = React.useState(false);
  const [mCodeTextInputDisabled, setCodeTextInputDisabled] =
    React.useState(false);
  const [mPINCode, setPINCode] = React.useState('');
  const [mPasscodeHint, setPasscodeHint] = React.useState('');
  const [mPasscRecovery, setPassRecovery] = React.useState('');

  const checkCode = code => {
    if (code === mPINCode) {
      navigation.navigate('home');
    } else {
      setErrorSnackbarText('Wrong PIN, Try again.');
      setErrorSnackBarVisible(!ErrorSnackBarVisible);
    }
  };

  const [ErrorSnackbarText, setErrorSnackbarText] = React.useState(false);

  const [ErrorSnackBarVisible, setErrorSnackBarVisible] = React.useState(false);

  const onDismissErrorSnackBar = () => {
    setErrorSnackBarVisible(!ErrorSnackBarVisible);
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
    const getCodeFromDatabase = database()
      .ref(`/users/${auth().currentUser.uid}/passcode/`)
      .once('value', snapshot => {
        if (
          snapshot?.val().pin &&
          snapshot?.val().recovery_password &&
          snapshot?.val().password_hint
        ) {
          setPINCode(snapshot?.val().pin);
          setPassRecovery(snapshot?.val().recovery_password);
          setPasscodeHint(snapshot?.val().password_hint);
        }
      });
  });
  if (mIsForgetpassword) {
    return <BaseView />;
  } else {
    return (
      <BaseView>
        <View style={styles.top_bar}>
          <Text style={styles.top_text}>Please Verify Your Passcode</Text>
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
            handleTextChange={code => {
              console.log(code);
              if (code.length > 3) {
                checkCode(code);
              }
            }}
            keyboardType={'numeric'}
          />
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
    fontSize: fontValue(26),
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
export default React.memo(VerifyPasscodeScreen);
