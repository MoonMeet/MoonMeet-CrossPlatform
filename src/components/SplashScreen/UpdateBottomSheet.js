/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import RocketImage from '../../assets/images/rocket_boy.png';
import {fontValue} from '../../config/Dimensions';
import {Button} from 'react-native-paper';

const UpdateBottomSheet = ({
  sheetRef,
  sheetIndex,
  sheetSnapPoints,
  onDownloadNowPress,
  onDoItLaterPress,
  required,
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

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={sheetIndex}
      snapPoints={sheetSnapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={false}
      handleHeight={animatedHandleHeight}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{
          backgroundColor: COLORS.primaryLight,
          flex: 1,
          margin: '1%',
        }}>
        <View style={styles.imageHolder}>
          <Image
            style={{
              height: 200,
              width: 200,
              overflow: 'hidden',
            }}
            source={RocketImage}
          />
        </View>
        <Text
          style={[
            styles.text,
            {
              alignSelf: 'center',
              fontSize: fontValue(22),
              color: COLORS.accentLight,
              paddingBottom: '1%',
            },
          ]}>
          New Update Released
        </Text>
        <Button
          style={[styles.buttonStyle, {margin: '1.5%'}]}
          uppercase={false}
          color={COLORS.accentLight}
          mode="contained"
          onPress={onDownloadNowPress}>
          Download now
        </Button>
        {!required && (
          <Button
            style={[styles.buttonStyle, {margin: '1.5%'}]}
            uppercase={false}
            color={COLORS.accentLight}
            mode="outlined"
            onPress={onDoItLaterPress}>
            Do it later
          </Button>
        )}
        <Text
          style={
            (styles.text,
            {
              fontSize: fontValue(12),
              margin: '1.5%',
              color: COLORS.black,
              opacity: 0.6,
            })
          }>
          Note: Changelogs are available on Github releases or Play Store
        </Text>
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
  imageHolder: {
    alignItems: 'center',
  },
  text: {
    paddingLeft: '3%',
    paddingRight: '3%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  buttonStyle: {
    textAlign: 'center',
    fontSize: fontValue(18),
    fontFamily: FONTS.regular,
  },
});

export default UpdateBottomSheet;
