import React, {useEffect} from 'react';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, Surface} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import BackImage from '../assets/images/back.png';

const SettingsScreen = () => {
  const [avatarURL, setAvatarURL] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const fetchUser = () => {
    database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().first_name &&
          snapshot?.val().last_name
        ) {
          setAvatarURL(snapshot?.val().avatar);
          setFirstName(snapshot?.val().first_name);
          setLastName(snapshot?.val().last_name);
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
      backgroundColor: COLORS.accentLight,
    },
    under_header: {
      padding: '2%',
      marginTop: '2%',
      height: '12.5%',
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
      marginLeft: 10,
      marginRight: 10,
    },
    toolbar: {
      padding: '2%',
      flexDirection: 'row',
      elevation: 3,
    },
    toolbar_text: {
      fontSize: 22,
      paddingLeft: '3%',
      paddingRight: '3%',
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
    under_header_text: {
      position: 'relative',
      fontSize: 26,
      paddingLeft: '3%',
      paddingRight: '3%',
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
  });
  return (
    <MiniBaseView>
      <Surface style={styles.toolbar}>
        <View style={styles.left_side}>
          <Avatar.Icon
            icon={BackImage}
            size={40}
            color={COLORS.black}
            style={{
              overflow: 'hidden',
              marginBottom: '0.2%',
              marginRight: '0.2%',
              opacity: 0.4,
            }}
            theme={{
              colors: {
                primary: COLORS.transparent,
              },
            }}
          />
        </View>
        <View style={styles.mid_side}>
          <Text style={styles.toolbar_text}>Me</Text>
        </View>
      </Surface>
      <View style={styles.under_header}>
        <Avatar.Image size={85} source={avatarURL ? {uri: avatarURL} : null} />
        <Text style={styles.under_header_text}>
          {firstName + ' ' + lastName}
        </Text>
      </View>
    </MiniBaseView>
  );
};
export default SettingsScreen;
