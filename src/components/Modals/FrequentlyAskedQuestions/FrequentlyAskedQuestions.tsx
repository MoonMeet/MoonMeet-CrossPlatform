/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {Ref, useCallback, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from 'config/Miscellaneous';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {fontValue} from 'config/Dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

interface FAQInterface {
  sheetRef?: Ref<BottomSheetModalMethods> | undefined;
  snapPoints?: (string | number)[];
  index?: number | undefined;
}

const FrequentlyAskedQuestions = (props: FAQInterface) => {
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
      shadowColor: COLORS.black,
    }),
    [],
  );

  const renderBackdrop = useCallback(
    (backProps: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...backProps}
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
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryLight,
        }}>
        <Text style={styles.headerText}>Frequently Asked Questions</Text>
        <ScrollView>
          <Text style={styles.subText}>Q&A 1: What is Moon Meet?</Text>
          <Text style={styles.subText}>
            Moon Meet is an instant messaging application that gives you a good
            access to connect with friends, make relationships and others.
          </Text>
          <Text style={styles.subText}>Q&A 2: Who it is for ?</Text>
          <Text style={styles.subText}>
            Moo,n Meet is allowed for everyone above 13 years old.
          </Text>
          <Text style={styles.subText}>Q&A 3: Why Moon Meet?</Text>
          <Text style={styles.subText}>
            The developer have been choosen Moon Meet from an inspiration.
          </Text>
          <Text style={styles.subText}>Q&A: How i can get Moon Meet ?</Text>
          <Text style={styles.subText}>
            You can get Moon Meet by downloading the app from Play Store (maybe)
            or Github Release.
          </Text>
          <Text style={styles.subText}>
            Q&A 5: does Moon Meet has end-to-end Encryption ?
          </Text>
          <Text style={styles.subText}>
            Yes, Moon Meet have an end-to-end Encrypted
          </Text>
          <Text style={styles.subText}>
            Q&A 6: Can i change my information ?
          </Text>
          <Text style={styles.subText}>
            Sure, You can change your informations at any time.
          </Text>
          <Text style={styles.subText}>Q&A 7: Can i delete my account ?</Text>
          <Text style={styles.subText}>
            Yes, Moon Meet let you delete your account at any time but
            unfortunately, it is not available at this time, it going to be
            included soon.
          </Text>
          <Text style={styles.subText}>Q&A 8: Who can see me online ?</Text>
          <Text style={styles.subText}>
            By default, your active status is visible to everyone. You can hide
            your active status from settings anytime you want.
          </Text>
          <Text style={styles.subText}>Q&A 9: Who is Behind Moon Meet ?</Text>
          <Text style={styles.subText}>
            Behind Moon Meet, There is Rayen Sbai A.K.A SectionTN and our GitHub
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
            Sure, you can open a pull request in our GitHub repository and
            become one of the contributors.
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
            Moon Meet collects public information about you like First name,
            Last name, Birth date, Username, Biography, in shortly, the
            information that you enter while and after doing the registration,
            but keep in mind that we don't share or sell any of your data, you
            can check our source code for that.
          </Text>
          <Text style={styles.subText}>
            Q&A 14: My phone has been stolen. Can support help me secure my
            account ?
          </Text>
          <Text style={styles.subText}>
            There's no information about this question for now, we'll update
            this section and inform your in future
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
