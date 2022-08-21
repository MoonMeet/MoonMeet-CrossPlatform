/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import Modal from 'react-native-modal';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import CopyImage from '../../../assets/images/copy.png';
import DeleteImage from '../../../assets/images/delete.png';
import Downloadimage from '../../../assets/images/download.png';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../config/Dimensions';

interface StoryActionSheetInterface {
  hideModal: Function;
  onCopySelected: Function;
  onDeleteSelected: Function;
  onSaveSelected: Function;
  showSave: Boolean;
  currentStoryUID: String;
  isVisible: boolean;
}

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
                fontSize: fontValue(18),
                fontFamily: FONTS.regular,
                color: COLORS.black,
                opacity: 0.4,
              }}>
              Copy Text
            </Text>
          </Pressable>
          {props.showSave ? (
            <Pressable
              android_ripple={{color: COLORS.rippleColor}}
              onPress={() => {
                props.onSaveSelected();
                props.hideModal();
              }}
              style={styles.optionContainer}>
              <Image source={Downloadimage} style={styles.arrowStyle} />
              <Text
                style={{
                  fontSize: fontValue(18),
                  fontFamily: FONTS.regular,
                  color: COLORS.black,
                  opacity: 0.4,
                }}>
                Save Image
              </Text>
            </Pressable>
          ) : (
            <View />
          )}
          {auth()?.currentUser.uid == props.currentStoryUID ? (
            <Pressable
              android_ripple={{color: COLORS.rippleColor}}
              onPress={() => {
                props.onDeleteSelected();
                props.hideModal();
              }}
              style={styles.optionContainer}>
              <Image source={DeleteImage} style={styles.arrowStyle} />
              <Text
                style={{
                  fontSize: fontValue(18),
                  fontFamily: FONTS.regular,
                  color: COLORS.black,
                  opacity: 0.4,
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
    height: heightPercentageToDP(0.4),
    borderRadius: 2.5,
    alignSelf: 'center',
    width: widthPercentageToDP(12.5),
    backgroundColor: COLORS.controlNormal,
    marginBottom: heightPercentageToDP(2.5),
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    padding: heightPercentageToDP(0.5),
  },
  arrowStyle: {
    marginRight: heightPercentageToDP(0.5),
    tintColor: COLORS.black,
    opacity: 0.4,
    height: 24,
    width: 24,
  },
});

export default StoryActionSheet;
