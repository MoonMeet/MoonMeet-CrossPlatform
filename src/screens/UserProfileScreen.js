import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back.png';
import {Text} from 'react-native';
import AvatarHeaderScrollView from 'react-native-sticky-parallax-header';
import ThreeDots from '../assets/images/dots.png';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const userUID = useRoute()?.params?.uid;

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [avatarURL, setAvatarURL] = React.useState('');
  const [bioText, setBioText] = React.useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(userUID)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (
            documentSnapshot?.data()?.avatar &&
            documentSnapshot?.data()?.first_name &&
            documentSnapshot?.data()?.last_name
          ) {
            setFirstName(documentSnapshot?.data()?.first_name);
            setLastName(documentSnapshot?.data()?.last_name);
            setAvatarURL(documentSnapshot?.data()?.avatar);
            if (documentSnapshot?.data()?.bio) {
              setBioText(documentSnapshot?.data()?.bio);
            } else if (documentSnapshot?.data()?.created_At) {
              setBioText(documentSnapshot?.data()?.country_code);
            }
          }
        }
      });
    return () => {};
  }, [userUID]);

  return (
    <AvatarHeaderScrollView
      leftTopIcon={BackImage}
      leftTopIconOnPress={() => {}}
      contentContainerStyle={[COLORS.primaryLight]}
      containerStyle={styles.stretchContainer}
      backgroundColor={COLORS.accentLight}
      hasBorderRadius
      image={{uri: avatarURL}}
      subtitle={bioText}
      title={`${firstName}${' '}${lastName}`}
      titleStyle={styles.titleStyle}
      showsVerticalScrollIndicator={false}>
      <Text>HHSHdoiahnf dnfoihehzjzef nzejnfnelkjaznf sfklzejnfnk </Text>
    </AvatarHeaderScrollView>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: FONTS.regular,
  },
  screenContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});
export default UserProfileScreen;
