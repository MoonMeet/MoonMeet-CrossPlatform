/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useMemo} from 'react';
import {Image, Pressable, StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import CameraImage from '../../assets/images/photo-camera.png';
import GalleryImage from '../../assets/images/photo-library.png';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {fontValue} from '../../config/Dimensions';

const ImagePickerActionSheet = ({
  sheetRef,
  snapPoints,
  index,
  onCameraPress,
  onFilePicker,
}) => {
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
        onLayout={handleContentLayout}
        style={{
          backgroundColor: COLORS.primaryLight,
          flex: 1,
        }}>
        <Text
          style={{
            fontSize: fontValue(22.5),
            fontFamily: FONTS.regular,
            color: COLORS.accentLight,
            textAlign: 'center',
          }}>
          Choose Photo
        </Text>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          onPress={() => {
            onCameraPress();
          }}
          style={styles.optionContainer}>
          <Image source={CameraImage} style={styles.arrowStyle} />
          <Text
            style={{
              fontSize: fontValue(20),
              fontFamily: FONTS.regular,
              color: COLORS.black,
              opacity: 0.9,
            }}>
            Take Photo
          </Text>
        </Pressable>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          onPress={() => {
            onFilePicker();
          }}
          style={styles.optionContainer}>
          <Image source={GalleryImage} style={styles.arrowStyle} />
          <Text
            style={{
              fontSize: fontValue(20),
              fontFamily: FONTS.regular,
              color: COLORS.black,
              opacity: 0.9,
            }}>
            Upload from Gallery
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2.5%',
  },
  arrowStyle: {
    marginRight: '2%',
    tintColor: COLORS.black,
    opacity: 0.4,
    height: 25,
    width: 25,
  },
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
});

export default ImagePickerActionSheet;
