/* eslint-disable prettier/prettier */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { ActivityIndicator, Avatar, TouchableRipple } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import BackImage from '../assets/images/back.png';
import BaseView from '../components/BaseView/BaseView';
import Spacer from '../components/Spacer/Spacer';
import {
  fontValue,
  heightPercentageToDP,
} from '../config/Dimensions';
import { COLORS, FONTS } from '../config/Miscellaneous';

const ChatScreen = () => {
  const navigation = useNavigation();
  const destinedUser = useRoute()?.params?.item;
  console.log(destinedUser);
  /**
   * "User" Credentials, we use those variables to get his data from firebase, then implement it in our App!
   */
  const [userData, setUserData] = React.useState([]);
  const [userUID, setUserUID] = React.useState('');
  const [userFirstName, setUserFirstName] = React.useState('');
  const [userLastName, setUserLastName] = React.useState('');
  const [userAvatar, setUserAvatar] = React.useState('');
  const [You, setYou] = React.useState('');

  /**
   * "Me" Credentials, same as "User" Credentials above, this is the data of the currently logged-in User.
   */

  const [myUID, setMyUID] = React.useState('');
  const [myFirstName, setMyFirstName] = React.useState('');
  const [myLastName, setMyLastName] = React.useState('');
  const [myAvatar, setMyAvatar] = React.useState('');
  const [Me, setMe] = React.useState('');
  /**
   * Message Variables
   */
  const [mMessageText, setMessageText] = React.useState('');
  const [mChatData, setChatData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  let _id = uuidv4();

  useEffect(() => {
    const userSubscribe = firestore()
      .collection('users')
      .doc(destinedUser)
      .onSnapshot(userSnapshot => {
        if (userSnapshot?.exists) {
          if (
            userSnapshot?.data()?.avatar &&
            userSnapshot?.data().first_name &&
            userSnapshot?.data()?.last_name
          ) {
            setUserData(userSnapshot?.data());
            setUserUID(userSnapshot?.data()?.uid);
            setUserFirstName(userSnapshot?.data()?.first_name);
            setUserLastName(userSnapshot?.data()?.last_name);
            setUserAvatar(userSnapshot?.data()?.avatar);
          }
        }
      });

    const mySubscribe = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(mySnapshot => {
        if (mySnapshot?.exists) {
          if (
            mySnapshot?.data()?.avatar &&
            mySnapshot?.data()?.first_name &&
            mySnapshot?.data()?.last_name
          ) {
            setMyUID(mySnapshot?.data()?.uid);
            setMyFirstName(mySnapshot?.data()?.first_name);
            setMyLastName(mySnapshot?.data()?.last_name);
            setMyAvatar(mySnapshot?.data()?.avatar);
          }
        }
      });

    const messagesSubscribe = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .collection('messages')
      .doc(destinedUser)
      .collection('discussions')
      .onSnapshot(collectionSnapshot => {
        if (!collectionSnapshot?.empty) {
          const collectionDocs = collectionSnapshot?.docs?.map(subMap => ({
            ...subMap?.data(),
            id: subMap?.id,
          }));
          const messages = Object.values(
            collectionDocs?.sort((a, b) => a.createdAt - b.createdAt),
          ).reverse();
          setChatData(messages);
        }
        setLoading(false);
      });
    return () => {
      userSubscribe();
      mySubscribe();
      messagesSubscribe();
    };
  }, [destinedUser]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendMessage = useCallback((mChatData = []) => {
    if (mMessageText.length < 1) {
      // simply don't send an empty message to database, 'cause that's hows mafia works :sunglasses:
    } else {
      // Send message to user logic goes here.
      setMessageText(mMessageText.trim());
      setChatData(previousMessage =>
        GiftedChat.append(previousMessage, mChatData),
      );
      firestore()
        .collection('users')
        .doc(auth()?.currentUser?.uid)
        .collection('messages')
        .doc(userUID)
        .collection('discussions')
        .add({
          _id: _id,
          text: mMessageText,
          createdAt: Date.now(),
          user: {
            _id: myUID,
            name: myFirstName + ' ' + myLastName,
            avatar: myAvatar,
          },
        });
      firestore()
        .collection('users')
        .doc(userUID)
        .collection('messages')
        .doc(auth()?.currentUser?.uid)
        .collection('discussions')
        .add({
          _id: _id,
          createdAt: Date.now(),
          text: mMessageText,
          user: {
            _id: myUID,
            name: myFirstName + ' ' + myLastName,
            avatar: myAvatar,
          },
        });
      // Chats messages on home screen goes here
      firestore()
        .collection('chats')
        .doc(auth()?.currentUser?.uid)
        .collection('discussions')
        .doc(userUID)
        .set({
          to_first_name: userFirstName,
          to_last_name: userLastName,
          to_message_text: mMessageText,
          to_avatar: userAvatar,
          time: Date.now(),
          type: 'message',
          to_uid: userUID,
          from_uid: myUID,
          from_first_name: myFirstName,
          from_last_name: myLastName,
          from_avatar: myAvatar,
        });
      firestore()
        .collection('chats')
        .doc(userUID)
        .collection('discussions')
        .doc(auth()?.currentUser?.uid)
        .set({
          to_first_name: myFirstName,
          to_last_name: myLastName,
          to_message_text: mMessageText,
          to_avatar: myAvatar,
          time: Date.now(),
          type: 'message',
          to_uid: myUID,
          from_uid: userUID,
          from_first_name: userFirstName,
          from_last_name: userLastName,
          from_avatar: userAvatar,
        });
    }
  });

  return (
    <BaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={() => {
              navigation?.goBack();
            }}>
            <Avatar.Icon
              icon={BackImage}
              size={37.5}
              color={COLORS.black}
              style={{
                overflow: 'hidden',
                marginRight: '-1%',
                opacity: 0.4,
              }}
              theme={{
                colors: {
                  primary: COLORS.transparent,
                },
              }}
            />
          </TouchableRipple>
          <Avatar.Image
            size={40}
            source={{uri: userAvatar ? userAvatar : null}}
          />
          <Text style={styles.userFullName}>
            {userFirstName} {userLastName}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: heightPercentageToDP(0.125),
          backgroundColor: COLORS.controlNormal,
        }}
      />
      <GiftedChat
        text={mMessageText}
        isLoadingEarlier={isLoading}
        renderLoading={() => (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: fontValue(14),
                textAlign: 'center',
                color: COLORS.black,
                opacity: 0.4,
                fontFamily: FONTS.regular,
              }}>
              Getting Messages, Hang on
            </Text>
            <Spacer height={heightPercentageToDP(2)} />
            <ActivityIndicator
              size={'large'}
              color={COLORS.accentLight}
              animating={true}
            />
          </View>
        )}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onInputTextChanged={text => setMessageText(text)}
        messages={mChatData}
        onSend={messages => {
          sendMessage(messages);
          setMessageText('');
        }}
        user={{
          _id: auth()?.currentUser?.uid,
          avatar: myAvatar,
          name: myFirstName + ' ' + myLastName,
        }}
        scrollToBottom
      />
    </BaseView>
  );
};
const styles = StyleSheet.create({
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
  },
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mid_side: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  userFullName: {
    fontSize: fontValue(16),
    paddingLeft: heightPercentageToDP(1),
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  emptyHolderHeaderText: {
    fontSize: fontValue(14),
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.6,
    fontFamily: FONTS.regular,
  },
  emptyHolderSubText: {
    fontSize: fontValue(13.5),
    paddingTop: '2%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  messageInputBox: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: COLORS.rippleColor,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: (Dimensions.get('window').width / 100) * 93.37,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
export default ChatScreen;