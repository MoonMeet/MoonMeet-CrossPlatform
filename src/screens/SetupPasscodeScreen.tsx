/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2024.
 */

import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB, HelperText, Text, TextInput} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {COLORS, FONTS} from '../config/Miscellaneous';
import OTPTextView, {OTPTextViewHandle} from 'components/OtpView/OTPTextInput';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spacer from '../components/Spacer/Spacer';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';

const SetupPasscodeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const mPINRef = useRef<OTPTextViewHandle | null>(null);

  const [mPinCode, setPINCode] = React.useState<string>('');
  const [mConfirmingCodeForSetup, setConfirmingCodeForSetup] =
    React.useState(false);

  const [mSettingRecoveryPassword, setSettingRecoveryPassword] =
    React.useState(false);

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
            right={
              <TextInput.Affix
                text={`${mRecoveryPasswordHint?.trim()?.length}/20`}
              />
            }
            theme={{
              colors: {
                primary: COLORS.accentLight,
                onSurface: COLORS.black,
                background: COLORS.dimmed,
              },
            }}
            onChangeText={text => {
              setRecoveryPassword(text);
            }}
            accessibilityLabelledBy={undefined}
            accessibilityLanguage={undefined}
          />
          {passwordHasLessLength() ? (
            <HelperText
              type="error"
              visible={passwordHasLessLength()}
              accessibilityLabelledBy={undefined}
              accessibilityLanguage={undefined}>
              Recovery Password must be longer than 2 characters.
            </HelperText>
          ) : null}
          <Spacer height={heightPercentageToDP(0.75)} />
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
            right={
              <TextInput.Affix
                text={`${mRecoveryPasswordHint?.trim()?.length}/20`}
              />
            }
            theme={{
              colors: {
                primary: COLORS.accentLight,
                onSurface: COLORS.black,
                background: COLORS.dimmed,
              },
            }}
            onChangeText={text => {
              setRecoveryPasswordHint(text);
            }}
            accessibilityLabelledBy={undefined}
            accessibilityLanguage={undefined}
          />
          {passwordHintHasLessLength() ? (
            <HelperText
              type="error"
              visible={passwordHintHasLessLength()}
              accessibilityLabelledBy={undefined}
              accessibilityLanguage={undefined}>
              Password Hint must be longer than 2 characters.
            </HelperText>
          ) : null}
        </View>
        <FAB
          style={styles.fab}
          color={COLORS.primaryLight}
          mode={'elevated'}
          size={'medium'}
          icon={({size, allowFontScaling}) => (
            <MaterialIcons
              name="chevron-right"
              color={COLORS.white}
              size={size}
              allowFontScaling={allowFontScaling}
            />
          )}
          animated={true}
          theme={{
            colors: {
              primaryContainer: COLORS.accentLight,
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
            }
          }}
          accessibilityLabelledBy={undefined}
          accessibilityLanguage={undefined}
        />
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
                  if (text !== mPinCode) {
                    mPINRef?.current?.clear();
                  } else {
                    setSettingRecoveryPassword(true);
                  }
                } else {
                  setPINCode(text);
                  setConfirmingCodeForSetup(true);
                  mPINRef?.current?.clear();
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
                  mPINRef?.current?.clear();
                  setConfirmingCodeForSetup(false);
                  setPINCode('');
                  setSettingRecoveryPassword(false);
                }}>
                WRONG PIN
              </Text>
            </View>
          </View>
        ) : null}
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
  fab: {
    position: 'absolute',
    margin: 16 - 0.1 * 16,
    right: 0,
    bottom: 0,
  },
});

export default SetupPasscodeScreen;
