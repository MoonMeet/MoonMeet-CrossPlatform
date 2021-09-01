import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Avatar, Searchbar} from 'react-native-paper';
import PersonImage from '../assets/images/person.png';
import CreateImage from '../assets/images/create.png';
import TestJson from '../assets/data/json/test/stories.json';
import SearchImage from '../assets/images/search.png';
import ClearImage from '../assets/images/clear.png';
import ChatsJson from '../assets/data/json/test/chats.json';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import MessagesList from '../components/HomeScreen/MessagesList';
import StoriesList from '../components/HomeScreen/StoriesList';
import AsyncStorage from '@react-native-community/async-storage';

const HomeChatsScreen = () => {
  const navigation = useNavigation();

  const _testChats = ChatsJson;

  const [avatarURL, setAvatarURL] = React.useState('');

  async function checkJwtKey(currentJwtKey: string) {
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

  const onValueChange = database()
    .ref(`/users/${auth()?.currentUser?.uid}`)
    .on('value', async snapshot => {
      if (snapshot?.val().avatar && snapshot?.val().jwtKey) {
        setAvatarURL(snapshot?.val().avatar);
        await checkJwtKey(snapshot?.val().jwtKey);
      }
    });

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
    onValueChange();
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
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
          <Pressable onPress={() => navigation.navigate('discover')}>
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
      <View
        style={{
          padding: '2%',
        }}>
        <Searchbar
          onChangeText={null}
          value={null}
          placeholder={'Search'}
          icon={SearchImage}
          selectionColor={COLORS.controlNormal}
          platform={Platform.OS}
          style={{
            borderRadius: 150 / 2,
            borderWidth: 1,
            elevation: 0,
            borderColor: COLORS.rippleColor,
          }}
          inputStyle={{
            color: COLORS.accentLight,
          }}
          clearIcon={ClearImage}
        />
      </View>
      {/*<StoriesList
        ListData={_testStories}
        CurrentSection={showStoriesOrOnline}
      />*/}
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
    color: COLORS.accentLight,
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
  mini_text_left: activeStateColor => {
    return {
      fontSize: 16,
      textAlign: 'center',
      color: activeStateColor,
      opacity: activeStateColor === COLORS.accentLight ? 1 : 0.4,
      fontFamily: FONTS.regular,
    };
  },
  mini_text_right: disabledStateColor => {
    return {
      fontSize: 16,
      textAlign: 'center',
      color: disabledStateColor,
      opacity: disabledStateColor === COLORS.accentLight ? 1 : 0.4,
      fontFamily: FONTS.regular,
    };
  },
});

export default React.memo(HomeChatsScreen);
