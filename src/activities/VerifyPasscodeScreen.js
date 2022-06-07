import React from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';

const VerifyPasscodeScreen = () => {
  const navigation = useNavigation();
  const [mIsForgetpassword, setIsForgetPassword] = React.useState(false);
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
              }
            }}
            keyboardType={'numeric'}
          />
        </View>
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
    fontSize: fontValue(28),
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
    borderRadius: 10,
    borderWidth: 2,
  },
});
export default React.memo(VerifyPasscodeScreen);
