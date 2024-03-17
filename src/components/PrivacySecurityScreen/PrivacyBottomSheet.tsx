/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {Ref, useCallback, useMemo} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';
import {RadioButton, Text} from 'react-native-paper';
import {fontValue, heightPercentageToDP} from 'config/Dimensions.ts';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {SharedValue} from 'react-native-reanimated';

interface PrivacyBottomSheetProps {
  sheetRef?: Ref<BottomSheetModal> | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
  phoneNumberStatus: string;
}

function isRefObject<T>(
  ref: React.Ref<T> | undefined,
): ref is React.RefObject<T> {
  return !!ref && 'current' in ref;
}

const PrivacyBottomSheet = (props: PrivacyBottomSheetProps) => {
  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      shadowColor: COLORS.black,
    }),
    [],
  );

  const [userChoice, setUserChoice] = React.useState(
    props.phoneNumberStatus === 'none' ? 'none' : 'hidden',
  );

  const {dismissAll} = useBottomSheetModal();

  const renderBackdrop = useCallback(
    (backProps: BottomSheetBackdropProps) => (
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
      ref={props.sheetRef}
      index={props.index}
      snapPoints={props.snapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        style={{
          backgroundColor: COLORS.primaryLight,
          margin: '1%',
        }}>
        <Text style={styles.topText}>Number Settings</Text>
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
                if (isRefObject(props.sheetRef)) {
                  props.sheetRef.current?.forceClose();
                }
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
      </BottomSheetView>
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
  topText: {
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
