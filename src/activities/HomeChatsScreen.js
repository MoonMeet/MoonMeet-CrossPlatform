import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-paper';
import PersonImage from '../assets/images/person.png';
import SearchImage from '../assets/images/search.png';
import ChatsJson from '../assets/data/json/test/chats.json';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import MessagesList from '../components/HomeScreen/MessagesList';
import AsyncStorage from '@react-native-community/async-storage';
import StoriesList from '../components/HomeScreen/StoriesList';

const HomeChatsScreen = () => {
  const navigation = useNavigation();

  const _testChats = ChatsJson;

  const [avatarURL, setAvatarURL] = React.useState('');

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

  const [storiesData, setStoriesData] = React.useState([]);

  function checkJwtKey(currentJwtKey: string) {
    AsyncStorage.getItem('currentUserJwtKey').then(_asyncJwt => {
      if (_asyncJwt !== currentJwtKey) {
        auth()
          ?.signOut()
          .then(() => {
            AsyncStorage.removeItem('currentUserJwtKey');
            navigation.navigate('login');
          });
      }
    });
  }

  function updateUserActiveStatus() {
    database()
      .ref(`/users/${auth()?.currentUser.uid}`)
      .update({
        active_status: activeStatusState === true ? 'normal' : 'recently',
        active_time:
          newActiveTime === 'Last seen recently'
            ? 'Last seen recently'
            : Date.now(),
      });
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

  async function deleteCurrentStory(uid, sid) {
    return await database().ref(`/stories/${uid}/${sid}`).remove();
  }

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().jwtKey &&
          snapshot?.val().active_status &&
          snapshot?.val().active_time
        ) {
          setAvatarURL(snapshot?.val().avatar);
          checkJwtKey(snapshot?.val().jwtKey);
          if (snapshot?.val().active_status === 'normal') {
            setActiveStatusState(true);
          } else {
            setActiveStatusState(false);
          }
          setNewActiveTime(snapshot?.val().active_time);
        }
      });
    const secondOnValueChange = database()
      .ref('/stories/')
      .on('value', snapshot => {
        const storiesSnapshot = [];
        snapshot?.forEach(childSnapshot => {
          console.log(childSnapshot);
          childSnapshot?.forEach(threeYearsOldSnapshot => {
            if (
              threeYearsOldSnapshot?.val().avatar &&
              threeYearsOldSnapshot?.val().first_name &&
              threeYearsOldSnapshot?.val().last_name &&
              threeYearsOldSnapshot?.val().sid &&
              threeYearsOldSnapshot?.val().uid &&
              threeYearsOldSnapshot?.val().time
            ) {
              if (Date.now() - threeYearsOldSnapshot?.val().time > 86400000) {
                deleteCurrentStory(
                  auth().currentUser.uid,
                  threeYearsOldSnapshot?.val().sid,
                );
              }
              storiesSnapshot.push({
                avatar: threeYearsOldSnapshot?.val().avatar,
                first_name: threeYearsOldSnapshot?.val().first_name,
                last_name: threeYearsOldSnapshot?.val().last_name,
                sid: threeYearsOldSnapshot?.val().sid,
                uid: threeYearsOldSnapshot?.val().uid,
                text: threeYearsOldSnapshot?.val().text,
                image: threeYearsOldSnapshot.val().image,
                time: threeYearsOldSnapshot?.val().time,
              });
            }
            setStoriesData(storiesSnapshot);
          });
        });
      });
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
      database().ref('/stories/').off('value', secondOnValueChange);
    };
  }, []);

  return (
    <MiniBaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          {avatarURL ? (
            <Avatar.Image
              size={40}
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
            <Avatar.Icon
              icon={SearchImage}
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
      <StoriesList ListData={storiesData} />
      <MessagesList ListData={_testChats} />
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
    fontSize: 22,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
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

export default React.memo(HomeChatsScreen);
