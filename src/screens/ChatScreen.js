/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect, useLayoutEffect, useMemo} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Linking,
  PermissionsAndroid,
  Pressable,
  StatusBar,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {
  GiftedChat,
  MessageImage,
  Bubble,
  MessageText,
} from 'react-native-gifted-chat';
import {Avatar, Divider} from 'react-native-paper';
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
import {Image} from 'react-native-compressor';
import {PurpleBackground} from '../index.d';
import {filter, isEmpty, reverse, sortBy} from 'lodash';
import {EmojiKeyboard} from 'rn-emoji-keyboard';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import NetInfo from '@react-native-community/netinfo';
import {UserDataMMKV} from '../config/MMKV/UserDataMMKV';
import {DecryptAES, EncryptAES} from '../utils/crypto/cryptoTools';
import MoonInputToolbar from '../components/ChatScreen/MoonInputToolbar';
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import OneSignal from 'react-native-onesignal';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatScreen = () => {
  const navigation = useNavigation();

  const stackRoute = useRoute();
  const destinedUser = useMemo(() => stackRoute?.params?.item, []);

  const [imageViewVisible, setImageViewVisible] = React.useState(false);
  /**
   * "User" Credentials, we use those variables to get his data from firebase, then implement it in our App!
   */
  const [userFirstName, setUserFirstName] = React.useState('');
  const [userLastName, setUserLastName] = React.useState('');
  const [userAvatar, setUserAvatar] = React.useState('');
  const [userActiveStatus, setUserActiveStatus] = React.useState('');
  const [userActiveTime, setUserActiveTime] = React.useState('');
  const [userPlayerID, setUserPlayerID] = React.useState();

  /**
   * "Me" Credentials, same as "User" Credentials above, this is the data of the currently logged-in User.
   */

  const [Me, setMe] = React.useState([]);

  useEffect(() => {
    try {
      setMe(JSON?.parse(UserDataMMKV?.getString('Me')));
    } catch (error) {
      setMe([]);
    }
  }, []);

  /**
   * Message Variables
   */
  const [mMessageText, setMessageText] = React.useState('');
  const [mChatData, setChatData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  let _id = uuidv4() + getRandomString(3);

  const [emojiKeyboardOpened, setEmojiKeyboardOpened] = React.useState(false);

  const handlePick = emojiObject => {
    setMessageText(mMessageText + emojiObject?.emoji);
  };

  const mAttachPressCallback = async () => {
    try {
      const requestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message:
            'Moon Meet requires this permission to access your phone storage',
          buttonNegative: 'Deny',
          buttonPositive: 'Grant',
        },
      );
      if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openPicker({
          height: 1024,
          width: 1024,
          cropper: false,
        })
          .then(async image => {
            const compressingResult = await Image.compress(image?.path, {
              compressionMethod: 'auto',
            });
            sendMessage([], compressingResult);
          })
          .catch(_ => {});
      } else if (
        requestResult === PermissionsAndroid.RESULTS.DENY ||
        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        try {
          Linking?.openSettings();
          ToastAndroid.show(
            'Please grant storage permission manually',
            ToastAndroid.SHORT,
          );
        } catch (error) {
          if (__DEV__) {
            console.error(error);
          }
        }
      }
    } catch (err) {
      // Maybe something weird or the app running on iOS.
      if (__DEV__) {
        console.warn(err);
      }
    }
  };

  const mCameraPressCallback = async () => {
    try {
      const requestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Camera Permission',
          message: 'Moon Meet requires this permission to access your camera',
          buttonNegative: 'Deny',
          buttonPositive: 'Grant',
        },
      );
      if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera({
          height: 1024,
          width: 1024,
          cropper: false,
        })
          .then(async image => {
            const compressingResult = await Image.compress(image?.path, {
              compressionMethod: 'auto',
            });
            sendMessage([], compressingResult);
          })
          .catch(_ => {});
      } else if (
        requestResult === PermissionsAndroid.RESULTS.DENY ||
        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        try {
          Linking?.openSettings();
          ToastAndroid.show(
            'Please grant camera permission manually',
            ToastAndroid.SHORT,
          );
        } catch (error) {
          if (__DEV__) {
            console.error(error);
          }
        }
      }
    } catch (err) {
      // Maybe something weird or the app running on iOS.
      if (__DEV__) {
        console.warn(err);
      }
    }
  };
  const [playerID, setPlayerID] = React.useState();
  const [isSubscribed, setSubscribed] = React.useState();

  const getDeviceState = useCallback(async () => {
    try {
      const deviceState = await OneSignal.getDeviceState();
      setPlayerID(deviceState?.userId);
      setSubscribed(deviceState?.isSubscribed);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  }, []);

  useEffect(() => {
    getDeviceState();
    return () => getDeviceState();
  }, [getDeviceState]);

  useLayoutEffect(() => {
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
            setUserFirstName(userSnapshot?.data()?.first_name);
            setUserLastName(userSnapshot?.data()?.last_name);
            setUserAvatar(userSnapshot?.data()?.avatar);
            setUserActiveStatus(userSnapshot?.data()?.active_status);
            setUserPlayerID(userSnapshot?.data()?.OneSignalID);
            if (userSnapshot?.data()?.active_time === 'Last seen recently') {
              setUserActiveTime(userSnapshot?.data()?.active_time);
            } else {
              setUserActiveTime(userSnapshot?.data()?.active_time?.toDate());
            }
          }
        }
      });
    return () => userSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const messagesSubscribe = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .collection('messages')
      .doc(destinedUser)
      .collection('discussions')
      .onSnapshot(collectionSnapshot => {
        if (collectionSnapshot?.empty) {
          setChatData([]);
        } else {
          let collectionDocs = collectionSnapshot?.docs?.map(subMap => {
            if (subMap?.data()?.image) {
              return {
                ...subMap?.data(),
                id: subMap?.id,
                image: DecryptAES(subMap?.data()?.image),
                user: {
                  _id:
                    subMap?.data()?.user?._id === auth()?.currentUser?.uid
                      ? auth()?.currentUser?.uid
                      : destinedUser,
                  name:
                    subMap?.data()?.user?._id === auth()?.currentUser?.uid
                      ? auth()?.currentUser?.displayName
                      : userFirstName + ' ' + userLastName,
                  avatar:
                    subMap?.data()?.user?._id === auth()?.currentUser?.uid
                      ? auth()?.currentUser?.photoURL
                      : userAvatar,
                },
              };
            } else {
              return {
                ...subMap?.data(),
                id: subMap?.id,
                text: DecryptAES(subMap?.data()?.text),
                received: true,
                sent: true,
                user: {
                  _id:
                    subMap?.data()?.user?._id === auth()?.currentUser?.uid
                      ? auth()?.currentUser?.uid
                      : destinedUser,
                  name:
                    subMap?.data()?.user?._id === auth()?.currentUser?.uid
                      ? auth()?.currentUser?.displayName
                      : userFirstName + ' ' + userLastName,
                  avatar:
                    subMap?.data()?.user?._id === auth()?.currentUser?.uid
                      ? auth()?.currentUser?.photoURL
                      : userAvatar,
                },
              };
            }
          });
          filter(collectionDocs, [
            (docs, index) => {
              if (docs?.image) {
                collectionDocs[index].text = '';
              }
            },
          ]);
          collectionDocs = sortBy(collectionDocs, [docs => docs?.createdAt]);
          collectionDocs = reverse(collectionDocs);
          setChatData(collectionDocs);
        }
        setLoading(false);
      });
    return () => {
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
          size={40 - 0.1 * 40}
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
              fontSize: fontValue(17),
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
              fontSize: fontValue(15),
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

  const sendMessage = useCallback(
    async (mChatData = [], image) => {
      let connectionStatus = await NetInfo?.fetch();
      if (connectionStatus?.isConnected) {
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
                  text: EncryptAES(mMessageText),
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
                  text: EncryptAES(mMessageText),
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
                  to_message_text: EncryptAES(mMessageText),
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
                  to_message_text: EncryptAES(mMessageText),
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
          let pickedImage = `chats/images/${getRandomString(
            18,
          )}.${image?.substring(image?.lastIndexOf('.') + 1, 3)}`;

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
                image: EncryptAES(uploadedImageURL),
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
                image: EncryptAES(uploadedImageURL),
                user: {
                  _id: auth()?.currentUser?.uid,
                },
              });
            setChatData(previousMessage =>
              GiftedChat.append(previousMessage, mChatData),
            );
            // Chats messages on home screen goes here
            if (
              !isEmpty(userFirstName) &&
              !isEmpty(userLastName) &&
              isEmpty(userAvatar)
            ) {
              firestore()
                .collection('chats')
                .doc(auth()?.currentUser?.uid)
                .collection('discussions')
                .doc(destinedUser)
                .set({
                  to_first_name: userFirstName,
                  to_last_name: userLastName,
                  to_message_image: EncryptAES(uploadedImageURL),
                  to_avatar: userAvatar,
                  time: firestore?.Timestamp?.fromDate(new Date()),
                  type: 'image',
                  last_uid: auth()?.currentUser?.uid,
                  sent_to_uid: destinedUser,
                });
            }
            firestore()
              .collection('chats')
              .doc(destinedUser)
              .collection('discussions')
              .doc(auth()?.currentUser?.uid)
              .set({
                to_first_name: Me?.first_name,
                to_last_name: Me?.last_name,
                to_message_image: EncryptAES(uploadedImageURL),
                to_avatar: Me?.avatar,
                time: firestore?.Timestamp?.fromDate(new Date()),
                type: 'image',
                last_uid: auth()?.currentUser?.uid,
              });
          });
        }
      } else {
        ErrorToast(
          'bottom',
          'Intternet connection required',
          'Please enable Wi-Fi or Mobile data to send messages',
          true,
          1000,
        );
      }
    },
    [
      Me?.avatar,
      Me?.first_name,
      Me?.last_name,
      _id,
      destinedUser,
      mMessageText,
      userAvatar,
      userFirstName,
      userLastName,
    ],
  );

  function onLongPress(context, message) {
    const options =
      message?.user?._id === auth()?.currentUser?.uid
        ? ['Copy Message', 'Delete For Me', 'Cancel']
        : ['Copy Message', 'Cancel'];
    const cancelButtonIndex = options?.length - 1;
    context?.actionSheet()?.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        if (options?.length === 3) {
          switch (buttonIndex) {
            case 0:
              try {
                Clipboard?.setString(message?.text);
              } catch (e) {
                ErrorToast(
                  'bottom',
                  'Unexcpected Error Occured',
                  `${e}`,
                  true,
                  1500,
                );
              }
              break;
            case 1:
              try {
                deleteMessage(message?.id);
              } catch (e) {
                ErrorToast(
                  'bottom',
                  'Unexcpected Error Occured',
                  `${e}`,
                  true,
                  1500,
                );
              }
              break;
          }
        } else {
          switch (buttonIndex) {
            case 0:
              try {
                Clipboard?.setString(message?.text);
              } catch (e) {
                ErrorToast(
                  'bottom',
                  'Unexcpected Error Occured',
                  `${e}`,
                  true,
                  1500,
                );
              }
              break;
          }
        }
      },
    );
  }

  async function deleteMessage(id) {
    const meMessageRef = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .collection('messages')
      .doc(destinedUser)
      .collection('discussions');
    return await meMessageRef?.get()?.then(collectionSnapshot => {
      collectionSnapshot?.docs?.map(documentSnapshot => {
        if (documentSnapshot?.id === id) {
          documentSnapshot?.ref?.delete();
          filter(mChatData, element => {
            element?.id === id;
          });
        }
      });
    });
  }

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
          messages={mChatData}
          onLongPress={onLongPress}
          renderTicks={message => {
            return (
              <MaterialCommunityIcons
                name={message?.received === undefined ? 'check' : 'check-all'}
                size={16}
                style={{paddingRight: widthPercentageToDP(1)}}
                color={
                  message?.user._id === auth()?.currentUser?.uid
                    ? COLORS.white
                    : COLORS.black
                }
              />
            );
          }}
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
              <Animated.View
                layout={Layout.springify()}
                entering={FadeInDown}
                exiting={FadeOutDown}>
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
              </Animated.View>
            );
          }}
          minInputToolbarHeight={0}
          renderInputToolbar={_ => undefined}
          renderComposer={_ => undefined}
          parsePatterns={linkStyle => [
            {
              pattern: /#(\w+)/,
              style: {...linkStyle, color: COLORS.yellowLightWarning},
              onPress: undefined,
            },
          ]}
          onPressAvatar={() => {
            setImageViewVisible(true);
          }}
          user={{
            _id: auth()?.currentUser?.uid,
            avatar: auth()?.currentUser?.photoURL,
            name: auth()?.currentUser?.displayName,
          }}
          scrollToBottom
        />
        <Divider inset={false} />
        <MoonInputToolbar
          messageGetter={mMessageText}
          messageSetter={setMessageText}
          attachPressCallback={mAttachPressCallback}
          cameraPressCallback={mCameraPressCallback}
          emojiGetter={emojiKeyboardOpened}
          emojiSetter={setEmojiKeyboardOpened}
          sendMessageCallback={() => {
            sendMessage([], '').finally(() => {
              if (playerID !== userPlayerID) {
                const toSendNotification = {
                  contents: {
                    en: `${
                      auth()?.currentUser?.displayName
                    }: You have a new message from ${userFirstName} ${userLastName}.`,
                  },
                  include_player_ids: [userPlayerID],
                  data: {
                    type: 'chat',
                    senderName: `${auth()?.currentUser?.displayName}`,
                    senderUID: `${auth()?.currentUser?.uid}`,
                    senderPhoto: `${auth()?.currentUser?.photoURL}`,
                    receiverName: `${userFirstName} ${userLastName}`,
                    receiverUID: `${destinedUser}`,
                    receiverPhoto: `${userAvatar}`,
                    messageDelivered: `${mMessageText?.trim()}`,
                    messageTime: Date.now(),
                  }, // some values ain't unsed, yet, but they will be used soon.
                };
                const stringifiedJSON = JSON.stringify(toSendNotification);
                OneSignal.postNotification(
                  stringifiedJSON,
                  success => {
                    if (__DEV__) {
                      ToastAndroid.show(
                        'Message notification sent',
                        ToastAndroid.SHORT,
                      );
                      console.log(success);
                    }
                  },
                  error => {
                    if (__DEV__) {
                      console.error(error);
                    }
                  },
                );
              }
              setMessageText('');
            });
          }}
        />
        {emojiKeyboardOpened ? (
          <EmojiKeyboard
            emojiSize={28 - 0.1 * 28}
            onEmojiSelected={handlePick}
            enableRecentlyUsed
            containerStyles={{borderRadius: 0}}
          />
        ) : (
          <></>
        )}

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
