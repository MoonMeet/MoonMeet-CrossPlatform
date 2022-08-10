import React, {Ref, useCallback, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import {isAndroid} from '../../../utils/device/DeviceInfo';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {fontValue} from '../../../config/Dimensions';
import {ScrollView} from 'react-native-gesture-handler';

interface LoginHelpInterface {
  sheetRef?: Ref | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
}

const LoginHelp = (props: LoginHelpInterface) => {
  const {animatedHandleHeight, handleContentLayout} =
    useBottomSheetDynamicSnapPoints(props.snapPoints);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      padding: '0.5%',
      shadowColor: COLORS.black,
    }),
    [],
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={props?.sheetRef}
      index={props?.index}
      snapPoints={props?.snapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={true}
      handleHeight={animatedHandleHeight}
      backdropComponent={renderBackdrop}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        style={{flex: 1, backgroundColor: COLORS.primaryLight, bottom: '0.25%'}}
        onLayout={handleContentLayout}>
        {isAndroid ? (
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.headerText}>Verifying your number</Text>
            <Text style={styles.subText}>Requirements</Text>
            <Text style={styles.instruction}>
              - You can only verify a phone number you own.
            </Text>
            <Text style={styles.instruction}>
              - You must be able to receive SMS to the phone number you are
              trying to verify.
            </Text>
            <Text style={styles.instruction}>
              - You must have any SMS-blocking settings, apps or task killers
              disabled.
            </Text>
            <Text style={styles.instruction}>
              - You must have a working internet connection through mobile data
              or Wi-Fi, if you're roaming or have a bad connection, verification
              may not work.
            </Text>
            <Text style={styles.headerText}>How to verify</Text>
            <Text style={styles.instruction}>1. Enter your phone number:</Text>
            <Text style={styles.instruction}>
              - Choose your country by showing countries list, this will
              automatically fill your country code on the left.
            </Text>
            <Text style={styles.instruction}>
              - Enter your phone number in the box on the right. don't put any 0
              before your phone number.
            </Text>
            <Text style={styles.instruction}>
              2. Tap on Send Code button to request a code.
            </Text>
            <Text style={styles.instruction}>
              3. Enter the 6-digit code you receive via SMS.
            </Text>
            <Text
              style={{
                color: COLORS.accentLight,
                fontFamily: FONTS.bold,
                fontSize: 23,
                paddingLeft: '4%',
                paddingTop: '2%',
                paddingBottom: '2%',
                paddingRight: '1%',
                textAlign: 'left',
              }}>
              If you didn't receive the 6-digit code by SMS
            </Text>
            <Text style={styles.instruction}>
              - Wait for 10 minutes and retry.
            </Text>
            <Text style={styles.instruction}>
              - Don't guess the code, or you will be locked out for a period of
              time.
            </Text>
            <Text style={styles.instruction}>
              - Note: Depending on your carrier, you might receive charges for
              SMS.
            </Text>
            <Text style={styles.headerText}>Troubleshooting steps</Text>
            <Text
              style={{
                color: COLORS.accentLight,
                fontFamily: FONTS.regular,
                fontSize: 18,
                paddingLeft: '4%',
                paddingTop: '1%',
                paddingBottom: '2%',
                paddingRight: '1%',
                textAlign: 'left',
              }}>
              if you were having issues verifying, please try the following:
            </Text>
            <Text style={styles.instruction}>1. Reboot your phone.</Text>
            <Text style={styles.instruction}>
              2. Delete and reinstall the latest version Moon Meet.
            </Text>
            <Text style={styles.instruction}>
              3. Send a test SMS message from any phone to your own phone number
              exactly as you entered it in Moon Meet, including the country
              code, to check your reception.
            </Text>
          </ScrollView>
        ) : (
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.headerText}>Verifying your number</Text>
            <Text style={styles.subText}>Requirements</Text>
            <Text style={styles.instruction}>
              - You have the latest version of Moon Meet installed from App
              Store.
            </Text>
            <Text style={styles.instruction}>
              - Omit any zeros (0s) or exit codes from your number.
            </Text>
            <Text style={styles.instruction}>
              - Your phone has full internet access with a strong signal.
            </Text>
            <Text style={styles.instruction}>
              - Your phone can receive international SMS messages.
            </Text>
            <Text style={styles.instruction}>
              - You're not using an unsupported device as an iPod touch iPad.
            </Text>
            <Text style={styles.instruction}>
              - Your device isn't jailbroken.
            </Text>
            <Text style={styles.instruction}>
              Note: Depending on your carrier, you might receive charges for
              SMS.
            </Text>
            <Text
              style={{
                color: COLORS.accentLight,
                fontFamily: FONTS.regular,
                fontSize: fontValue(18),
                paddingLeft: '4%',
                paddingTop: '1%',
                paddingBottom: '2%',
                paddingRight: '1%',
                textAlign: 'left',
              }}>
              if you have followed these steps and can't receive a code, please
              do the following:
            </Text>
            <Text style={styles.instruction}>
              1. Uninstall Moon Meet from your iPhone.
            </Text>
            <Text style={styles.instruction}>2. Reboot your iPhone</Text>
            <Text style={styles.instruction}>
              3. Download the latest version of WhatsApp from the App Store.
            </Text>
          </ScrollView>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  headerText: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: fontValue(25),
    paddingLeft: '4%',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingRight: '1%',
    textAlign: 'left',
  },
  subText: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: fontValue(23),
    paddingLeft: '4%',
    textAlign: 'left',
    opacity: 0.4,
  },
  instruction: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: fontValue(18),
    paddingLeft: '4%',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingRight: '1%',
    textAlign: 'left',
    opacity: 0.6,
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    elevation: 25,
  },
});
export default LoginHelp;
