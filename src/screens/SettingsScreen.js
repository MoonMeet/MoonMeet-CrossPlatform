import React, {useEffect} from 'react';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {ActivityIndicator, Avatar, Provider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import ScrollViewData from '../components/SettingsScreen/ScrollViewContainer';
import {fontValue} from '../config/Dimensions';

const SettingsScreen = () => {
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
    const usersSubsriber = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(documentSnapshot => {
        if (
          documentSnapshot?.data()?.avatar &&
          documentSnapshot?.data()?.first_name &&
          documentSnapshot?.data()?.last_name &&
          documentSnapshot?.data()?.username &&
          documentSnapshot?.data()?.active_status &&
          documentSnapshot?.data()?.active_time
        ) {
          setAvatarURL(documentSnapshot?.data()?.avatar);
          setFirstName(documentSnapshot?.data()?.first_name);
          setLastName(documentSnapshot?.data()?.last_name);
          setUserName(documentSnapshot?.data()?.username);
          setActiveStatus(documentSnapshot?.data()?.active_status);
          setActiveTime(documentSnapshot?.data()?.active_time);
          if (documentSnapshot?.data()?.bio) {
            setUserBio(documentSnapshot?.data()?.bio);
          }
        }
        setLoading(false);
      });
    return () => {
      usersSubsriber();
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
    <Provider>
      <MiniBaseView>
        {/**<View style={styles.toolbar}>
          <View style={styles.mid_side}>
            <Text style={styles.toolbar_text}>Settings</Text>
          </View>
        </View>*/}
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
    </Provider>
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
    fontSize: fontValue(24),
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: 'bold',
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

export default SettingsScreen;
