import React from 'react';
import Modal from 'react-native-modal';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import CameraImage from '../../assets/images/photo-camera.png';
import GalleryImage from '../../assets/images/photo-library.png';

interface imagePickerInterface {
  hideModal: (() => void) | undefined;
  onCameraPress: (() => void) | undefined;
  onFilePicker: (() => void) | undefined;
  isVisible: boolean;
}

const ImagePickerActionSheet = (props: imagePickerInterface) => {
  return (
    <Modal
      swipeDirection={'down'}
      onBackdropPress={props?.hideModal}
      onSwipeComplete={props?.hideModal}
      useNativeDriverForBackdrop
      style={{margin: 0}}
      animationOut={'slideOutDown'}
      animationIn={'slideInUp'}
      backdropOpacity={0.5}
      isVisible={props.isVisible}>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          top: '70%',
          padding: '3%',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            marginTop: '1%',
          }}>
          <View style={styles.greyPiece} />
          <Text
            style={{
              fontSize: 23,
              fontFamily: FONTS.regular,
              color: COLORS.accentLight,
              paddingBottom: '4%',
            }}>
            Choose Photo
          </Text>
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={() => {
              props?.onCameraPress();
              props?.hideModal();
            }}
            style={styles.optionContainer}>
            <Image source={CameraImage} style={styles.arrowStyle} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.regular,
                color: COLORS.black,
              }}>
              Take photo
            </Text>
          </Pressable>
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={() => {
              props?.onFilePicker();
              props?.hideModal();
            }}
            style={styles.optionContainer}>
            <Image source={GalleryImage} style={styles.arrowStyle} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.regular,
                color: COLORS.black,
              }}>
              Upload from Gallery
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  greyPiece: {
    height: '2.5%',
    borderRadius: 2.5,
    alignSelf: 'center',
    width: '15%',
    backgroundColor: COLORS.controlNormal,
    marginBottom: 30,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2%',
  },
  arrowStyle: {
    marginRight: '2%',
    tintColor: COLORS.black,
    opacity: 0.4,
    height: 24,
    width: 24,
  },
});

export default ImagePickerActionSheet;
