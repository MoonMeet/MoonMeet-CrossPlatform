/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {FONTS, COLORS} from '../../../config/Miscellaneous';
import {fontValue} from '../../../config/Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {waitForAnd} from '../../../utils/timers/delay';

const ChatOptionsBottomSheet = ({
  sheetRef,
  snapPoints,
  index,
  currentMessage,
  deleteConversationAlert,
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

  const {dismissAll} = useBottomSheetModal();

  const updateCurrentMessageAsUnread = useCallback(async () => {
    const messageRef = firestore()
      .collection('chats')
      .doc(auth()?.currentUser?.uid)
      .collection('discussions')
      .get();
    const collectionSnapshot = await messageRef;
    collectionSnapshot?.docs.map(documentSnapshot => {
      if (documentSnapshot?.id === currentMessage?.id) {
        documentSnapshot?.ref?.update({read: false});
      }
    });
  }, []);

  const updateCurrentMessageAsRead = useCallback(async () => {
    const messageRef = firestore()
      .collection('chats')
      .doc(auth()?.currentUser?.uid)
      .collection('discussions')
      .get();
    const collectionSnapshot = await messageRef;
    collectionSnapshot?.docs?.map(documentSnapshot => {
      if (documentSnapshot?.id === currentMessage?.id) {
        documentSnapshot?.ref?.update({read: true});
      }
    });
  }, []);

  return (
    <>
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
            Chat Options
          </Text>
          {currentMessage?.read ? (
            <Pressable
              android_ripple={{color: COLORS.rippleColor}}
              onPress={() => {
                updateCurrentMessageAsUnread().finally(() => dismissAll());
              }}
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
              onPress={() => {
                updateCurrentMessageAsRead().finally(() => dismissAll());
              }}
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
            onPress={() => {
              deleteConversationAlert(true);
              waitForAnd(0).finally(() => dismissAll());
            }}
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
    </>
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

export default React.memo(ChatOptionsBottomSheet);
