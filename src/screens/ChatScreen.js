import React, {useCallback, useEffect, useLayoutEffect, useMemo} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {
  Actions,
  GiftedChat,
  MessageImage,
  Send,
  Bubble,
  MessageText,
  Composer,
} from 'react-native-gifted-chat';
import {Avatar} from 'react-native-paper';
import {v4 as uuidv4} from 'uuid';
import BaseView from '../components/BaseView/BaseView';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import getRandomString from '../utils/generators/getRandomString';
import {
  ErrorToast,
  InfoToast,
} from '../components/ToastInitializer/ToastInitializer';
import {bytesToSize} from '../utils/converters/bytesToSize';
import MaterialIcons from 'react-native-vector-icons/FontAwesome5';
import {Image} from 'react-native-compressor';
import {MoonInputToolbar} from '../components/ChatScreen/MoonInputToolbar';
import {PurpleBackground} from '../index.d';
import {reverse, sortBy} from 'lodash';
import EmojiPicker from 'rn-emoji-keyboard';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import {ChatSettingsMMKV} from '../config/MMKV/ChatSettingsMMKV';
import NetInfo from '@react-native-community/netinfo';
import {UserDataMMKV} from '../config/MMKV/UserDataMMKV';

const ChatScreen = () => {
  const navigation = useNavigation();

  const stackRoute = useRoute();
  const destinedUser = useMemo(() => stackRoute?.params?.item, []);

  const [imageViewVisible, setImageViewVisible] = React.useState(false);
  /**
   * "User" Credentials, we use those variables to get his data from firebase, then implement it in our App!
   */
  const [userData, setUserData] = React.useState([]);
  const [userUID, setUserUID] = React.useState('');
  const [userFirstName, setUserFirstName] = React.useState('');
  const [userLastName, setUserLastName] = React.useState('');
  const [userAvatar, setUserAvatar] = React.useState('');
  const [userActiveStatus, setUserActiveStatus] = React.useState('');
  const [userActiveTime, setUserActiveTime] = React.useState('');

  /**
   * "Me" Credentials, same as "User" Credentials above, this is the data of the currently logged-in User.
   */

  const [myUID, setMyUID] = React.useState('');
  const [myFirstName, setMyFirstName] = React.useState('');
  const [myLastName, setMyLastName] = React.useState('');
  const [myAvatar, setMyAvatar] = React.useState('');

  const Me = JSON?.parse(UserDataMMKV?.getString('Me'));

  /**
   * Message Variables
   */
  const [mMessageText, setMessageText] = React.useState('');
  const [mChatData, setChatData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  let _id = uuidv4() + getRandomString(3);
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePick = emojiObject => {
    setMessageText(mMessageText + emojiObject?.emoji);
  };

  useLayoutEffect(() => {
    if (!isLoading) {
      if (ChatSettingsMMKV?.contains(destinedUser)) {
        if (ChatSettingsMMKV?.getString(destinedUser)) {
          setMessageText(ChatSettingsMMKV?.getString(destinedUser));
        }
      }
    }
    navigation?.setOptions({
      headerTitle: props => (
        <ChatTitle
          {...props}
          firstName={userFirstName}
          lastName={userLastName}
          avatar={userAvatar}
          activeStatus={userActiveStatus}
          activeTime={userActiveTime}
        />
      ),
    });

    return () => {};
  }, [
    destinedUser,
    isLoading,
    navigation,
    userActiveStatus,
    userActiveTime,
    userAvatar,
    userFirstName,
    userLastName,
  ]);

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
            setUserActiveStatus(userSnapshot?.data()?.active_status);

            if (userSnapshot?.data()?.active_time === 'Last seen recently') {
              setUserActiveTime(userSnapshot?.data()?.active_time);
            } else {
              setUserActiveTime(userSnapshot?.data()?.active_time?.toDate());
            }
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
          let collectionDocs = collectionSnapshot?.docs?.map(subMap => ({
            ...subMap?.data(),
            id: subMap?.id,
            user: {
              _id:
                subMap?.data()?.user?._id === auth()?.currentUser?.uid
                  ? auth()?.currentUser?.uid
                  : destinedUser,
              name:
                subMap?.data()?.user?._id === auth()?.currentUser?.uid
                  ? Me?.first_name + ' ' + Me?.last_name
                  : userFirstName + ' ' + userLastName,
              avatar:
                subMap?.data()?.user?._id === auth()?.currentUser?.uid
                  ? Me?.avatar
                  : userAvatar,
            }, // we must complete the full object as it is destroyed when adding one or more item.
          }));
          collectionDocs = sortBy(collectionDocs, [docs => docs?.createdAt]);
          collectionDocs = reverse(collectionDocs);
          setChatData(collectionDocs);
        }
        setLoading(false);
      });
    return () => {
      userSubscribe();
      mySubscribe();
      messagesSubscribe();
    };
  }, [
    Me?.avatar,
    Me?.first_name,
    Me?.last_name,
    destinedUser,
    userAvatar,
    userFirstName,
    userLastName,
  ]);

  const ChatTitle = ({
    firstName,
    lastName,
    avatar,
    activeTime,
    activeStatus,
  }) => {
    return (
      <Pressable
        style={{
          flex: 1,
          flexDirection: 'row',
          marginLeft: -10 - 0.1 * -10,
        }}>
        <Avatar.Image
          source={avatar ? {uri: avatar} : PurpleBackground}
          size={38}
          style={{
            alignSelf: 'center',
          }}
          theme={{
            colors: {
              primary: COLORS.rippleColor,
            },
          }}
        />
        <View style={{flexDirection: 'column', marginLeft: 5 - 0.1 * 5}}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              fontSize: fontValue(16),
              fontFamily: FONTS.regular,
              color: COLORS.black,
              opacity: 0.9,
            }}>
            {`${firstName}${' '}${lastName}`}
          </Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              fontSize: fontValue(14),
              fontFamily: FONTS.regular,
              color: COLORS.black,
              opacity: 0.4,
            }}>
            {activeStatus === 'normal'
              ? firestore?.Timestamp?.fromDate(new Date())?.toDate() -
                  activeTime >
                86400000
                ? `last seen on ${moment(activeTime)?.format('YYYY MMMM DD')}`
                : `last seen on ${moment(activeTime)?.format('HH:MM A')}`
              : 'Last seen recently'}
          </Text>
        </View>
      </Pressable>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendMessage = useCallback(async (mChatData = [], image) => {
    let connectionStatus = await NetInfo?.fetch();
    if (connectionStatus?.isConnected) {
    } else {
      ErrorToast(
        'bottom',
        'Intternet connection required',
        'Please enable Wi-Fi or Mobile data to send messages',
        true,
        1000,
      );
    }
    if (!image) {
      if (mMessageText?.trim()?.length < 1) {
        // simply don't send an empty message to database, 'cause that's how mafia works :sunglasses:
      } else {
        try {
          // Send message to user logic goes here.
          setMessageText(mMessageText?.trim()); // Message text already trimmed here!
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .collection('messages')
            .doc(destinedUser)
            .collection('discussions')
            .add({
              _id: _id,
              text: mMessageText,
              createdAt: Date.now(),
              user: {
                _id: auth()?.currentUser?.uid,
              },
            });
          firestore()
            .collection('users')
            .doc(destinedUser)
            .collection('messages')
            .doc(auth()?.currentUser?.uid)
            .collection('discussions')
            .add({
              _id: _id,
              createdAt: Date.now(),
              text: mMessageText,
              user: {
                _id: auth()?.currentUser?.uid,
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
            .doc(destinedUser)
            .set({
              to_first_name: userFirstName,
              to_last_name: userLastName,
              to_message_text: mMessageText,
              to_avatar: userAvatar,
              time: firestore?.Timestamp?.fromDate(new Date()),
              type: 'message',
              last_uid: auth()?.currentUser?.uid,
              sent_to_uid: destinedUser,
            });
          firestore()
            .collection('chats')
            .doc(destinedUser)
            .collection('discussions')
            .doc(auth()?.currentUser?.uid)
            .set({
              to_first_name: Me?.first_name,
              to_last_name: Me?.last_name,
              to_message_text: mMessageText,
              to_avatar: Me?.avatar,
              time: firestore?.Timestamp?.fromDate(new Date()),
              type: 'message',
              last_uid: auth()?.currentUser?.uid,
            });
        } catch (e) {
          ErrorToast(
            'bottom',
            'Failed to send message',
            'a problem occured when sending a message',
            true,
            1000,
          );
        }
      }
    } else {
      let pickedImage = `chats/images/${getRandomString(18)}.${image?.substring(
        image?.lastIndexOf('.') + 1,
        3,
      )}`;

      const storageRef = storage().ref(pickedImage);

      /**
       * Uploading image to Firebase Storage
       * @type {FirebaseStorageTypes.Task}
       */

      const uploadImageTask = storageRef?.putFile(image);

      /**
       * Add observer to image uploading.
       */

      uploadImageTask.on('state_changed', taskSnapshot => {
        InfoToast(
          'bottom',
          'Sending Image',
          `${bytesToSize(
            taskSnapshot?.bytesTransferred,
          )} transferred out of ${bytesToSize(taskSnapshot?.totalBytes)}`,
          true,
          500,
        );
      });

      /**
       * an async function to get {avatarUrl} and upload all user data.
       */
      uploadImageTask.then(async () => {
        try {
          const uploadedImageURL = await storage()
            .ref(pickedImage)
            .getDownloadURL();
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .collection('messages')
            .doc(destinedUser)
            .collection('discussions')
            .add({
              _id: _id,
              image: uploadedImageURL,
              createdAt: Date.now(),
              user: {
                _id: auth()?.currentUser?.uid,
              },
            });
          firestore()
            .collection('users')
            .doc(destinedUser)
            .collection('messages')
            .doc(auth()?.currentUser?.uid)
            .collection('discussions')
            .add({
              _id: _id,
              createdAt: Date.now(),
              image: uploadedImageURL,
              user: {
                _id: auth()?.currentUser?.uid,
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
            .doc(destinedUser)
            .set({
              to_first_name: userFirstName,
              to_last_name: userLastName,
              to_message_image: uploadedImageURL,
              to_avatar: userAvatar,
              time: firestore?.Timestamp?.fromDate(new Date()),
              type: 'image',
              last_uid: auth()?.currentUser?.uid,
              sent_to_uid: destinedUser,
            });
          firestore()
            .collection('chats')
            .doc(destinedUser)
            .collection('discussions')
            .doc(auth()?.currentUser?.uid)
            .set({
              to_first_name: Me?.first_name,
              to_last_name: Me?.last_name,
              to_message_image: uploadedImageURL,
              to_avatar: Me?.avatar,
              time: firestore?.Timestamp?.fromDate(new Date()),
              type: 'image',
              last_uid: auth()?.currentUser?.uid,
            });
        } catch (ignore) {}
      });
    }
  });

  return (
    <>
      <StatusBar
        backgroundColor={
          imageViewVisible ? COLORS.primaryDark : COLORS.primaryLight
        }
        animated={true}
        barStyle={imageViewVisible ? 'light-content' : 'dark-content'}
      />
      <BaseView>
        <GiftedChat
          text={mMessageText}
          isLoadingEarlier={isLoading}
          messageIdGenerator={() => uuidv4()}
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
                Getting Messages, Hang on.
              </Text>
            </View>
          )}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          onInputTextChanged={text => {
            setMessageText(text);
            ChatSettingsMMKV?.set(destinedUser, text);
          }}
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
          renderComposer={props => <Composer {...props} />}
          parsePatterns={linkStyle => [
            {
              pattern: /#(\w+)/,
              style: {...linkStyle, color: COLORS.yellowLightWarning},
              onPress: this.onPressHashtag,
            },
          ]}
          onPressAvatar={() => {
            setImageViewVisible(true);
          }}
          maxInputLength={1500}
          renderSend={props => {
            return (
              <Send {...props} sendButtonProps={{hitSlop: 15}}>
                <MaterialIcons
                  name="telegram-plane"
                  color={COLORS.darkGrey}
                  size={26}
                  style={{
                    margin: 3 - 0.1 * 3,
                    right: widthPercentageToDP(1.5),
                    bottom: heightPercentageToDP(0.5),
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
                  ['Open Emoji Keyboard']: props => {
                    setIsOpen(true);
                  },
                  ['Open Camera']: props => {
                    ImagePicker.openCamera({
                      height: 1024,
                      width: 1024,
                      cropper: false,
                    })
                      .then(async image => {
                        const compressingResult = await Image.compress(
                          image?.path,
                          {
                            compressionMethod: 'auto',
                          },
                        );
                        sendMessage([], compressingResult);
                      })
                      .catch(() => {});
                  },
                  ['Pick Image']: props => {
                    ImagePicker.openPicker({
                      height: 1024,
                      width: 1024,
                      cropper: false,
                    })
                      .then(async image => {
                        const compressingResult = await Image.compress(
                          image?.path,
                          {
                            compressionMethod: 'auto',
                          },
                        );
                        sendMessage([], compressingResult);
                      })
                      .catch(() => {});
                  },
                  ['Cancel']: props => {
                    // DO NOTHING.
                  },
                }}
                icon={() => (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialIcons
                      name={'plus'}
                      size={20}
                      color={COLORS.black}
                      light
                      style={{
                        top: 2.5 - 0.1 * 2.5,
                        opacity: 0.4,
                      }}
                    />
                  </View>
                )}
                optionTintColor={COLORS.black}
              />
            );
          }}
          user={{
            _id: auth()?.currentUser?.uid,
            avatar: Me?.avatar,
            name: Me?.first_name + ' ' + Me?.last_name,
          }}
          scrollToBottom
        />
        <EmojiPicker
          onEmojiSelected={handlePick}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
        <ImageView
          images={[{uri: userAvatar}]}
          imageIndex={0}
          visible={imageViewVisible}
          animationType={'slide'}
          onRequestClose={() => setImageViewVisible(false)}
          presentationStyle={'fullScreen'}
        />
      </BaseView>
    </>
  );
};

export default ChatScreen;
