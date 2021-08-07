import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BaseView from '../components/BaseView/BaseView';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-paper';
import PersonImage from '../assets/images/person.png';

const HomeScreen = () => {
  const [avatarURL, setAvatarURL] = React.useState('');

  useEffect(() => {
    const instantFetching = setTimeout(() => {
      fetchAvatar();
    }, 0);
    return () => {
      clearTimeout(instantFetching);
    };
  });

  const fetchAvatar = () => {
    database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (snapshot?.val().avatar) {
          setAvatarURL(snapshot?.val().avatar);
          //console.log(avatarURL);
        }
      });
  };

  return (
    <BaseView>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          {avatarURL ? (
            <Avatar.Image
              size={35}
              source={avatarURL ? {uri: avatarURL} : null}
              theme={{
                colors: {
                  primary: COLORS.rippleColor,
                },
              }}
            />
          ) : (
            <Avatar.Icon
              icon={PersonImage}
              size={35}
              color={COLORS.accentLight}
              style={{
                overflow: 'hidden',
                paddingBottom: '0.2%',
                paddingRight: '0.2%',
              }}
              theme={{
                colors: {
                  primary: COLORS.rippleColor,
                },
              }}
            />
          )}
          <Text style={styles.top_text}>Moon Meet</Text>
        </View>
      </View>
    </BaseView>
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
  },
  top_text: {
    position: 'relative',
    fontSize: 26,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
});
export default HomeScreen;
