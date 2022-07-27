import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import MessagesList from '../components/HomeScreen/MessagesList';
import firestore from '@react-native-firebase/firestore';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import {PurpleBackground} from '../index.d';
import {reverse, sortBy} from 'lodash';
import {JwtKeyMMKV} from '../config/MMKV/JwtKeyMMKV';
import StickyItemFlatList from '@gorhom/sticky-item';
import MoonStickyStoryView from '../components/HomeScreen/MoonStickyStoryView';

const HomeChatsScreen = () => {
  const data = [...Array(20)]
    .fill(0)
    .map((_, index) => ({id: `item-${index}`}));
  // Sticky-Item Config
  const ITEM_WIDTH = 120;
  const ITEM_HEIGHT = 200;
  const STICKY_ITEM_WIDTH = 50;
  const STICKY_ITEM_HEIGHT = 50;
  const STICKY_ITEM_BACKGROUNDS = [COLORS.rippleColor, COLORS.accentLight];
  const SEPARATOR_SIZE = 8;
  const BORDER_RADIUS = 10;

  const handleStickyItemPress = () => navigation?.navigate('addStory');

  const renderItem = ({item, index}) => {
    <Pressable
      onPress={() => {
        console.log('abeth sex ');
      }}>
      <View
        key={`item-${index}`}
        style={{
          backgroundColor: 'red',
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
        }}
      />
    </Pressable>;
  };

  const navigation = useNavigation();

  const [chatsData, setChatsData] = React.useState([]);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

  const [storiesData, setStoriesData] = React.useState([]);

  const [myUID, setMyUID] = React.useState('');

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
            : firestore.Timestamp.fromDate(new Date()),
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
                let tempStoriesData = [];
                subCollectionSnapshot?.forEach(subDocument => {
                  if (
                    subDocument?.data()?.time &&
                    (subDocument?.data()?.text || subDocument?.data()?.image)
                  ) {
                    if (
                      firestore?.Timestamp?.fromDate(new Date()) -
                        subDocument?.data()?.time.toDate() >
                      86400000
                    ) {
                      deleteCurrentStory(documentSnapshot?.id, subDocument?.id);
                    } else {
                      tempStoriesData.push({
                        ...subDocument?.data(),
                        avatar: documentSnapshot?.data()?.avatar,
                        first_name: documentSnapshot?.data()?.first_name,
                        last_name: documentSnapshot?.data()?.last_name,
                        uid: documentSnapshot?.data()?.uid,
                        sid: subDocument?.id,
                      });
                    }
                  }
                  setStoriesData(tempStoriesData);
                });
              });
          }
        });
      });
    const chatSubscribe = firestore()
      .collection('chats')
      .doc(auth()?.currentUser?.uid)
      .collection('discussions')
      .onSnapshot(collectionSnapshot => {
        if (!collectionSnapshot?.empty) {
          let collectionDocs = collectionSnapshot?.docs?.map(subMap => ({
            ...subMap?.data(),
          }));
          collectionDocs = sortBy(collectionDocs, [
            data => data?.time?.toDate(),
          ]);
          collectionDocs = reverse(collectionDocs);
          setChatsData(collectionDocs);
        }
      });
    return () => {
      userSusbcribe();
      chatSubscribe();
    };
  }, []);

  return (
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
          scrollEnabled={true}
          itemHeight={ITEM_HEIGHT}
          showsHorizontalScrollIndicator={false}
          separatorSize={SEPARATOR_SIZE}
          borderRadius={BORDER_RADIUS}
          stickyItemWidth={STICKY_ITEM_WIDTH}
          stickyItemHeight={STICKY_ITEM_HEIGHT}
          stickyItemBackgroundColors={STICKY_ITEM_BACKGROUNDS}
          stickyItemContent={props => (
            <MoonStickyStoryView
              {...props}
              userAvatar={avatarURL}
              tempAvatar={PurpleBackground}
            />
          )}
          onStickyItemPress={handleStickyItemPress}
          data={data}
          renderItem={({item, index}) => (
            <View style={{backgroundColor: 'red'}} />
          )}
        />
      </View>
      <MessagesList ListData={chatsData} />
    </MiniBaseView>
  );
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
