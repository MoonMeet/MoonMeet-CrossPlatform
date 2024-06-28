/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2024.
 */

import React, {useCallback, useMemo, useRef} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  Paragraph,
  Portal,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {COLORS, FONTS} from 'config/Miscellaneous';
import {fontValue, heightPercentageToDP} from 'config/Dimensions';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {uniqBy} from 'lodash';
import {DecryptAES} from 'utils/crypto/cryptoTools';
import {PurpleBackground} from '../../index.d';
import firestore from '@react-native-firebase/firestore';
import ChatOptionsBottomSheet from './BottomSheet/ChatOptionsBottomSheet';
import {ThemeContext} from 'config/Theme/Context.ts';
import {ErrorToast} from '../ToastInitializer/ToastInitializer';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import {waitForAnd} from 'utils/timers/delay';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';

interface MessageListProps {
  ListData: any;
}

const MessagesList = (props: MessageListProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const chatOptionsRef = useRef<BottomSheetModal>(null);
  const sheetSnapPoints = useMemo(() => ['20%'], []);
  const [alertDialogVisible, setAlertDialogVisible] =
    React.useState<boolean>(false);

  const memorisedDialogState = useCallback(
    (value: React.SetStateAction<boolean>) => {
      return setAlertDialogVisible(value);
    },
    [],
  );

  const handlePresentModal = useCallback(() => {
    chatOptionsRef?.current?.present();
  }, []);

  const heading = (
    align: 'auto' | 'center' | 'left' | 'right' | 'justify',
    isRead: boolean,
  ) => {
    return {
      fontSize: fontValue(14),
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  };

  const subheading = (
    align: 'auto' | 'center' | 'left' | 'right' | 'justify',
    isMessage: boolean,
    isRead: boolean,
  ) => {
    return {
      fontSize: isMessage ? fontValue(14) : fontValue(11.5),
      paddingTop: heightPercentageToDP(1),
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={heading('center', false)}>No Chats, yet.</Text>
        <Text style={subheading('center', false, true)}>
          Discover new people to chat with them.
        </Text>
      </View>
    );
  };

  type Message = {
    typing?: Date;
    type?: string;
    to_message_text?: string;
    last_uid?: string;
    to_first_name?: string;
  };

  const messageText = (item: Message) => {
    if (
      item &&
      item?.typing &&
      firestore.Timestamp.fromDate(new Date())?.toDate().getTime() -
        item?.typing?.getTime() <
        10000
    ) {
      return 'typing...';
    } else if (item?.type === 'message') {
      let decryptedMessage = item?.to_message_text
        ? DecryptAES(item?.to_message_text)
        : 'failed to load the message';
      let messageLength = decryptedMessage?.length;
      let message =
        item?.last_uid === auth()?.currentUser?.uid
          ? `You: ${decryptedMessage}`
          : `${decryptedMessage}`;
      return messageLength < 30 ? message : message?.substring(0, 30) + '...';
    } else if (item?.type === 'image') {
      return item?.last_uid === auth()?.currentUser?.uid
        ? 'You sent an image'
        : 'Sent an image';
    } else {
      return `Start chatting with ${item?.to_first_name}.`;
    }
  };

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const {isThemeDark} = React.useContext(ThemeContext);

  const {dismissAll} = useBottomSheetModal();

  const updateCurrentMessageAsUnread = useCallback(
    async (currentMessage: {id: string}) => {
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
    },
    [],
  );

  const updateCurrentMessageAsRead = useCallback(
    async (currentMessage: {id: string}) => {
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
    },
    [],
  );

  interface Item {
    id?: string;
    last_uid?: string;
    sent_to_uid?: string;
    to_avatar?: string;
    to_first_name?: string;
    to_last_name?: string;
    read?: boolean;
    time?: Array<string>;
  }

  const renderItem = ({item, index}: {item: Item; index: number}) => {
    let readValue = false;
    if (typeof item?.read !== 'undefined') {
      readValue = item.read;
    }
    return (
      <>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          onPress={() => {
            navigation?.navigate('chat', {
              item:
                item?.last_uid === auth()?.currentUser?.uid
                  ? item?.sent_to_uid
                  : item?.last_uid,
            });
          }}
          onLongPress={() => {
            setCurrentIndex(index);
            handlePresentModal();
          }}
          style={{
            flexDirection: 'row',
            padding: '2%',
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Avatar.Image
              style={styles.userHaveStory}
              size={52.5}
              source={
                item?.to_avatar
                  ? {
                      uri: item?.to_avatar,
                    }
                  : PurpleBackground
              }
            />
          </View>
          <View
            style={{
              flexGrow: 1,
              padding: '2%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={heading('left', readValue)}>
              {item?.to_first_name + ' ' + item?.to_last_name}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={subheading('left', true, readValue)}>
              {messageText(item)}
            </Text>
          </View>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={subheading('right', false, readValue)}>
              {moment(item?.time?.seconds)?.format('MMM ddd HH:MM A')}
            </Text>
          </View>
        </Pressable>
        <Divider leftInset />
      </>
    );
  };

  const messageDataList = (uniqBy(props.ListData, 'id') as Item[]).map(
    (item: Item) => ({
      id: item?.id,
      last_uid: item?.last_uid,
      sent_to_uid: item?.sent_to_uid,
      to_avatar: item?.to_avatar,
      to_first_name: item?.to_first_name,
      to_last_name: item?.to_last_name,
      read: item?.read,
      time: item?.time,
    }),
  );

  return (
    <>
      <FlatList
        data={messageDataList}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{
          paddingStart: '0.5%',
          paddingEnd: '0.5%',
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={10}
        keyExtractor={(item, index) =>
          item?.id || `${item.to_first_name}_${item.to_last_name}_${index}`
        }
        renderItem={renderItem}
        nestedScrollEnabled
      />
      <>
        <Portal>
          <Dialog
            dismissable={true}
            visible={alertDialogVisible}
            onDismiss={() => memorisedDialogState(false)}>
            <Dialog.Title
              style={{
                color: isThemeDark ? COLORS.white : COLORS.black,
                opacity: 0.9,
              }}>
              Delete this entire conversation?
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph
                style={{
                  fontSize: fontValue(14),
                  color: isThemeDark ? COLORS.white : COLORS.black,
                  opacity: isThemeDark ? 0.8 : 0.6,
                }}>
                Once you delete your copy of the conversation, it can't be
                undone.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                uppercase={false}
                mode={'outlined'}
                textColor={
                  isThemeDark ? COLORS.redDarkError : COLORS.redLightError
                }
                style={{margin: '0.5%'}}
                onPress={async () => {
                  memorisedDialogState(false);
                  try {
                    const lastChatsRef = firestore()
                      .collection('chats')
                      .doc(auth()?.currentUser?.uid)
                      .collection('discussions')
                      .doc(props.ListData[currentIndex]?.id);
                    await lastChatsRef?.delete();
                    const discussionsRef = await firestore()
                      .collection('users')
                      .doc(auth()?.currentUser?.uid)
                      .collection('messages')
                      .doc(props.ListData[currentIndex]?.id)
                      .collection('discussions')
                      .get();
                    const batchDelete = firestore().batch();
                    discussionsRef?.forEach(documentSnapshot => {
                      batchDelete?.delete(documentSnapshot?.ref);
                    });
                    return batchDelete?.commit();
                  } catch (e) {
                    if (__DEV__) {
                      console?.error(e);
                    }
                    ErrorToast(
                      'bottom',
                      'Failed to delete entire conversation',
                      `${e}`,
                      true,
                      1500,
                    );
                  }
                }}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </>
      <>
        <ChatOptionsBottomSheet
          sheetRef={chatOptionsRef}
          index={0}
          snapPoints={sheetSnapPoints}
          currentMessage={props.ListData[currentIndex]}
          unReadFunction={() => {
            updateCurrentMessageAsUnread(props.ListData[currentIndex]).then(
              () => {
                waitForAnd(0).then(() => dismissAll());
              },
            );
          }}
          readFunction={() =>
            updateCurrentMessageAsRead(props.ListData[currentIndex]).then(() =>
              waitForAnd(0).then(() => dismissAll()),
            )
          }
          deleteFunction={() => {
            waitForAnd(0).then(() => {
              memorisedDialogState(true);
              dismissAll();
            });
          }}
        />
      </>
    </>
  );
};

const styles = StyleSheet.create({
  userHaveStory: {
    overflow: 'hidden',
  },
  emptyView: {
    marginTop: 12 - 0.1 * 12,
    flex: 1,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    alignContent: 'center',
  },
});

export default MessagesList;
