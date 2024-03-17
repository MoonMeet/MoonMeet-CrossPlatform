/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useMemo} from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';
import {fontValue} from 'config/Dimensions.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ChatOptionsBottomSheet {
  sheetRef: any;
  snapPoints: any;
  index: number;
  currentMessage: CurrentMessage;
  unReadFunction: (event: GestureResponderEvent) => void;
  readFunction: (event: GestureResponderEvent) => void;
  deleteFunction: (event: GestureResponderEvent) => void;
}

interface CurrentMessage {
  read: boolean;
}

const ChatOptionsBottomSheet = (props: ChatOptionsBottomSheet) => {
  const sheetStyle = useMemo(
    () => ({
      padding: 1,
      shadowColor: COLORS.black,
    }),
    [],
  );

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
      ref={props?.sheetRef}
      index={props?.index}
      snapPoints={props?.snapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
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
          Chat Options
        </Text>
        {props?.currentMessage?.read ? (
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={props?.unReadFunction}
            style={styles.optionContainer}>
            <MaterialIcons
              name="mark-chat-unread"
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
              Mark as unread
            </Text>
          </Pressable>
        ) : (
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            onPress={props?.readFunction}
            style={styles.optionContainer}>
            <MaterialIcons
              name="mark-chat-read"
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
              Mark as read
            </Text>
          </Pressable>
        )}
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          onPress={props?.deleteFunction}
          style={styles.optionContainer}>
          <MaterialIcons
            name="delete"
            size={27.5 - 0.1 * 27.5}
            style={styles.arrowStyle}
          />
          <Text
            style={{
              fontSize: fontValue(20),
              fontFamily: FONTS.regular,
              color: COLORS.black,
              opacity: 0.9,
            }}>
            Delete conversation
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
    opacity: 0.6,
  },
});

export default React.memo(ChatOptionsBottomSheet);
