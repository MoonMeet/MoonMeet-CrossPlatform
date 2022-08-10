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
import {SharedValue} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import {fontValue} from '../../../config/Dimensions';

interface PrivacyPolicyInterface {
  sheetRef?: Ref | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
}
const PrivacyPolicy = (props: PrivacyPolicyInterface) => {
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
        style={{flex: 1, backgroundColor: COLORS.primaryLight, bottom: '0.25%'}}
        onLayout={handleContentLayout}>
        <Text style={styles.headerText}>Privacy Policy</Text>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subText}>
            Rayen Sbai built the Moon Meet Application and Website. This SERVICE
            is provided by Rayen Sbai at no cost and is intended for use as is.
            This page is used to inform visitors regarding my policies with the
            collection, use, and disclosure of Personal Information if anyone
            decided to use my Service. If you choose to use my Service, then you
            agree to the collection and use of information in relation to this
            policy. The Personal Information that you add here are not used to
            anything like tracking or these stuffs. I will not use or share your
            information with anyone except as described in this Privacy Policy.
            The terms used in this Privacy Policy have the same meanings as in
            our Terms and Conditions, which is accessible at Moon Meet unless
            otherwise defined in this Privacy Policy. Information Collection and
            Use:
          </Text>
          <Text style={styles.lastUpdate}>last updated: August 1, 2022</Text>
          <Text style={styles.subText}>
            For a better experience, while using our Service, I may require you
            to provide us with certain personally identifiable information,
            including but not limited to We only collect username, firstname,
            lastname, or any public information. The information that I request
            will be retained on your device and is not collected by me in any
            way. The app / site does use third party services that may collect
            information used to identify you. Reference to third party service
            used by the app / site are below:
          </Text>
          <Text style={styles.subText}>- Firebase. Google Play Services</Text>
          <Text style={styles.subText}>- Log Data</Text>
          <Text style={styles.subText}>
            I want to inform you that whenever you use my Service, in a case of
            an error in the app I collect data and information (through third
            party products) on your phone called Log Data. This Log Data may
            include information such as your device Internet Protocol (“IP”)
            address, device name, operating system version, the configuration of
            the app / site when utilizing my Service, the time and date of your
            use of the Service, and other statistics. Cookies.
          </Text>
          <Text style={styles.subText}>
            Cookies are files with a small amount of data that are commonly used
            as anonymous unique identifiers. These are sent to your browser from
            the websites that you visit and are stored on your device's internal
            memory. This Service does not use these “cookies” explicitly.
            However, the app may use third party code and libraries that use
            “cookies” to collect information and improve their services. You
            have the option to either accept or refuse these cookies and know
            when a cookie is being sent to your device. If you choose to refuse
            our cookies, you may not be able to use some portions of this
            Service. Service Providers:
          </Text>
          <Text style={styles.subText}>
            I may employ third-party companies and individuals due to the
            following reasons: To facilitate our Service, To provide the Service
            on our behalf, To perform Service-related services or To assist us
            in analyzing how our Service is used. I want to inform users of this
            Service that these third parties have access to your Personal
            Information. The reason is to perform the tasks assigned to them on
            our behalf. However, they are obligated not to disclose or use the
            information for any other purpose. Security:
          </Text>
          <Text style={styles.subText}>
            I value your trust in providing us your Personal Information, thus
            we are striving to use commercially acceptable means of protecting
            it. But remember that no method of transmission over the internet,
            or method of electronic storage is 100% secure and reliable, and I
            cannot guarantee its absolute security. Children’s Privacy:
          </Text>
          <Text style={styles.subText}>
            These Services do not address anyone under the age of 13. I do not
            knowingly collect personally identifiable information from children
            under 13. In a case I discover that a child under 13 has provided me
            with personal information, I immediately delete this from our
            servers. If you are a parent or guardian and you are aware that your
            child has provided us with personal information, please contact me
            so that I will be able to take necessary actions. Changes to This
            Privacy Policy: I may update our Privacy Policy from time to time.
            Thus, you are advised to review this page periodically for any
            changes. I will notify you of any changes by posting the new Privacy
            Policy on this page. This policy is effective as of 26-8-2021
          </Text>
          <Text style={styles.subText}>
            Contact Us: If you have any questions or suggestions about Moon Meet
            Privacy Policy, do not hesitate to contact me at
            Rayensbai2@gmail.com.
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
export default PrivacyPolicy;
