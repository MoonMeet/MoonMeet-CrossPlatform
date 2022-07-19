import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import {ActivityIndicator, Avatar, Provider} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import CreateImage from '../assets/images/create.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fontValue} from '../config/Dimensions';
import {PurpleBackground} from '../index.d';
import Animated from 'react-native-reanimated';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import StickyItemFlatList from '@gorhom/sticky-item';
import MoonStickyStoryItem from '../components/HomeScreen/task/modified';
import {JwtKeyMMKV} from '../config/MMKV/JwtKeyMMKV';

const HomeStoriesScreen = () => {
  const navigation = useNavigation();

  const [Loading, setLoading] = React.useState(true);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

  const currentStoryData = [];

  // dummy data
  const data = [...Array(10)]
    .fill(0)
    .map((_, index) => ({id: `item-${index}`}));

  // configs
  const ITEM_WIDTH = 120;
  const ITEM_HEIGHT = 200;
  const STICKY_ITEM_WIDTH = 50;
  const STICKY_ITEM_HEIGHT = 50;
  const STICKY_ITEM_BACKGROUNDS = [COLORS.rippleColor, COLORS.accentLight];
  const SEPARATOR_SIZE = 8;
  const BORDER_RADIUS = 10;

  const StickyItemView = ({
    x,
    threshold,
    itemWidth,
    itemHeight,
    stickyItemWidth,
    stickyItemHeight,
    separatorSize,
    isRTL,
  }) => {
    const amazingAnimation = {};

    return (
      <Animated.View style={amazingAnimation}>
        <ImageBackground
          resizeMode="cover"
          style={{height: 100, width: 60, paddingVertical: 50}}
          borderTopLeftRadius={10}
          borderBottomRightRadius={10}
          source={{uri: avatarURL}}>
          <Text>Hello</Text>
        </ImageBackground>
      </Animated.View>
    );
  };

  const [myUID, setMyUID] = React.useState('');

  const [storiesData, setStoriesData] = React.useState([]);

  function checkJwtKey(currentJwtKey) {
    const currentKey = JwtKeyMMKV.getString('currentUserJwtKey');
    if (currentKey !== currentJwtKey) {
      JwtKeyMMKV.delete('currentUserJwtKey');
      if (auth()?.currentUser != null) {
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
            navigation?.navigate('login');
            console.error('failed loggin out the user');
          });
      }
    }
  }

  async function updateUserActiveStatus() {
    await firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        active_status: activeStatusState === true ? 'normal' : 'recently',
        active_time:
          newActiveTime === 'Last seen recently'
            ? 'Last seen recently'
            : firestore?.Timestamp?.fromDate(new Date()),
      });
  }

  const deleteCurrentStory = useCallback(async (uid, sid) => {
    return await firestore()
      .collection('users')
      .doc(uid)
      .collection('stories')
      .doc(sid)
      .delete();
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
              }
            }
            firestore()
              .collection('users')
              .doc(documentSnapshot?.id)
              .collection('stories')
              .onSnapshot(subCollectionSnapshot => {
                subCollectionSnapshot?.forEach(subDocument => {
                  if (
                    subDocument?.data()?.time &&
                    (subDocument?.data()?.text || subDocument?.data()?.image)
                  ) {
                    if (
                      firestore?.Timestamp?.fromDate(new Date()) -
                        subDocument?.data()?.time?.toDate() >
                      86400000
                    ) {
                      deleteCurrentStory(documentSnapshot?.id, subDocument?.id);
                    } else {
                      currentStoryData.push({
                        ...subDocument?.data(),
                        avatar: documentSnapshot?.data()?.avatar,
                        first_name: documentSnapshot?.data()?.first_name,
                        last_name: documentSnapshot?.data()?.last_name,
                        uid: documentSnapshot?.data()?.uid,
                        sid: subDocument?.id,
                      });
                    }
                  }
                  setStoriesData(currentStoryData);
                });
              });
          }
          setLoading(false);
        });
      });
    return () => {
      userSusbcribe();
    };
  }, []);

  const handleStickyItemPress = () => navigation.navigate('addStory');

  // render
  const renderItem = ({item, index}) => (
    <View
      key={`item-${index}`}
      style={{
        backgroundColor: 'red',
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
      }}
    />
  );

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
      <Provider>
        <MiniBaseView>
          <View style={styles.toolbar}>
            <View style={styles.left_side}>
              <Pressable
                hitSlop={15}
                onPress={() => {
                  navigation.navigate('settings');
                }}>
                <Avatar.Image
                  size={35.5}
                  source={avatarURL ? {uri: avatarURL} : PurpleBackground}
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
                  navigation?.navigate('discover');
                  updateUserActiveStatus();
                }}>
                <Avatar.Icon
                  icon={CreateImage}
                  size={37.5}
                  color={COLORS.black}
                  style={styles.right_icon}
                  theme={{
                    colors: {
                      primary: COLORS.rippleColor,
                    },
                  }}
                />
              </Pressable>
            </View>
          </View>
          <StickyItemFlatList
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            separatorSize={SEPARATOR_SIZE}
            borderRadius={BORDER_RADIUS}
            stickyItemWidth={STICKY_ITEM_WIDTH}
            stickyItemHeight={STICKY_ITEM_HEIGHT}
            stickyItemBackgroundColors={STICKY_ITEM_BACKGROUNDS}
            stickyItemContent={props => <MoonStickyStoryItem {...props} />}
            onStickyItemPress={handleStickyItemPress}
            data={data}
            renderItem={renderItem}
          />
        </MiniBaseView>
      </Provider>
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
});

export default HomeStoriesScreen;
