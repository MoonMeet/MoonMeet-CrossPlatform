import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {
  Actions,
  GiftedChat,
  MessageImage,
  Send,
  Bubble,
  MessageText,
} from 'react-native-gifted-chat';
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
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import getRandomString from '../utils/generators/getRandomString';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import {bytesToSize} from '../utils/converters/bytesToSize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Image} from 'react-native-compressor';
import {MoonInputToolbar} from '../components/ChatScreen/MoonInputToolbar';

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

  let _id = uuidv4() + getRandomString(3);

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
            collectionDocs?.sort(
              (a, b) => a.createdAt.toDate() - b.createdAt.toDate(),
            ),
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
  const sendMessage = useCallback((mChatData = [], image) => {
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
              createdAt: firestore.Timestamp.fromDate(new Date()),
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
              createdAt: firestore.Timestamp.fromDate(new Date()),
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
              time: firestore.Timestamp.fromDate(new Date()),
              type: 'message',
              last_uid: myUID,
              sent_to_uid: userUID,
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
              time: firestore.Timestamp.fromDate(new Date()),
              type: 'message',
              last_uid: myUID,
            });
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      let pickedImage = `chats/${getRandomString(18)}.${image?.substring(
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
        InfoToast(
          'bottom',
          'Sending Image',
          `${
            bytesToSize(taskSnapshot?.bytesTransferred) === 'N/A'
              ? 0
              : bytesToSize(taskSnapshot?.bytesTransferred)
          } transferred out of ${bytesToSize(taskSnapshot?.totalBytes)}`,
          true,
          1000,
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
            createdAt: firestore.Timestamp.fromDate(new Date()),
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
            createdAt: firestore.Timestamp.fromDate(new Date()),
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
        firestore()
          .collection('chats')
          .doc(auth()?.currentUser?.uid)
          .collection('discussions')
          .doc(userUID)
          .set({
            to_first_name: userFirstName,
            to_last_name: userLastName,
            to_message_image: uploadedImageURL,
            to_avatar: userAvatar,
            time: firestore.Timestamp.fromDate(new Date()),
            type: 'image',
            last_uid: myUID,
            sent_to_uid: userUID,
          });
        firestore()
          .collection('chats')
          .doc(userUID)
          .collection('discussions')
          .doc(auth()?.currentUser?.uid)
          .set({
            to_first_name: myFirstName,
            to_last_name: myLastName,
            to_message_image: uploadedImageURL,
            to_avatar: myAvatar,
            time: firestore.Timestamp.fromDate(new Date()),
            type: 'image',
            last_uid: myUID,
          });
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
              icon={<MaterialIcons name="home" />}
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
        renderMessageImage={props => {
          return (
            <MessageImage
              {...props}
              containerStyle={{
                ...props.containerStyle,
              }}
              imageStyle={{
                width: widthPercentageToDP(50),
                height: heightPercentageToDP(20),
                borderRadius: 13,
                margin: 3,
                resizeMode: 'cover',
              }}
            />
          );
        }}
        renderMessageText={props => {
          return (
            <MessageText
              {...props}
              textStyle={{
                left: {color: COLORS.black},
                right: {color: COLORS.white},
              }}
            />
          );
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: COLORS.accentLight,
                },
                left: {
                  backgroundColor: COLORS.chats.leftBubble,
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => <MoonInputToolbar {...props} />}
        renderSend={props => {
          return (
            <Send {...props}>
              <MaterialIcons
                name="send"
                color={COLORS.darkGrey}
                size={26}
                style={{
                  right: widthPercentageToDP(0.125),
                  bottom: heightPercentageToDP(1),
                }}
              />
            </Send>
          );
        }}
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
                    .then(async image => {
                      /*const compressingResult = await Image.compress(
                        image?.path,
                        {
                          compressionMethod: 'auto',
                        },
                      );*/
                      sendMessage([], image?.path);
                    })
                    .catch(() => {});
                },
                Cancel: props => {
                  console.log('Cancel');
                },
              }}
              icon={() => (
                <MaterialIcons
                  name={'add'}
                  size={28}
                  color={COLORS.black}
                  style={{
                    left: widthPercentageToDP(0.125),
                    bottom: heightPercentageToDP(0.125),
                    opacity: 0.4,
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
