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
import {ActivityIndicator, Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import MoonChatList from '../components/ChatScreen/MoonChatList/MoonChatList';
import SendImage from '../assets/images/send.png';
import testChats from '../assets/data/json/test/testChats.json';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';

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

  /**
   * "Me" Credentials, same as "User" Credentials above, this is the data of the currently logged-in User.
   */

  const [myUID, setMyUID] = React.useState('');
  const [myFirstName, setMyFirstName] = React.useState('');
  const [myLastName, setMyLastName] = React.useState('');
  const [myAvatar, setMyAvatar] = React.useState('');
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
          message: snapshot.val().message,
          fromUID: snapshot.val().fromUID,
          toUID: snapshot.val().toUID,
          mid: snapshot.val().mid,
          time: snapshot.val().time,
        });
        setChatData(messages);
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

  const sendMessage = () => {
    if (mMessageText.length < 1) {
      // simply don't send an empty message to database, 'cause that's hows mafia works :sunglasses:
    } else {
      setMessageText(mMessageText.trim());
      const myMID = database().ref(`/messages/${myUID}/${userUID}`).push().key;
      database()
        .ref(`/messages/${myUID}/${userUID}/${myMID}`)
        .set({
          fromUID: myUID,
          toUID: userUID,
          mid: myMID,
          message: mMessageText,
          time: Date.now(),
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
      const userMID = database()
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
    }
  };

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
        <Avatar.Image size={40} source={{uri: userAvatar}} />
        <Text style={styles.userFullName}>
          {userFirstName} {userLastName}
        </Text>
      </View>
      {isLoading ? (
        <View style={{flex: 1}}>
          <ActivityIndicator
            animating={'true'}
            size={'large'}
            color={'#566193'}
          />
        </View>
      ) : (
        <MoonChatList ChatData={mChatData} userInfo={userData} />
      )}
      <View style={styles.messageInputBox}>
        <TextInput
          multiline={true}
          numberOfLines={5}
          style={{
            height: (Dimensions.get('window').height / 100) * 6.55,
            width: (Dimensions.get('window').width / 100) * 67.37,
            maxWidth: (Dimensions.get('window').width / 100) * 67.37,
            fontSize: 14,
            alignSelf: 'flex-start',
          }}
          value={mMessageText}
          onChangeText={value => {
            setMessageText(value);
          }}
          placeholder={'write a message'}
          placeholderTextColor={'#000'}
        />
        <Pressable
          hitSlop={15}
          style={{
            backgroundColor: COLORS.accentLight,
            borderRadius: 20,
            alignItems: 'center',
          }}
          onPress={sendMessage}>
          <FeatherIcon icon={'send'} size={24} color={COLORS.accentLight} />
          {/*<Avatar.Icon
            icon={SendImage}
            size={64}
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
          />*/}
        </Pressable>
      </View>
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
