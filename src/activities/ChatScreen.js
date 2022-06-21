/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {GiftedChat} from 'react-native-gifted-chat';

const ChatScreen = () => {
  const navigation = useNavigation();
  const destinedUser = useRoute()?.params?.item;

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

  useEffect(() => {
    const userInformation = database()
      .ref(`/users/${destinedUser?.uid}`)
      .once('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().first_name &&
          snapshot.val().last_name
        ) {
          setUserData(snapshot?.val());
          setUserUID(snapshot?.val().uid);
          setUserFirstName(snapshot?.val().first_name);
          setUserLastName(snapshot?.val().last_name);
          setUserAvatar(snapshot?.val().avatar);
        }
      });
    const myInformation = database()
      .ref(`/users/${auth()?.currentUser.uid}`)
      .once('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().first_name &&
          snapshot.val().last_name
        ) {
          setMyUID(snapshot?.val().uid);
          setMyFirstName(snapshot?.val().first_name);
          setMyLastName(snapshot?.val().last_name);
          setMyAvatar(snapshot?.val().avatar);
        }
      });
    const MessagesFetch = database()
      .ref('/messages/')
      .child(myUID)
      .child(userUID)
      .on('child_added', snapshot => {
        let messages = [];
        messages.push({
          _id: snapshot?.val()._id,
          createdAt: snapshot?.val().createdAt,
          user: snapshot?.val().user,
          text: snapshot?.val().text,
        });
        console.log(messages);
        setChatData(previousMessage =>
          GiftedChat.append(previousMessage, messages),
        );
        setLoading(false);
      });
    return () => {
      database()
        .ref('/messages/')
        .child(myUID)
        .child(userUID)
        .off('child_added', MessagesFetch);
    };
  }, [destinedUser?.uid]);

  const sendMessage = useCallback((mChatData = []) => {
    if (mMessageText.length < 1) {
      // simply don't send an empty message to database, 'cause that's hows mafia works :sunglasses:
    } else {
      setMessageText(mMessageText.trim());
      setChatData(previousMessage =>
        GiftedChat.append(previousMessage, mChatData),
      );
      const myMID = database().ref(`/messages/${myUID}/${userUID}`).push().key;
      database()
        .ref(`/messages/${myUID}/${userUID}/${myMID}`)
        .set({
          _id: userUID,
          text: mMessageText,
          createdAt: Date.now(),
          user: {
            _id: userUID,
            name: myFirstName + ' ' + myLastName,
            avatar: myAvatar,
          },
        })
        .finally(() => {
          console.log(`message sent from ${myUID} to ${userUID}`);
        })
        .catch(error => {
          console.log(
            'an error has been occured during sending the message: ',
            error,
          );
        });
      /**const userMID = database()
        .ref(`/messages/${userUID}/${myUID}`)
        .push().key;
      database()
        .ref(`/messages/${userUID}/${myUID}/${userMID}`)
        .set({
          fromUID: myUID,
          toUID: userUID,
          mid: userMID,
          message: mMessageText,
          time: Date.now(),
        })
        .finally(() => {
          console.log(`message delivred also to ${myUID} from ${userUID}`);
        })
        .catch(error => {
          console.log(
            'an error has been occured during sending the message: ',
            error,
          );
        });
        */
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
        text={mMessageText}
        isLoadingEarlier={isLoading}
        onInputTextChanged={text => setMessageText(text)}
        messages={mChatData}
        onSend={messages => {
          sendMessage(messages);
          setMessageText('');
        }}
        user={{
          _id: auth()?.currentUser.uid,
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
export default React.memo(ChatScreen);
