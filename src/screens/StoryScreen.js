/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useEffect, useCallback, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Pressable,
  BackHandler,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BackImage from '../assets/images/back.png';
import firestore from '@react-native-firebase/firestore';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
// import EyeImage from '../assets/images/eye.png';
import StoryActionSheet from '../components/Modals/StoryScreen/StoryActionSheet';
// import StoryViewsActionSheet from '../components/Modals/StoryScreen/StoryViewsActionSheet';
import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import {filter, sortBy} from 'lodash';
import {PurpleBackground} from '../index.d';
import {DecryptAES} from '../utils/crypto/cryptoTools';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StoryScreen = () => {
  const navigation = useNavigation();
  const userStoryUID = useRoute()?.params?.userUID;
  // const myUID = useRoute()?.params?.myUID;

  const storiesRef = useRef(null);

  const [storyFirstName, setStoryFirstName] = React.useState('');
  const [storyLastName, setStoryLastName] = React.useState('');
  const [storyAvatar, setStoryAvatar] = React.useState('');
  const [allCurrentUserStories, setAllCurrentUserStories] = React.useState([]);
  const [current, setCurrent] = React.useState([]);
  // const [viewsData, setViewsData] = React.useState([]);

  const [Loading, setLoading] = React.useState(true);
  // const [storyViewsVisible, setStoryViewsVisible] = React.useState(false);

  const storySheetRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['30%'], []);
  const {dismissAll} = useBottomSheetModal(); // will be used soon.

  const deleteCurrentStory = useCallback(async sid => {
    return await firestore().collection('stories').doc(sid).delete();
  }, []);

  /**
   * View Ability config for Stories FlatList.
   * @type {React.MutableRefObject<(function({changed: *}): void)|*>}
   */
  const onViewableItemsChanged = useRef(({changed}) => {
    setCurrent(changed?.[0]?.index);
  });
  const viewAbilityConfig = useRef({viewAreaCoveragePercentThreshold: 100});

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        dismissAll();
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [dismissAll]),
  );

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(userStoryUID)
      .get()
      .then(documentSnapshot => {
        setStoryFirstName(documentSnapshot?.data()?.first_name);
        setStoryLastName(documentSnapshot?.data().last_name);
        setStoryAvatar(documentSnapshot?.data()?.avatar);
      });
  }, [userStoryUID]);

  useEffect(() => {
    firestore()
      .collection('stories')
      .get()
      .then(collectionSnapshot => {
        let collectionDocs = [];
        collectionDocs = collectionSnapshot?.docs?.map(subMap => ({
          ...subMap?.data(),
          image:
            subMap?.data().image === undefined
              ? ''
              : DecryptAES(subMap?.data()?.image),
          text:
            subMap?.data()?.text === undefined
              ? ''
              : DecryptAES(subMap?.data()?.text),
          sid: subMap?.id,
        }));
        collectionDocs = sortBy(collectionDocs, [docs => docs?.time?.toDate()]);
        filter(
          collectionDocs,
          documentCols => documentCols?.uid === userStoryUID,
        );
        setAllCurrentUserStories(collectionDocs);
        console.log('rerender');
        setLoading(false);
      });
  }, [userStoryUID]);

  if (Loading) {
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
              android_ripple={{
                color: COLORS.rippleColor,
                radius: 25 - 0.1 * 25,
                borderless: true,
              }}
              onPress={() => navigation.goBack()}>
              <MaterialIcons
                name="arrow-back"
                size={30 - 0.1 * 30}
                style={{opacity: 0.6, marginRight: '-1%', marginLeft: '1%'}}
              />
            </Pressable>
          </View>
          <View style={styles.mid_side}>
            <Avatar.Image
              size={40}
              source={
                Loading
                  ? PurpleBackground
                  : storyAvatar
                  ? {uri: storyAvatar}
                  : PurpleBackground
              }
            />
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                fontSize: fontValue(16),
              }}>
              <Text style={styles.toolbar_text}>
                {storyFirstName + ' ' + storyLastName}
              </Text>
              <Text style={styles.timeText}>
                {moment(
                  Object.values(allCurrentUserStories)?.length > 0
                    ? allCurrentUserStories[current]?.time?.toDate()
                    : Date.now(),
                )?.fromNow()}
              </Text>
            </View>
          </View>
          {
            /**!storyText !== null || auth?.currentUser.uid !== userStoryUID*/ true ? (
              <View style={styles.right_side}>
                {/**
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                    onPress={() => {
                      //setStoryViewsVisible(!storyViewsVisible);
                    }}>
                    <Avatar.Icon
                      icon={EyeImage}
                      size={37.5}
                      color={COLORS.black}
                      style={{
                        marginRight: '-1%',
                        opacity: 0.4,
                      }}
                      theme={{
                        colors: {
                          primary: COLORS.transparent,
                        },
                      }}
                    />
                    <Text style={styles.viewsNumber}>
                      {viewsData?.length > 0
                        ? Object?.values(viewsData)?.length
                        : '0'}
                    </Text>
                  </Pressable>
                  <View style={{width: widthPercentageToDP(2.5)}} />
            */}
                <Pressable
                  android_ripple={{
                    color: COLORS.rippleColor,
                    radius: 25 - 0.1 * 25,
                    borderless: true,
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                  onPress={() => storySheetRef?.current?.present()}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={30 - 0.1 * 30}
                    style={{opacity: 0.6}}
                  />
                </Pressable>
              </View>
            ) : (
              <></>
            )
          }
        </View>
        <FlatList
          ref={storiesRef}
          pagingEnabled
          horizontal
          viewabilityConfig={viewAbilityConfig?.current}
          onViewableItemsChanged={onViewableItemsChanged?.current}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <ActivityIndicator
              size={'large'}
              color={COLORS.accentLight}
              animating={true}
            />
          }
          data={Object.values(allCurrentUserStories)}
          renderItem={({item}) => {
            return (
              <View style={styles.imageWrapper}>
                <ImageBackground
                  style={styles.storyImage}
                  source={{
                    uri: item?.image,
                  }}
                />
                {item?.text ? (
                  <View style={styles.bandView}>
                    <Text style={styles.bandText}>{item?.text}</Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            );
          }}
        />
        <View style={styles.footer}>
          <View style={styles.footer_left}>
            <Pressable
              android_ripple={{
                color: COLORS.rippleColor,
                radius: 25,
                borderless: true,
              }}
              onPress={() => {
                if (current > 0) {
                  storiesRef?.current?.scrollToIndex({
                    index: current - 1,
                  });
                }
              }}>
              <MaterialIcons
                name="arrow-back"
                size={30 - 0.1 * 30}
                style={{opacity: 0.6}}
              />
            </Pressable>
          </View>
          <View style={styles.footer_mid}>
            <Text style={styles.footer_text}>
              {`${current + 1} / ${
                Object.values(allCurrentUserStories)?.length > 0
                  ? Object.values(allCurrentUserStories)?.length
                  : 1
              }`}
            </Text>
          </View>
          <View style={styles.footer_right}>
            <Pressable
              android_ripple={{
                color: COLORS.rippleColor,
                radius: 25 - 0.1 * 25,
                borderless: true,
              }}
              onPress={() => {
                if (
                  current <
                  Object.values(allCurrentUserStories)?.length - 1
                ) {
                  storiesRef?.current?.scrollToIndex({
                    index: current + 1,
                  });
                }
              }}>
              <MaterialIcons
                name="arrow-forward"
                size={30 - 0.1 * 30}
                style={{opacity: 0.6}}
              />
            </Pressable>
          </View>
        </View>
        {/**
           <StoryViewsActionSheet
            hideModal={() => {
              setStoryViewsVisible(!storyViewsVisible);
            }}
            isVisible={storyViewsVisible}
            ViewsData={viewsData}
          />
           */}
        <StoryActionSheet
          sheetRef={storySheetRef}
          index={0}
          snapPoints={sheetSnapPoints}
          onCopySelected={() => {
            Clipboard.setString(allCurrentUserStories[current]?.text);
            dismissAll();
          }}
          onDeleteSelected={() => {
            dismissAll();
            deleteCurrentStory(allCurrentUserStories[current]?.sid).finally(
              () => {
                if (navigation?.canGoBack()) {
                  navigation?.goBack();
                }
              },
            );
          }}
          showSave={
            false // TODO: Will be enabled soon.
          }
          onSaveSelected={undefined}
          currentStoryUID={userStoryUID}
        />
      </MiniBaseView>
    );
  }
};

const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mid_side: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
  },
  toolbar_text: {
    fontSize: fontValue(18),
    paddingLeft: widthPercentageToDP(1.5),
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  timeText: {
    fontSize: fontValue(14),
    paddingLeft: widthPercentageToDP(1.5),
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.6,
    fontFamily: FONTS.regular,
  },
  imageHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  storyImage: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(55),
    resizeMode: 'contain',
  },
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footer: {
    padding: '2%',
    flexDirection: 'row',
  },
  footer_left: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '1%',
    flexDirection: 'row',
  },
  footer_mid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer_right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: '1%',
  },
  footer_text: {
    fontSize: fontValue(16),
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.6,
    fontFamily: FONTS.regular,
  },
  bandView: {
    width: '100%',
    padding: heightPercentageToDP(1),
    backgroundColor: '#757575',
    opacity: 0.75,
    position: 'absolute',
    bottom: heightPercentageToDP(20),
  },
  bandText: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: FONTS.regular,
  },
  viewsNumber: {
    fontSize: fontValue(15),
    opacity: 0.4,
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

export default StoryScreen;
