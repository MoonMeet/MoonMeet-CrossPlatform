import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar, TouchableRipple} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back.png';
import {Box, HStack} from 'native-base';
import {heightPercentageToDP} from '../config/Dimensions';

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
    <BaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={() => {
              navigation?.goBack();
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
      </View>
      <HStack flexDirection={'row'} padding={heightPercentageToDP(1.5)}>
        <Box flexDirection={'row'} alignItems={'center'}>
          <Avatar.Image
            size={60}
            source={avatarURL ? {uri: avatarURL} : null}
          />
          <View
            style={{
              height: '-1%',
              width: '3%',
            }}
          />
          <Box flexDirection={'column'} alignItems={'flex-start'}>
            <Text style={styles.under_header_text}>
              {firstName + ' ' + lastName}
            </Text>
            <Text
              onPress={() => navigation?.navigate('addBio')}
              style={styles.bioText(bioText)}>
              {bioText}
            </Text>
          </Box>
        </Box>
      </HStack>
    </BaseView>
  );
};
const styles = StyleSheet.create({
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
  under_header_box: {
    padding: heightPercentageToDP(1),
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
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
export default UserProfileScreen;
