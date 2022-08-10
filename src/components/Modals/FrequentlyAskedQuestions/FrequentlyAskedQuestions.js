import React, {useCallback, useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {fontValue} from '../../../config/Dimensions';

interface FAQInterface {
  sheetRef?: Ref | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
}
const FrequentlyAskedQuestions = (props: FAQInterface) => {
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
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryLight,
        }}>
        <Text style={styles.headerText}>Frequently Asked Questions</Text>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subText}>Q&A 1: What is Moon Meet?</Text>
          <Text style={styles.subText}>
            Moon Meet is an instant messaging application that gives you a good
            access to connect with friends, Make relationships, Share Stories...
          </Text>
          <Text style={styles.subText}>Q&A 2: Who it is for ?</Text>
          <Text style={styles.subText}>
            Moon Meet is allowed for everyone who wanna chat and make
            Relationships and new Friends and care about privacy.
          </Text>
          <Text style={styles.subText}>Q&A 3: Why Moon Meet?</Text>
          <Text style={styles.subText}>
            Use Moon Meet to chat and communicate assured that all your data and
            info are completely secret.
          </Text>
          <Text style={styles.subText}>Q&A: How i can get Moon Meet ?</Text>
          <Text style={styles.subText}>
            You can get Moon Meet by downloading the app from Play Store or
            AppStore.
          </Text>
          <Text style={styles.subText}>
            Q&A 5: does Moon Meet has end-to-end Encryption ?
          </Text>
          <Text style={styles.subText}>
            Future updates going to include this feature.
          </Text>
          <Text style={styles.subText}>
            Q&A 6: Is my information changeable ?
          </Text>
          <Text style={styles.subText}>
            Sure, You can change your informations at any time.
          </Text>
          <Text style={styles.subText}>Q&A 7: Can i delete my account ?</Text>
          <Text style={styles.subText}>
            Yes, You can delete your Moon Meet account at anytime.
          </Text>
          <Text style={styles.subText}>Q&A 8: Who can see me online ?</Text>
          <Text style={styles.subText}>
            By default, your active status is visible to everyone. You can hide
            your online status from the settings anytime you want.
          </Text>
          <Text style={styles.subText}>Q&A 9: Who is Behind Moon Meet ?</Text>
          <Text style={styles.subText}>
            Behind Moon Meet, There is Rayen Sbai, Aziz Becha and our GitHub
            Contributors.
          </Text>
          <Text style={styles.subText}>Q&A 10: Can i report a problem ?</Text>
          <Text style={styles.subText}>
            Sure, Reporting bugs or problems is the duty of everyone on our
            platform.
          </Text>
          <Text style={styles.subText}>
            Q&A 11: Can i help to improve this Platform ?
          </Text>
          <Text style={styles.subText}>
            Sure, If you have some good ideas you can open a pull request in our
            GitHub repository and become one of the contributors.
          </Text>
          <Text style={styles.subText}>Q&A 12 : Who can see my profile ? </Text>
          <Text style={styles.subText}>
            Everyone on the platform can see your profile, but he cannot see
            your phone number or your online status if you disable them in
            Settings
          </Text>
          <Text style={styles.subText}>
            Q&A 13: Which information can Moon Meet gather about me ?
          </Text>
          <Text style={styles.subText}>
            Moon Meet collects public information about you like First Name,
            Last Name, Birth Date, Username, Bio, in shortly, the information
            that you enter while and after doing the registration.
          </Text>
          <Text style={styles.subText}>
            Q&A 14: My phone has been stolen. Can support help me secure my
            account ?
          </Text>
          <Text style={styles.subText}>
            Of course. If you encounter one of those problems like SIM or Phone
            lost. You can contact our support team who can help you solve your
            problem.
          </Text>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
const styles = StyleSheet.create({
  headerText: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: fontValue(20),
    padding: '2%',
    textAlign: 'center',
  },
  subText: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: fontValue(18),
    padding: '2%',
    opacity: 0.6,
    textAlign: 'left',
  },
  lastUpdate: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: fontValue(18),
    padding: '2%',
    opacity: 0.4,
    textAlign: 'left',
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

export default FrequentlyAskedQuestions;
