/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import {fontValue} from '../../../config/Dimensions';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface StoryActionSheetInterface {
  sheetRef?: Ref | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
  hideModal: () => void;
  onCopySelected: () => void | undefined;
  onDeleteSelected: () => void | undefined;
  onSaveSelected: () => void | undefined;
  showSave: boolean;
  currentStoryUID: string;
}

const StoryActionSheet = (props: StoryActionSheetInterface) => {
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
        style={{flex: 1, backgroundColor: COLORS.primaryLight}}
        onLayout={handleContentLayout}>
        <Text
          style={{
            fontSize: fontValue(22.5),
            fontFamily: FONTS.regular,
            color: COLORS.accentLight,
            textAlign: 'center',
          }}>
          Story Actions
        </Text>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          onPress={() => {
            props?.onCopySelected();
          }}
          style={styles.optionContainer}>
          <MaterialCommunityIcons
            name="content-copy"
            size={25 - 0.1 * 25}
            style={styles.arrowStyle}
          />
          <Text
            style={{
              fontSize: fontValue(20),
              fontFamily: FONTS.regular,
              color: COLORS.black,
              opacity: 0.9,
            }}>
            Copy Text
          </Text>
        </Pressable>
        {props?.showSave ? (
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={() => {
              props?.onSaveSelected();
            }}
            style={styles.optionContainer}>
            <MaterialCommunityIcons
              name="file-download-outline"
              size={25}
              style={styles.arrowStyle}
            />
            <Text
              style={{
                fontSize: fontValue(20),
                fontFamily: FONTS.regular,
                color: COLORS.black,
                opacity: 0.9,
              }}>
              Save Image
            </Text>
          </Pressable>
        ) : (
          <></>
        )}
        {auth()?.currentUser?.uid === props?.currentStoryUID ? (
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={() => {
              props?.onDeleteSelected();
            }}
            style={styles.optionContainer}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={25}
              style={styles.arrowStyle}
            />
            <Text
              style={{
                fontSize: fontValue(20),
                fontFamily: FONTS.regular,
                color: COLORS.black,
                opacity: 0.9,
              }}>
              Delete Story
            </Text>
          </Pressable>
        ) : (
          <></>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2.25%',
  },
  arrowStyle: {
    marginRight: '2%',
    opacity: 0.6,
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

export default StoryActionSheet;
