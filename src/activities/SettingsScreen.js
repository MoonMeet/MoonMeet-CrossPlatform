import React, {useEffect} from 'react';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, TouchableRipple} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import BackImage from '../assets/images/back.png';
import {useNavigation} from '@react-navigation/native';
import ScrollViewData from '../components/SettingsScreen/ScrollViewContainer';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [avatarURL, setAvatarURL] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const fetchUser = () => {
    database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().first_name &&
          snapshot?.val().last_name &&
          snapshot?.val().username
        ) {
          setAvatarURL(snapshot?.val().avatar);
          setFirstName(snapshot?.val().first_name);
          setLastName(snapshot?.val().last_name);
          setUserName(snapshot?.val().username);
        }
      });
  };
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

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
      fontSize: 18,
      marginLeft: '2.5%',
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
  });
  return (
    <MiniBaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={() => {
              navigation.goBack();
            }}>
            <Avatar.Icon
              icon={BackImage}
              size={37.5}
              color={COLORS.black}
              style={{
                overflow: 'hidden',
                marginRight: '-1%',
                opacity: 0.4,
              }}
              theme={{
                colors: {
                  primary: COLORS.transparent,
                },
              }}
            />
          </TouchableRipple>
        </View>
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
        </View>
        <ScrollViewData
          firstName={firstName}
          lastName={lastName}
          username={userName}
          avatar={avatarURL}
        />
      </ScrollView>
    </MiniBaseView>
  );
};
export default React.memo(SettingsScreen);
