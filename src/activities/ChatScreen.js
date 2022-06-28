/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {ActivityIndicator, Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GiftedChat} from 'react-native-gifted-chat';
import {v4 as uuidv4} from 'uuid';

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
        const collectionDocs = collectionSnapshot?.docs.map(subMap => ({
          ...subMap?.data(),
          id: subMap?.id,
        }));
        const messages = Object.values(
          collectionDocs.sort((a, b) => a.createdAt - b.createdAt),
        ).reverse();
        setChatData(messages);
        setLoading(false);
      });
    return () => {
      userSubscribe();
      mySubscribe();
      messagesSubscribe();
    };
  }, [destinedUser]);

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
          last_message_first_name: userFirstName,
          last_message_last_name: userLastName,
          last_message_text: mMessageText,
          last_message_avatar: userAvatar,
          last_message_time: Date.now(),
          last_message_type: 'message',
          last_message_uid: userUID,
        });
      firestore()
        .collection('chats')
        .doc(userUID)
        .collection('discussions')
        .doc(auth()?.currentUser?.uid)
        .set({
          last_message_first_name: myFirstName,
          last_message_last_name: myLastName,
          last_message_text: mMessageText,
          last_message_avatar: myAvatar,
          last_message_time: Date.now(),
          last_message_type: 'message',
          last_message_uid: myUID,
        });
    }
  });

  return (
    <BaseView>
      <View style={styles.header}>
        <TouchableRipple
          rippleColor={COLORS.rippleColor}
          borderless={false}
          onPress={() => {
            navigation.goBack();
          }}>
          <Avatar.Icon
            icon={BackImage}
            size={40}
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
      <View
        style={{
          width: '100%',
          height: heightPercentageToDP(0.125),
          backgroundColor: COLORS.controlNormal,
        }}
      />
      <GiftedChat
        inverted={true}
        text={mMessageText}
        isLoadingEarlier={isLoading}
        renderLoading={() => (
          <View style={{flex: 1, justifyContent: 'center'}}>
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
  header: {
    height: heightPercentageToDP(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  userFullName: {
    fontSize: fontValue(15),
    paddingStart: widthPercentageToDP(2),
    alignSelf: 'center',
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
