/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import MessagesList from '../components/HomeScreen/MessagesList';
import firestore from '@react-native-firebase/firestore';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import {PurpleBackground} from '../index.d';
import {reverse, sortBy, uniqBy} from 'lodash';
import {JwtKeyMMKV} from '../config/MMKV/JwtKeyMMKV';
import StickyItemFlatList from '@gorhom/sticky-item';
import MoonStickyStoryView from '../components/HomeScreen/MoonStickyStoryView';
import Spacer from '../components/Spacer/Spacer';
import {UserDataMMKV} from '../config/MMKV/UserDataMMKV';
import {DecryptAES} from '../utils/crypto/cryptoTools';

const HomeChatsScreen = () => {
  // Sticky-Item Config
  const ITEM_WIDTH = 120;
  const ITEM_HEIGHT = 200;
  const STICKY_ITEM_WIDTH = 50;
  const STICKY_ITEM_HEIGHT = 50;
  const STICKY_ITEM_BACKGROUNDS = [COLORS.rippleColor, COLORS.accentLight];
  const SEPARATOR_SIZE = 8;
  const BORDER_RADIUS = 10;

  const navigation = useNavigation();

  const [chatsData, setChatsData] = React.useState([]);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

  const [storiesData, setStoriesData] = React.useState([]);

  const [myUID, setMyUID] = React.useState('');

  const [storyLoading, setStoryLoading] = React.useState(true);

  const [chatsLoading, setChatsLoading] = React.useState(true);

  const checkJwtKey = useCallback(
    currentJwtKey => {
      const currentKey = JwtKeyMMKV?.getString('currentUserJwtKey');
      if (currentKey !== currentJwtKey) {
        JwtKeyMMKV?.delete('currentUserJwtKey');
        if (auth()?.currentUser !== null) {
          auth()
            ?.signOut()
            .then(() => {
              navigation?.navigate('login');
              InfoToast(
                'bottom',
                'Session Expired',
                'Your session in this account has been expired, Please re-login',
                true,
                3000,
              );
            })
            .catch(() => {
              auth()
                ?.signOut()
                .then(() => {
                  navigation?.navigate('login');
                });
              if (__DEV__) {
                console.error('failed loggin out the user');
              }
            });
        }
      }
    },
    [navigation],
  );

  async function updateUserActiveStatus() {
    await firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        active_status: activeStatusState === true ? 'normal' : 'recently',
        active_time:
          newActiveTime === 'Last seen recently'
            ? 'Last seen recently'
            : firestore.Timestamp.fromDate(new Date()),
      });
  }

  /**
   *
   * @function
   * @name deleteCurrentStory
   * @param {string} sid
   * @returns {Promise<void>}
   */
  const deleteCurrentStory = useCallback(async sid => {
    return await firestore().collection('stories')?.doc(sid)?.delete();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    const userSusbcribe = firestore()
      .collection('users')
      .onSnapshot(collectionSnapshot => {
        collectionSnapshot?.forEach(documentSnapshot => {
          if (documentSnapshot?.exists) {
            if (documentSnapshot?.id === auth()?.currentUser?.uid) {
              if (
                documentSnapshot?.data()?.avatar &&
                documentSnapshot?.data()?.jwtKey &&
                documentSnapshot?.data()?.active_status &&
                documentSnapshot?.data()?.active_time
              ) {
                setMyUID(documentSnapshot?.data()?.uid);
                setAvatarURL(documentSnapshot?.data()?.avatar);
                checkJwtKey(documentSnapshot?.data()?.jwtKey);
                if (documentSnapshot?.data()?.active_status === 'normal') {
                  setActiveStatusState(true);
                } else {
                  setActiveStatusState(false);
                }
                setNewActiveTime(documentSnapshot?.data()?.active_time);
                UserDataMMKV.set(
                  'Me',
                  JSON?.stringify(documentSnapshot?.data()),
                );
              }
            }
          }
        });
      });
    return () => {
      userSusbcribe();
    };
  }, [checkJwtKey]);

  useEffect(() => {
    const chatSubscribe = firestore()
      .collection('chats')
      .doc(auth()?.currentUser?.uid)
      .collection('discussions')
      .onSnapshot(collectionSnapshot => {
        if (collectionSnapshot?.empty) {
          setChatsData([]);
        } else {
          let collectionDocs = collectionSnapshot?.docs?.map(subMap => ({
            ...subMap?.data(),
            typing: subMap?.data()?.typing,
            id: subMap?.id,
          }));
          collectionDocs = sortBy(collectionDocs, [
            data => data?.time?.toDate(),
          ]);
          collectionDocs = reverse(collectionDocs);
          setChatsData(collectionDocs);
        }
        setChatsLoading(false);
      });
    return () => {
      chatSubscribe();
    };
  }, []);

  useEffect(() => {
    const storySubsribe = firestore()
      .collection('stories')
      .onSnapshot(subCollectionSnapshot => {
        subCollectionSnapshot?.forEach(subDocument => {
          if (
            subDocument?.data()?.time &&
            (subDocument?.data()?.text || subDocument?.data()?.image)
          ) {
            if (
              firestore?.Timestamp?.fromDate(new Date())?.toDate() -
                subDocument?.data()?.time?.toDate() >
              86400000
            ) {
              deleteCurrentStory(subDocument?.id);
            }
          }
        });
      });
    return () => {
      storySubsribe();
    };
  }, [deleteCurrentStory]);

  useEffect(() => {
    const storiesSubscribe = firestore()
      .collection('stories')
      .onSnapshot(collectionSnapshot => {
        if (collectionSnapshot?.empty) {
          setStoriesData([]);
        } else {
          let collectionDocs = collectionSnapshot?.docs?.map(element => ({
            ...element?.data(),
            image:
              element.data()?.image === undefined
                ? ''
                : DecryptAES(element?.data()?.image),
            id: element?.id,
          }));

          collectionDocs = sortBy(collectionDocs, [
            docs => docs?.time?.toDate(),
          ]);
          collectionDocs = reverse(collectionDocs);
          setStoriesData(collectionDocs);
        }
        setStoryLoading(false);
      });

    return () => {
      storiesSubscribe();
    };
  }, []);

  if (storyLoading && chatsLoading) {
    return (
      <MiniBaseView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            animating={true}
            size={'large'}
            color={COLORS.accentLight}
          />
        </View>
      </MiniBaseView>
    );
  } else {
    return (
      <MiniBaseView>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            <Pressable
              hitSlop={15}
              onPress={() => {
                navigation.navigate('settings');
                updateUserActiveStatus();
              }}>
              <Avatar.Image
                size={35.5}
                source={
                  auth()?.currentUser?.photoURL
                    ? {uri: auth()?.currentUser?.photoURL}
                    : avatarURL
                    ? {uri: avatarURL}
                    : PurpleBackground
                }
                style={{
                  overflow: 'hidden',
                  marginRight: '-1%',
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            </Pressable>
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.top_text}>Chats</Text>
          </View>
        </View>
        <View
          style={{
            height: ITEM_HEIGHT,
            width: '100%',
          }}>
          <StickyItemFlatList
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            separatorSize={SEPARATOR_SIZE}
            borderRadius={BORDER_RADIUS}
            stickyItemWidth={STICKY_ITEM_WIDTH}
            stickyItemHeight={STICKY_ITEM_HEIGHT}
            stickyItemBackgroundColors={STICKY_ITEM_BACKGROUNDS}
            stickyItemContent={props => (
              <MoonStickyStoryView
                {...props}
                userAvatar={auth()?.currentUser?.photoURL}
                tempAvatar={PurpleBackground}
              />
            )}
            onStickyItemPress={undefined}
            data={uniqBy(storiesData, 'uid')}
            renderItem={({item}) => (
              <Pressable
                style={{
                  height: ITEM_HEIGHT,
                  width: ITEM_WIDTH,
                  borderRadius: BORDER_RADIUS,
                  backgroundColor: COLORS.rippleColor,
                }}
                onPress={() => {
                  navigation?.navigate('story', {
                    userUID: item?.uid,
                    myUID: myUID,
                  });
                }}>
                <Image
                  style={{
                    backgroundColor: COLORS.white,
                    width: ITEM_WIDTH,
                    height: ITEM_WIDTH,
                    borderRadius: BORDER_RADIUS,
                    resizeMode: 'contain',
                  }}
                  source={{
                    uri: item?.image ? item?.image : item?.avatar,
                  }}
                />
                <Text
                  style={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    lineHeightight: 14,
                    fontSize:
                      Platform.OS === 'ios' ? fontValue(12) : fontValue(14),
                    fontWeight: '500',
                    color: COLORS.black,
                    fontFamily: FONTS.regular,
                    paddingHorizontal: SEPARATOR_SIZE * 2,
                    transform: [
                      {translateY: ITEM_HEIGHT / 2 + ITEM_HEIGHT / 4},
                    ],
                  }}>{`${item?.first_name}${' '}${item?.last_name}`}</Text>
              </Pressable>
            )}
          />
        </View>
        <Spacer height={heightPercentageToDP(0.5)} />
        <MessagesList ListData={chatsData} />
      </MiniBaseView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
    elevation: 0,
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '1%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: 'bold',
    fontFamily: FONTS.regular,
  },
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: heightPercentageToDP(0.25),
  },
  mid_side: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
});

export default HomeChatsScreen;
