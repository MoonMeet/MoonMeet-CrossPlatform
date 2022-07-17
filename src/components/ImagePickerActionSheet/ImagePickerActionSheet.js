import React, {useMemo} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import CameraImage from '../../assets/images/photo-camera.png';
import GalleryImage from '../../assets/images/photo-library.png';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {fontValue} from '../../config/Dimensions';

interface imagePickerInterface {
  sheetRef?: Ref | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
  onCameraPress: (() => void) | undefined;
  onFilePicker: (() => void) | undefined;
}

const ImagePickerActionSheet = (props: imagePickerInterface) => {
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
  return (
    <BottomSheetModal
      ref={props?.sheetRef}
      index={props?.index}
      snapPoints={props?.snapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={true}
      handleHeight={animatedHandleHeight}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{
          backgroundColor: COLORS.primaryLight,
          flex: 1,
        }}>
        <View>
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
              props?.onCameraPress();
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
              props?.onFilePicker();
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
        </View>
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
