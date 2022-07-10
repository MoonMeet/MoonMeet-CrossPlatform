import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Actions, GiftedChat} from 'react-native-gifted-chat';
import {ActivityIndicator, Avatar, TouchableRipple} from 'react-native-paper';
import {v4 as uuidv4} from 'uuid';
import BackImage from '../assets/images/back.png';
import BaseView from '../components/BaseView/BaseView';
import Spacer from '../components/Spacer/Spacer';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ActionsProps} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

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
  const sendMessage = useCallback((mChatData = [], image?: string) => {
    if (!image) {
      if (mMessageText.length < 1) {
        // simply don't send an empty message to database, 'cause that's how mafia works :sunglasses:
      } else {
        try {
          // Send message to user logic goes here.
          setMessageText(mMessageText.trim());
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
          setChatData(previousMessage =>
            GiftedChat.append(previousMessage, mChatData),
          );
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
              type: image ? 'image' : 'message',
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
              type: image ? 'image' : 'message',
              to_uid: myUID,
              from_uid: userUID,
              from_first_name: userFirstName,
              from_last_name: userLastName,
              from_avatar: userAvatar,
            });
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      let pickedImage = `chats/${auth()?.currentUser?.uid}.${image?.substring(
        image?.lastIndexOf('.') + 1,
        3,
      )}`;

      const storageRef = storage().ref(pickedImage);

      /**
       * Uploading image to Firebase Storage
       * @type {FirebaseStorageTypes.Task}
       */

      const uploadImageTask = storageRef.putFile(image);

      /**
       * Add observer to image uploading.
       */

      uploadImageTask.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot?.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`,
        );
      });

      /**
       * an async function to get {avatarUrl} and upload all user data.
       */

      uploadImageTask.then(async () => {
        const uploadedImageURL = await storage()
          .ref(pickedImage)
          .getDownloadURL();
        console.log(uploadedImageURL);
        await firestore()
          .collection('users')
          .doc(auth()?.currentUser?.uid)
          .collection('messages')
          .doc(userUID)
          .collection('discussions')
          .add({
            _id: _id,
            image: uploadedImageURL,
            createdAt: Date.now(),
            user: {
              _id: myUID,
              name: myFirstName + ' ' + myLastName,
              avatar: myAvatar,
            },
          });
        await firestore()
          .collection('users')
          .doc(userUID)
          .collection('messages')
          .doc(auth()?.currentUser?.uid)
          .collection('discussions')
          .add({
            _id: _id,
            createdAt: Date.now(),
            image: uploadedImageURL,
            user: {
              _id: myUID,
              name: myFirstName + ' ' + myLastName,
              avatar: myAvatar,
            },
          });
        setChatData(previousMessage =>
          GiftedChat.append(previousMessage, mChatData),
        );
        // Chats messages on home screen goes here
        /**await firestore()
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
            type: image ? 'image' : 'message',
            to_uid: userUID,
            from_uid: myUID,
            from_first_name: myFirstName,
            from_last_name: myLastName,
            from_avatar: myAvatar,
          });
               await firestore()
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
            type: image ? 'image' : 'message',
            to_uid: myUID,
            from_uid: userUID,
            from_first_name: userFirstName,
            from_last_name: userLastName,
            from_avatar: userAvatar,
          });*/
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
        <View style={styles.right_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={() => {
              navigation?.navigate('userProfile', {uid: userUID});
            }}>
            <Avatar.Icon
              icon={<AntDesign name="home" />}
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
          sendMessage(messages, '');
          setMessageText('');
        }}
        renderActions={props => {
          return (
            <Actions
              {...props}
              options={{
                ['Image']: props => {
                  ImagePicker.openPicker({
                    height: 1024,
                    width: 1024,
                    cropper: false,
                  })
                    .then((image: any) => {
                      sendMessage([], image?.path);
                    })
                    .catch(() => {});
                },
                Cancel: props => {
                  console.log('Cancel');
                },
              }}
              icon={() => (
                <Ionicons
                  name={'add'}
                  size={28}
                  color={COLORS.accentLight}
                  style={{
                    left: widthPercentageToDP(0.125),
                    bottom: heightPercentageToDP(0.125),
                  }}
                />
              )}
              optionTintColor={COLORS.black}
            />
          );
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
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
export default ChatScreen;
