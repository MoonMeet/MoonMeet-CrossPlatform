/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {FONTS, COLORS} from '../../config/Miscellaneous';
import {fontValue, heightPercentageToDP} from '../../config/Dimensions';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {uniqBy} from 'lodash';
import {DecryptAES} from '../../utils/crypto/cryptoTools';
import {PurpleBackground} from '../../index.d';
import firestore from '@react-native-firebase/firestore';

const MessagesList = ({ListData}) => {
  const navigation = useNavigation();
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading('center')}>No Chats, yet.</Text>
        <Text style={styles.subheading('center')}>
          Discover new people to chat with them.
        </Text>
      </View>
    );
  };

  const messageText = item => {
    if (
      item?.typing &&
      firestore.Timestamp.fromDate(new Date())?.toDate() -
        item?.typing?.toDate() <
        10000
    ) {
      return 'typing...';
    } else if (item?.type === 'message') {
      let decryptedMessage = DecryptAES(item?.to_message_text);
      let messageLength = decryptedMessage?.length;
      let message =
        item?.last_uid === auth()?.currentUser?.uid
          ? `You: ${decryptedMessage}`
          : `${decryptedMessage}`;
      let modifiedtext =
        messageLength < 30 ? message : message?.substring(0, 30) + '...';
      return modifiedtext;
    } else if (item?.type === 'image') {
      let message =
        item?.last_uid === auth()?.currentUser?.uid
          ? 'You sent an image'
          : 'Sent an image';
      return message;
    } else {
      return `Start chatting with ${item?.to_first_name}.`;
    }
  };

  return (
    <FlatList
      style={{flex: 1}}
      data={uniqBy(ListData, 'id')}
      ListEmptyComponent={listEmptyComponent}
      contentContainerStyle={{
        paddingStart: '1%',
        paddingEnd: '2%',
        paddingBottom: heightPercentageToDP(10),
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={10}
      keyExtractor={item => item?.id}
      renderItem={({item}) => (
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
              padding: '2%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.heading('left', item?.read)}>
              {item?.to_first_name + ' ' + item?.to_last_name}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.subheading('left', true, item?.read)}>
              {messageText(item)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.subheading('right', false, item?.read)}>
              {moment(item.time?.toDate())?.format('MMM ddd HH:MM A')}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  userHaveStory: {
    borderWidth: /*1.5*/ 0,
    borderColor: COLORS.accentLight,
    overflow: 'hidden',
  },
  heading: (align, isRead) => {
    return {
      fontSize: 16,
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  },
  subheading: (align, isMessage, isRead) => {
    return {
      fontSize: isMessage ? fontValue(14) : fontValue(11.5),
      paddingTop: '1%',
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  },
  emptyView: {
    marginTop: 8 - 0.1 * 8,
    flex: 1,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    alignContent: 'center',
  },
});

export default MessagesList;
