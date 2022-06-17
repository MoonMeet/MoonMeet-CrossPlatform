import React from 'react';

import Modal from 'react-native-modal';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import CopyImage from '../../assets/images/copy.png';

interface StoryActionSheetInterface {
  hideModal: Function;
  onCopySelected: Function;
  onDeleteSelected: Function;
  currentStoryUID: String;
  isVisible: boolean;
}

const GalleryImage = require('../../assets/images/photo-library.png');

const StoryActionSheet = (props: StoryActionSheetInterface) => {
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
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            marginTop: '1%',
          }}>
          <View style={styles.greyPiece} />
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={() => {
              props.onCopySelected();
              props.hideModal();
            }}
            style={styles.optionContainer}>
            <Image source={CopyImage} style={styles.arrowStyle} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.regular,
                color: COLORS.black,
              }}>
              Copy Text
            </Text>
          </Pressable>
          {auth()?.currentUser.uid == props.currentStoryUID ? (
            <Pressable
              android_ripple={{color: COLORS.rippleColor}}
              onPress={() => {
                props.onDeleteSelected();
                props.hideModal();
              }}
              style={styles.optionContainer}>
              <Image source={GalleryImage} style={styles.arrowStyle} />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: FONTS.regular,
                  color: COLORS.black,
                }}>
                Delete Story
              </Text>
            </Pressable>
          ) : (
            <View />
          )}
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

export default React.memo(StoryActionSheet);
