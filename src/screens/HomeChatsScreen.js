import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import {Avatar, Provider} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import MessagesList from '../components/HomeScreen/MessagesList';
import StoriesList from '../components/HomeScreen/StoriesList';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import {PurpleBackground} from '../index.d';
import {reverse, sortBy} from 'lodash';
import {JwtKeyMMKV} from '../config/MMKV/JwtKeyMMKV';

const HomeChatsScreen = () => {
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
                      firestore.Timestamp.fromDate(new Date()) -
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
            <Text style={styles.top_text}>Chats</Text>
          </View>
          <View style={styles.right_side}>
            <Pressable
              onPress={() => {
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
