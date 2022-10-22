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
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fontValue, screenWidth} from '../config/Dimensions';
import {PurpleBackground} from '../index.d';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatGrid} from 'react-native-super-grid';
import {DecryptAES} from '../utils/crypto/cryptoTools';
import {reverse, sortBy, uniqBy} from 'lodash';
import {StoryMMKV} from '../config/MMKV/StoryMMKV';
import {UserDataMMKV} from '../config/MMKV/UserDataMMKV';

const HomePeopleScreen = () => {
  const navigation = useNavigation();

  const [avatarURL, setAvatarURL] = React.useState('');

  const [storyLoading, setStoryLoading] = React.useState(true);

  const [newActiveTime, setNewActiveTime] = React.useState();

  const [activeStatusState, setActiveStatusState] = React.useState();

  const [storiesData, setStoriesData] = React.useState([]);

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

  const renderItem = ({item, index}) => {
    let currentSid = storiesData[index]?.id;
    let storySeenAlready = StoryMMKV.contains(currentSid);
    return (
      <Pressable
        style={styles.itemContainer}
        android_ripple={{color: COLORS.rippleColor}}
        onPress={() => {
          StoryMMKV.set(currentSid, JSON.stringify(item));
          navigation?.navigate('story', {
            userUID: item?.uid,
            myUID: auth()?.currentUser?.uid,
          });
        }}>
        <Image
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 5,
            height: '100%',
            width: '100%',
            resizeMode: 'contain',
          }}
          source={{
            uri: item?.image ? item?.image : item?.avatar,
          }}
        />
        <View
          style={{
            position: 'absolute',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 24,
            zIndex: 1,
            borderColor: storySeenAlready
              ? COLORS.darkGrey
              : COLORS.accentLight,
            borderWidth: 1.5,
            borderRadius: 360,
            padding: '1.5%',
            transform: [{translateY: 15}, {translateX: 10}],
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Avatar.Image
            source={{uri: item?.avatar}}
            size={35}
            style={{overflow: 'hidden'}}
          />
        </View>
        <Text
          style={{
            position: 'absolute',
            textAlign: 'left',
            lineHeightight: 14,
            fontSize: Platform.OS === 'ios' ? fontValue(12) : fontValue(14),
            fontWeight: '600',
            color: COLORS.white,
            fontFamily: FONTS.regular,
            paddingHorizontal: 5 * 2,
            transform: [{translateY: 275 / 2 + 275 / 4}],
            zIndex: 1,
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
          }}>{`${item?.first_name}${'\n'}${item?.last_name}`}</Text>
      </Pressable>
    );
  };

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
    const userSusbcribe = firestore()
      .collection('users')
      .onSnapshot(collectionSnapshot => {
        collectionSnapshot?.forEach(documentSnapshot => {
          if (documentSnapshot?.id === auth()?.currentUser?.uid) {
            if (
              documentSnapshot?.data()?.avatar &&
              documentSnapshot?.data()?.jwtKey &&
              documentSnapshot?.data()?.active_status &&
              documentSnapshot?.data()?.active_time
            ) {
              setAvatarURL(documentSnapshot?.data()?.avatar);
              if (documentSnapshot?.data()?.active_status === 'normal') {
                setActiveStatusState(true);
              } else {
                setActiveStatusState(false);
              }
              setNewActiveTime(documentSnapshot?.data()?.active_time);
            }
          }
        });
      });
    return () => {
      userSusbcribe();
    };
  }, []);

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

  useEffect(() => {
    const ActiveStatusInterval = setInterval(() => {
      // updateUserActiveStatus();
    }, 30000);
    return () => {
      clearInterval(ActiveStatusInterval);
    };
  }, []);

  const [Me, setMe] = React.useState([]);

  useEffect(() => {
    try {
      setMe(JSON.parse(UserDataMMKV.getString('Me')));
    } catch (error) {
      setMe([]);
    }
    return () => {};
  }, []);

  const updateUserActiveStatus = useCallback(async () => {
    await firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        active_status: Me?.active_status === 'normal' ? 'normal' : 'recently',
        active_time:
          Me?.active_time === 'Last seen recently'
            ? 'Last seen recently'
            : firestore.Timestamp.fromDate(new Date()),
      });
  }, [Me?.active_status, Me?.active_time]);

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text adjustsFontSizeToFit style={styles.heading('center', false)}>
          No stories available, yet.
        </Text>
        <Text
          adjustsFontSizeToFit
          style={styles.subheading('center', false, true)}>
          there's no one have shared a story at the moment.
        </Text>
      </View>
    );
  };

  if (storyLoading) {
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
                updateUserActiveStatus();
                navigation.navigate('settings');
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
            <Text style={styles.top_text}>Stories</Text>
          </View>
          <View style={styles.right_side}>
            <Pressable
              onPress={() => {
                navigation?.navigate('addStory');
                updateUserActiveStatus();
              }}
              style={{
                backgroundColor: COLORS.rippleColor,
                borderRadius: 360,
                padding: '2%',
                overflow: 'hidden',
              }}>
              <MaterialCommunityIcons
                name="plus"
                size={25}
                color={COLORS.black}
                style={{opacity: 0.8, padding: '1%'}}
              />
            </Pressable>
          </View>
        </View>
        <FlatGrid
          itemDimension={screenWidth / 3}
          data={uniqBy(storiesData, 'uid')}
          style={styles.gridView}
          spacing={15}
          renderItem={renderItem}
          ListEmptyComponent={listEmptyComponent}
        />
      </MiniBaseView>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
    elevation: 0,
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
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
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  right_icon: {
    resizeMode: 'contain',
    overflow: 'hidden',
    paddingBottom: '0.2%',
    paddingRight: '0.2%',
    opacity: 0.4,
  },
  gridView: {
    flex: 1,
  },
  itemContainer: {
    height: 250,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  heading: (align, isRead) => {
    return {
      fontSize: 16,
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  },
  subheading: (align, isMessage, isRead) => {
    return {
      fontSize: isMessage ? fontValue(14) : fontValue(11.5),
      paddingTop: '1%',
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  },
  emptyView: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignContent: 'center',
  },
});
export default HomePeopleScreen;
