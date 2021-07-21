import React from 'react';
import Modal from 'react-native-modal';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';

interface imagePickerInterface {
  hideModal: Function;
  onCameraPress: Function;
  onFilePicker: Function;
  isVisible: boolean;
}

const CameraImage = require('../../assets/images/photo-camera.png');

const GalleryImage = require('../../assets/images/photo-library.png');

const ImagePickerActionSheet = (props: imagePickerInterface) => {
  return (
    <Modal
      swipeDirection={'down'}
      onBackdropPress={props.hideModal}
      onSwipeComplete={props.hideModal}
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
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}>
        <View
          style={{
            backgroundColor: 'white',
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
              props.onCameraPress();
              props.hideModal();
            }}
            style={styles.optionContainer}>
            <Image source={CameraImage} style={styles.arrowStyle} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.regular,
                color: COLORS.black,
                opacity: 0.4,
              }}>
              Take photo
            </Text>
          </Pressable>
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={() => {
              props.onFilePicker();
              props.hideModal();
            }}
            style={styles.optionContainer}>
            <Image source={GalleryImage} style={styles.arrowStyle} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.regular,
                color: COLORS.black,
                opacity: 0.4,
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
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    width: '20%',
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
    tintColor: COLORS.accentLight,
    height: 24,
    width: 24,
  },
});

export default ImagePickerActionSheet;
