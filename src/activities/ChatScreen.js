/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {
  ActivityIndicator,
  Avatar,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import MoonChatList from '../components/ChatScreen/MoonChatList/MoonChatList';
import SendImage from '../assets/images/send.png';
import testChats from '../assets/data/json/test/testChats.json';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ChatScreen = () => {
  const navigation = useNavigation();
  const destinedUser = useRoute()?.params?.item;
  console.log('destinated' + destinedUser);

  /**
   * "User" Credentials, we use those variables to get his data from firebase, then implement it in our App!
   */

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
  const [mChatData, setChataData] = React.useState([]);
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
    const MessagesBase = database()
      .ref('/messages/')
      .child(myUID)
      .on('child_added', snapshot => {
        setLoading(false);
      });
    return () => {
      database()
        .ref(`/messages/${myUID}/${userUID}`)
        .off('child_added', MessagesBase);
    };
  }, [destinedUser?.uid]);

  const sendMessage = () => {
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
      .then(() => {
        console.log(`message sent from ${myUID} to ${userUID}`);
      })
      .catch(error => {
        console.log(
          'an error has been occured during sending the message: ',
          error,
        );
      });
    const userMID = database().ref(`/messages/${userUID}/${myUID}`).push().key;
    database()
      .ref(`/messages/${userUID}/${myUID}/${userMID}`)
      .set({
        fromUID: myUID,
        toUID: userUID,
        mid: userMID,
        message: mMessageText,
        time: Date.now(),
      })
      .then(() => {
        console.log(`message delivred also to ${myUID} from ${userUID}`);
      })
      .catch(error => {
        console.log(
          'an error has been occured during sending the message: ',
          error,
        );
      });
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
        <MoonChatList ChatData={mChatData} userInfo={destinedUser} />
      )}
      <View style={styles.messageInputBox}>
        <TextInput
          style={{flexGrow: 1}}
          mode="outlined"
          value={mMessageText}
          placeholder={'Type a message'}
          theme={{
            colors: {
              text: COLORS.accentLight,
              primary: COLORS.accentLight,
              backgroundColor: COLORS.rippleColor,
              placeholder: COLORS.darkGrey,
              underlineColor: '#566193',
              selectionColor: '#DADADA',
              outlineColor: '#566193',
            },
            roundness: heightPercentageToDP(3),
          }}
          onChangeText={text => {
            setMessageText(text);
          }}
        />
        <Pressable onPress={sendMessage}>
          <Avatar.Icon
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
          />
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
    padding: heightPercentageToDP(0.5),
  },
});
export default React.memo(ChatScreen);
