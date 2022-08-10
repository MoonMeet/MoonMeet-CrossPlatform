import React, {useCallback, useMemo} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {Text, RadioButton} from 'react-native-paper';
import {fontValue, heightPercentageToDP} from '../../config/Dimensions';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PrivacyBottomSheet = ({
  sheetRef,
  sheetIndex,
  sheetSnapPoints,
  phoneNumberStatus,
}) => {
  const {animatedHandleHeight, handleContentLayout} =
    useBottomSheetDynamicSnapPoints(sheetSnapPoints);

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

  const [userChoice, setUserChoice] = React.useState(
    phoneNumberStatus === 'none' ? 'none' : 'hidden',
  );

  const {dismissAll} = useBottomSheetModal();

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
      index={sheetIndex}
      snapPoints={sheetSnapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      backdropComponent={renderBackdrop}
      handleHeight={animatedHandleHeight}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{
          backgroundColor: COLORS.primaryLight,
          margin: '1%',
        }}
      />
      <Text style={styles.toptext}>Number Settings</Text>
      <Text
        style={[
          styles.text,
          {
            opacity: 0.8,
            fontSize: fontValue(16),
            marginTop: heightPercentageToDP(0.5),
          },
        ]}>
        Who can see my phone number?
      </Text>
      <RadioButton.Group
        onValueChange={phoneStatus => {
          setUserChoice(phoneStatus);
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .update({
              phone_status: phoneStatus,
            })
            .then(() => {
              dismissAll();
              sheetRef?.current?.forceClose();
            });
        }}
        value={userChoice}>
        <RadioButton.Item
          labelStyle={{
            fontFamily: FONTS.regular,
            opacity: 0.8,
            color: COLORS.black,
            fontSize: fontValue(18),
          }}
          label="Everyone"
          value="none"
          color={COLORS.accentLight}
        />
        <RadioButton.Item
          labelStyle={{
            fontFamily: FONTS.regular,
            opacity: 0.8,
            color: COLORS.black,
            fontSize: fontValue(18),
          }}
          label="Nobody"
          value="hidden"
          color={COLORS.accentLight}
        />
      </RadioButton.Group>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  toptext: {
    textAlign: 'center',
    fontSize: fontValue(18),
    fontFamily: FONTS.regular,
    color: COLORS.accentLight,
  },
  text: {
    paddingLeft: '3%',
    paddingRight: '3%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

export default gestureHandlerRootHOC(PrivacyBottomSheet);
