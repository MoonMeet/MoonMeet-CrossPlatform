import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {FONTS, COLORS} from '../../config/Miscellaneous';
import {fontValue, heightPercentageToDP} from '../../config/Dimensions';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {uniqBy} from 'lodash';

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
    if (item?.type === 'message') {
      let messageLength = item?.to_message_text.length;
      let message =
        item?.last_uid === auth()?.currentUser?.uid
          ? `You: ${item?.to_message_text}`
          : `${item?.to_message_text}`;
      let modifiedtext =
        messageLength < 35 ? message : message.substring(0, 35) + '...';
      return modifiedtext;
    } else {
      let message =
        item?.last_uid === auth()?.currentUser?.uid
          ? 'You sent an image'
          : 'Sent an image';
      return message;
    }
  };

  return (
    <FlatList
      style={{flex: 1}}
      data={uniqBy(ListData, 'to_avatar')}
      ListEmptyComponent={listEmptyComponent}
      contentContainerStyle={{
        paddingStart: '1%',
        paddingEnd: '2%',
        paddingBottom: heightPercentageToDP(10),
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={10}
      keyExtractor={item => item?.sent_to_uid}
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
              source={{
                uri: item?.to_avatar ? item?.to_avatar : null,
              }}
            />
          </View>
          <View
            style={{
              padding: '2%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text numberOfLines={1} style={styles.heading('left', false)}>
              {item?.to_first_name + ' ' + item?.to_last_name}
            </Text>
            <Text numberOfLines={1} style={styles.subheading('left', true)}>
              {messageText(item)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.subheading('right', false)}>
              {moment(item?.time.toDate())?.calendar()}
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
  heading: align => {
    return {
      fontSize: 16,
      textAlign: align,
      color: COLORS.black,
      opacity: 0.6,
      fontFamily: FONTS.regular,
    };
  },
  subheading: (align, isMessage) => {
    return {
      fontSize: isMessage ? fontValue(14) : fontValue(12),
      paddingTop: '1%',
      textAlign: align,
      color: COLORS.black,
      opacity: 0.6,
      fontFamily: FONTS.regular,
    };
  },
  emptyView: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    alignContent: 'center',
  },
});

export default MessagesList;
