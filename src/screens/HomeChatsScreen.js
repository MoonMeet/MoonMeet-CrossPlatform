import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import {Avatar, Provider} from 'react-native-paper';
import PersonImage from '../assets/images/person.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import MessagesList from '../components/HomeScreen/MessagesList';
import AsyncStorage from '@react-native-community/async-storage';
import StoriesList from '../components/HomeScreen/StoriesList';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';

const HomeChatsScreen = () => {
  const navigation = useNavigation();

  const [chatsData, setChatsData] = React.useState([]);

  const currentStoryData = [];

  const [avatarURL, setAvatarURL] = React.useState('');

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

  const [storiesData, setStoriesData] = React.useState([]);

  const [myUID, setMyUID] = React.useState('');

  function checkJwtKey(currentJwtKey) {
    AsyncStorage?.getItem('currentUserJwtKey')?.then(_asyncJwt => {
      if (_asyncJwt !== currentJwtKey) {
        AsyncStorage.removeItem('currentUserJwtKey');
        if (auth()?.currentUser != null) {
          auth()
            ?.signOut()
            .then(() => {
              navigation.navigate('login');
              InfoToast(
                'bottom',
                'Session Expired',
                'Your session in this account has been expired, Please re-login',
                true,
                3500,
              );
            })
            .catch(() => {
              navigation.navigate('login');
            });
        }
      }
    });
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
            : Date.now(),
      });
  }

  async function deleteCurrentStory(uid, sid) {
    return await firestore()
      .collection('users')
      .doc(uid)
      .collection('stories')
      .doc(sid)
      .delete();
  }

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
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(documentSnapshot => {
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
      });
    firestore()
      .collection('users')
      .get()
      .then(collectionSnapshot => {
        collectionSnapshot?.forEach(documentSnapshot => {
          if (documentSnapshot?.exists) {
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
                    if (Date.now() - subDocument?.data()?.time > 86400000) {
                      deleteCurrentStory(
                        documentSnapshot?.id,
                        subDocument?.data()?.sid,
                      );
                    }
                    currentStoryData.push({
                      ...subDocument?.data(),
                      avatar: documentSnapshot?.data()?.avatar,
                      first_name: documentSnapshot?.data()?.first_name,
                      last_name: documentSnapshot?.data()?.last_name,
                      uid: documentSnapshot?.data()?.uid,
                      sid: subDocument?.id,
                    });
                  }
                  setStoriesData(currentStoryData);
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
          const data = collectionSnapshot?.docs?.map(subMap => ({
            ...subMap?.data(),
          }));
          let chatData = [];
          if (data) {
            chatData = Object?.values(data)?.sort(
              (a, b) => a?.last_message_time - b?.last_message_time,
            );
          }
          setChatsData(chatData);
        }
      });

    return () => {
      userSusbcribe();
      chatSubscribe();
    };
  }, []);

  return (
    <Provider>
      <MiniBaseView>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            {avatarURL ? (
              <Pressable
                hitSlop={15}
                onPress={() => {
                  navigation.navigate('settings');
                }}>
                <Avatar.Image
                  size={35.5}
                  source={avatarURL ? {uri: avatarURL} : null}
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
            ) : (
              <Avatar.Icon
                icon={PersonImage}
                size={40}
                color={COLORS.black}
                style={{
                  overflow: 'hidden',
                  marginRight: '-1%',
                  opacity: 0.4,
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            )}
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.top_text}>Chats</Text>
          </View>
          <View style={styles.right_side}>
            <Pressable
              onPress={() => {
                navigation.navigate('searchChats');
                updateUserActiveStatus();
              }}>
              <MaterialIcons
                name={'search'}
                size={fontValue(25)}
                color={COLORS.darkGrey}
              />
            </Pressable>
          </View>
        </View>
        <StoriesList ListData={storiesData} myUID={myUID} />
        <MessagesList ListData={chatsData} />
      </MiniBaseView>
    </Provider>
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
    paddingRight: heightPercentageToDP(0.25),
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
  above_stories: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pressContainerTop: {
    position: 'relative',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingLeft: '3%',
    paddingRight: '2.5%',
  },
  pressContainerTopRight: {
    position: 'relative',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingLeft: '1.5%',
  },
});

export default HomeChatsScreen;
