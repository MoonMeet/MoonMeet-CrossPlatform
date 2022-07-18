import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Avatar} from 'react-native-paper';
import {StatusBar, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back_48.png';
import {Text, View} from 'react-native';
import {AvatarHeaderScrollView} from 'react-native-sticky-parallax-header';
import MenuIcon from '../assets/images/menu_48.png';
import moment from 'moment';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const userUID = useRoute()?.params?.uid;

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [avatarURL, setAvatarURL] = React.useState('');
  const [bioText, setBioText] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const image = () => {
    return (
      <>
        <Avatar.Icon
          icon={BackImage}
          size={24}
          color={COLORS.primaryLight}
          style={{opacity: 0.8}}
        />
      </>
    );
  };

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
            console.log(documentSnapshot?.data());
            setFirstName(documentSnapshot?.data()?.first_name);
            setLastName(documentSnapshot?.data()?.last_name);
            setAvatarURL(documentSnapshot?.data()?.avatar);
            if (documentSnapshot?.data()?.bio) {
              setBioText(documentSnapshot?.data()?.bio);
            } else if (documentSnapshot?.data()?.created_At) {
              setBioText(documentSnapshot?.data()?.created_At.toDate());
            }
            setLoading(false);
          }
        }
      });
    return () => {};
  }, [userUID]);

  if (loading) {
    return <></>;
  }

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={COLORS.accentLight}
      />
      <AvatarHeaderScrollView
        leftTopIcon={
          <Avatar.Icon
            icon={BackImage}
            size={24}
            color={COLORS.primaryLight}
            style={{opacity: 0.8}}
          />
        }
        leftTopIconOnPress={() => {
          navigation?.goBack();
        }}
        rightTopIcon={MenuIcon}
        contentContainerStyle={{
          backgroundColor: COLORS.primaryLight,
        }}
        containerStyle={styles.stretchContainer}
        backgroundColor={COLORS.accentLight}
        hasBorderRadius
        image={{uri: avatarURL}}
        subtitle={'Joined on ' + moment(bioText)?.format('MMMM Do YYYY')}
        subtitleStyle={styles.subtitleStyle}
        title={firstName + ' ' + lastName}
        titleStyle={styles.titleStyle}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
          <Text>Hello There</Text>
        </View>
      </AvatarHeaderScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
  },
  subtitleStyle: {
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
  },
  screenContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
  },
});
export default UserProfileScreen;
