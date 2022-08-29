/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';

import {ScrollView} from 'react-native-gesture-handler';
import {fontValue} from '../../../config/Dimensions';

const TermsConditions = ({sheetRef, snapPoints, index}) => {
  const {animatedHandleHeight, handleContentLayout} =
    useBottomSheetDynamicSnapPoints(snapPoints);

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
      padding: '2.5%',
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
      ref={sheetRef}
      index={index}
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={true}
      handleHeight={animatedHandleHeight}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        style={{flex: 1, backgroundColor: COLORS.primaryLight, bottom: '0.25%'}}
        onLayout={handleContentLayout}>
        <Text style={styles.headerText}>Terms & Conditions</Text>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 12 - 0.1 * 12}}>
          <Text style={styles.subText}>
            By downloading or using the app, these terms will automatically
            apply to you, you should make sure therefore that you read them
            carefully before using the app. You’re not allowed to copy or modify
            the app, any part of the app, or our trademarks in any way. You’re
            not allowed to attempt to extract the source code of the app, and
            you also shouldn’t try to translate the app into other languages or
            make derivative versions. The app itself, and all the trademarks,
            copyright, database rights, you can only contribute on GitHub and
            other intellectual property rights related to it, still belong to
            Rayen sbai.
          </Text>
          <Text style={styles.lastUpdate}>last updated: September 2, 2022</Text>
          <Text style={styles.subText}>
            The owner is committed to ensuring that the app is as useful and
            efficient as possible. For that reason, we reserve the right to make
            changes to the app or to charge for its services, at any time and
            for any reason. We will never charge you for the app or its services
            without making it very clear to you exactly what you’re paying for.
          </Text>
          <Text style={styles.subText}>
            The Moon Meet app stores and processes personal data that you have
            provided to us, to provide my service. It’s your responsibility to
            keep your phone and access to the app secure. We therefore recommend
            that you do not jailbreak or root your phone, which is the process
            of removing software restrictions and limitations imposed by the
            official operating system of your device. It could make your phone
            vulnerable to malware, viruses and malicious programs, compromise
            your phone’s security features and it could mean that the Moon Meet
            app won’t work properly or at all.
          </Text>
          <Text style={styles.subText}>
            The app does use third-party services that declare their Terms and
            Conditions. Link to Terms and Conditions of third-party service
            providers used by the app:
          </Text>
          <Text style={styles.subText}>- Google Firebase</Text>
          <Text style={styles.subText}>- Google Crashlytics for Firebase</Text>
          <Text style={styles.subText}>- Google Analytics for Firebase</Text>
          <Text style={styles.subText}>- Google Play Services</Text>
          <Text style={styles.subText}>- Google Phone Auth Recaptcha</Text>
          <Text style={styles.subText}>
            You should be aware that there are certain things that Rayen sbai
            will not take responsibility for. Certain functions of the app will
            require the app to have an active internet connection. The
            connection can be Wi-Fi or provided by your mobile network provider,
            but The owner cannot take responsibility for the app not working at
            full functionality if you don’t have access to Wi-Fi, and you don’t
            have any of your data allowance left.
          </Text>
          <Text style={styles.subText}>
            If you’re using the app outside of an area with Wi-Fi, you should
            remember that the terms of the agreement with your mobile network
            provider will still apply. As a result, you may be charged by your
            mobile provider for the cost of data for the duration of the
            connection while accessing the app, or other third-party charges. In
            using the app, you’re accepting responsibility for any such charges,
            including roaming data charges if you use the app outside of your
            home territory (i.e. region or country) without turning off data
            roaming. If you are not the bill payer for the device on which
            you’re using the app, please be aware that we assume that you have
            received permission from the bill payer for using the app.
          </Text>
          <Text style={styles.subText}>
            Along the same lines, Rayen sbai cannot always take responsibility
            for the way you use the app i.e. You need to make sure that your
            device stays charged, if it runs out of battery and you can’t turn
            it on to avail the Service, The owner cannot accept responsibility.
          </Text>
          <Text style={styles.subText}>
            With respect to Rayen sbai’s responsibility for your use of the app,
            when you’re using the app, it’s important to bear in mind that
            although we endeavor to ensure that it is updated and correct at all
            times, we do rely on third parties to provide information to us so
            that we can make it available to you. The owner accepts no liability
            for any loss, direct or indirect, you experience as a result of
            relying wholly on this functionality of the app.
          </Text>
          <Text style={styles.subText}>
            At some point, we may wish to update the app. The app is currently
            available on Android & iOS, the requirements for the both
            systems(and for any additional systems we decide to extend the
            availability of the app to) may change, and you’ll need to download
            the updates if you want to keep using the app. SectionTN does not
            promise that it will always update the app so that it is relevant to
            you and/or works with the Android & iOS version that you have
            installed on your device. However, you promise to always accept
            updates to the application when offered to you, We may also wish to
            stop providing the app, and may terminate use of it at any time
            without giving notice of termination to you. Unless we tell you
            otherwise, upon any termination, (a) the rights and licenses granted
            to you in these terms will end; (b) you must stop using the app, and
            (if needed) delete it from your device.
          </Text>
          <Text style={styles.subText}>
            Changes to This Terms and Conditions:
          </Text>
          <Text style={styles.subText}>
            I may update our Terms and Conditions from time to time, you are
            advised to review this page periodically for any changes. I will
            notify you of any changes by posting the new Terms and Conditions on
            this page.
          </Text>
          <Text style={styles.subText}>
            Contact Us: If you have any questions or suggestions about Moon Meet
            Privacy Policy, do not hesitate to contact me on:
          </Text>
          <Text style={styles.subText}>Email: rayensbai2@gmail.com</Text>
          <Text style={styles.subText}>Phone: +216 55063898</Text>
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
    padding: '1%',
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
export default TermsConditions;
