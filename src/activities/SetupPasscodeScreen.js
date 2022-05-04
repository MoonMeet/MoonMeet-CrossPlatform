import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {COLORS, FONTS} from '../config/Miscellaneous';
import OTPTextView from '../components/OtpView/OTPTextInput';
import {IconButton} from 'react-native-paper';

import BackImage from '../assets/images/back.png';
import {getCodename} from 'react-native-device-info';

const SetupPasscodeScreen = () => {
  const navigation = useNavigation();

  const mPINRef = useRef();

  const [mPinCode, setPINCode] = React.useState(null);
  const [mConfirmingCodeForSetup, setConfirmingCodeForSetup] =
    React.useState(false);

  useEffect(() => {
    return () => {};
  });
  return (
    <MiniBaseView>
      <View
        style={{
          alignItems: 'flex-start',
        }}>
        <IconButton
          icon={BackImage}
          color={'#999999'}
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
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
                  console.log('wrong');
                  console.log(text);
                  // TODO
                } else {
                  // TODO
                  console.log('correct');
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
                position: 'relative',
                fontSize: 16,
                color: COLORS.black,
                opacity: 0.4,
                textAlign: 'left',
                fontFamily: FONTS.regular,
              }}
              onPress={() => {
                mPINRef.current.clear();
              }}>
              WRONG PIN
            </Text>
          </View>
        </View>
      ) : null}
    </MiniBaseView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: '2%',
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
    fontSize: 28,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  TextInputContainer: {
    marginBottom: 20,
  },
  RoundedTextInput: {
    borderRadius: 10,
    borderWidth: 2,
  },
});
export default React.memo(SetupPasscodeScreen);
