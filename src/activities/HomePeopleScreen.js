import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import PersonImage from '../assets/images/person.png';
import CreateImage from '../assets/images/create.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import ActivePeopleList from '../components/HomeScreen/ActivePeopleList';

const HomePeopleScreen = () => {
  const navigation = useNavigation();

  const [Loading, setLoading] = React.useState(true);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [masterData, setMasterData] = React.useState([]);

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [activeStatusState, setActiveStatusState] = React.useState(null);

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
        active_status: activeStatusState == true ? 'normal' : 'recently',
        active_time:
          newActiveTime == 'Last seen recently'
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
          setAvatarURL(documentSnapshot?.data()?.avatar);
          checkJwtKey(documentSnapshot?.data()?.jwtKey);
          if (documentSnapshot?.data()?.active_status === 'normal') {
            setActiveStatusState(true);
          } else {
            setActiveStatusState(false);
          }
          setNewActiveTime(documentSnapshot?.data()?.active_time);
          setLoading(false);
        }
      });
    /*
    const onSecondValueChange = database()
      .ref('/users/')
      .on('value', snapshot => {
        const activeSnapshot = [];
        snapshot?.forEach(childSnapshot => {
          if (
            childSnapshot?.val().active_status == 'normal' &&
            Date.now() - childSnapshot?.val().active_time < 60000
          ) {
            if (
              childSnapshot?.val().avatar &&
              childSnapshot?.val().first_name &&
              childSnapshot?.val().last_name &&
              childSnapshot?.val().active_status &&
              childSnapshot?.val().active_time
            ) {
              activeSnapshot.push({
                avatar: childSnapshot?.val().avatar,
                first_name: childSnapshot?.val().first_name,
                last_name: childSnapshot?.val().last_name,
                active_status: childSnapshot?.val().active_status,
                active_time: childSnapshot?.val().active_time,
              });
            }
          }
          setMasterData(activeSnapshot);
          console.log(masterData);
        });
      });
      */
    return () => {
      userSusbcribe();
      /*
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
      database().ref('/users/').off('value', onSecondValueChange);
      */
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
      <MiniBaseView>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            {avatarURL ? (
              <Avatar.Image
                size={35}
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
            <Text style={styles.top_text}>People</Text>
          </View>
          <View style={styles.right_side}>
            <Pressable
              onPress={() => {
                navigation.navigate('discover');
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
        <ActivePeopleList
          ListData={masterData}
          onPressTrigger={null}
          onLongPressTrigger={null}
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
    fontSize: 22,
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
export default React.memo(HomePeopleScreen);
