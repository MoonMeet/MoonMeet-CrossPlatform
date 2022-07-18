import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Avatar, Provider} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import CreateImage from '../assets/images/create.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fontValue} from '../config/Dimensions';
import {PurpleBackground} from '../index.d';
import AsyncStorage from '@react-native-community/async-storage';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import StoriesList from '../components/HomeScreen/StoriesList';
import NewStoriesList from '../components/HomeScreen/NewStoriesList';

const HomeStoriesScreen = () => {
  const navigation = useNavigation();

  const [Loading, setLoading] = React.useState(true);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

  const currentStoryData = [];

  const [myUID, setMyUID] = React.useState('');

  const [storiesData, setStoriesData] = React.useState([]);

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
                3000,
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
          <NewStoriesList
            ListData={storiesData}
            myUID={auth()?.currentUser?.uid}
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
