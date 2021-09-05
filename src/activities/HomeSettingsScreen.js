import React, {useEffect} from 'react';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import ScrollViewData from '../components/SettingsScreen/ScrollViewContainer';

const HomeSettingsScreen = () => {
  const [Loading, setLoading] = React.useState(true);

  const navigation = useNavigation();

  const [avatarURL, setAvatarURL] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [userBio, setUserBio] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState('');
  const [activeTime, setActiveTime] = React.useState('');

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().first_name &&
          snapshot?.val().last_name &&
          snapshot?.val().username &&
          snapshot?.val().active_status &&
          snapshot?.val().active_time
        ) {
          setAvatarURL(snapshot?.val().avatar);
          setFirstName(snapshot?.val().first_name);
          setLastName(snapshot?.val().last_name);
          setUserName(snapshot?.val().username);
          setActiveStatus(snapshot?.val().active_status);
          setActiveTime(snapshot?.val().active_time);
          if (snapshot?.val().bio) {
            setUserBio(snapshot?.val().bio);
          }
        }
        setLoading(false);
      });
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
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
  }
  return (
    <MiniBaseView>
      <View style={styles.toolbar}>
        <View style={styles.mid_side}>
          <Text style={styles.toolbar_text}>Settings</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.under_header}>
          <Avatar.Image
            size={85}
            source={avatarURL ? {uri: avatarURL} : null}
          />
          <Text style={styles.under_header_text}>
            {firstName + ' ' + lastName}
          </Text>
          {userBio ? (
            <Text
              onPress={() => navigation.navigate('addBio')}
              style={styles.bioText(userBio)}>
              {userBio}
            </Text>
          ) : (
            <Text
              style={styles.bioText(userBio)}
              onPress={() => navigation.navigate('addBio')}>
              Tap to add a bio
            </Text>
          )}
        </View>
        <ScrollViewData
          firstName={firstName}
          lastName={lastName}
          username={userName}
          avatar={avatarURL}
          userbio={userBio}
          activeStatus={activeStatus}
          activeTime={activeTime}
        />
      </ScrollView>
    </MiniBaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
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
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '1%',
    marginRight: '2.5%',
  },
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
  },
  toolbar_text: {
    fontSize: 22,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  under_header_text: {
    position: 'relative',
    fontSize: 24,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  bioText: userBio => {
    return {
      position: 'relative',
      fontSize: 16,
      paddingLeft: '2.5%',
      paddingRight: '2.5%',
      paddingTop: '1%',
      textAlign: 'center',
      color: COLORS.black,
      opacity: userBio ? 0.6 : 0.4,
      fontFamily: FONTS.regular,
    };
  },
});

export default React.memo(HomeSettingsScreen);
