/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useEffect} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from 'config/Miscellaneous';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {PurpleBackground} from '../index.d';
import {fontValue, heightPercentageToDP} from 'config/Dimensions';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView';
import Spacer from '../components/Spacer/Spacer';
import ViewItem from '../components/UserProfileScreen/ViewItem';
import ViewItemTitle from '../components/UserProfileScreen/ViewItemTitle';
import Clipboard from '@react-native-clipboard/clipboard';
import {InfoToast} from 'components/ToastInitializer/ToastInitializer';
import ImageView from 'react-native-image-viewing';
import {ActivityIndicator} from 'react-native-paper';
import {DecryptAES} from 'utils/crypto/cryptoTools';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';

interface UserProfileProps {
  route: RouteProp<RootStackParamList, 'userProfile'>;
}

const UserProfileScreen = (props: UserProfileProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const userUID = props?.route?.params?.userProfile?.uid;
  const cameFrom = props?.route?.params?.userProfile?.cameFrom;

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [avatarURL, setAvatarURL] = React.useState('');
  const [bioText, setBioText] = React.useState('');
  const [joinedDate, setJoinedDate] = React.useState();
  const [usernameText, setUsername] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState('');
  const [activeTime, setActiveTime] = React.useState<string | Date>('');
  const [phoneNumberStatus, setPhoneNumberStatus] = React.useState('');

  const [loading, setLoading] = React.useState(true);
  const [imageViewVisible, setImageViewVisible] = React.useState(false);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(userUID)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          setFirstName(documentSnapshot?.data()?.first_name);
          setLastName(documentSnapshot?.data()?.last_name);
          setAvatarURL(documentSnapshot?.data()?.avatar);
          setUsername(documentSnapshot?.data()?.username);
          setPhoneNumber(documentSnapshot?.data()?.phone_number);
          setPhoneNumberStatus(documentSnapshot?.data()?.phone_status);
          setActiveStatus(documentSnapshot?.data()?.active_status);
          if (documentSnapshot?.data()?.active_time === 'Last seen recently') {
            setActiveTime(documentSnapshot?.data()?.active_time);
          } else {
            setActiveTime(documentSnapshot?.data()?.active_time?.toDate());
          }
          if (documentSnapshot?.data()?.bio) {
            setBioText(documentSnapshot?.data()?.bio);
          }
          if (documentSnapshot?.data()?.created_At) {
            setJoinedDate(documentSnapshot?.data()?.created_At?.toDate());
          } else {
            setJoinedDate(documentSnapshot?.data()?.info?.created_At?.toDate());
          }
          setLoading(false);
        }
      });
    return () => {};
  }, [userUID]);

  if (loading) {
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
    <>
      <StatusBar
        backgroundColor={
          imageViewVisible ? COLORS.primaryDark : COLORS.primaryLight
        }
        animated={true}
        barStyle={imageViewVisible ? 'light-content' : 'dark-content'}
      />
      <MiniBaseView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <View style={{alignSelf: 'center'}}>
            <Pressable
              style={styles.profileImage}
              onPress={() => setImageViewVisible(true)}>
              <Image
                source={avatarURL ? {uri: avatarURL} : PurpleBackground}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </Pressable>
            {cameFrom === 'others' ? (
              <Pressable
                style={styles.add}
                onPress={() => {
                  navigation?.navigate('chat', {item: userUID});
                }}>
                <MaterialIcons name="chat" size={18} color={COLORS.white} />
              </Pressable>
            ) : (
              <></>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.text,
                {fontWeight: '200', fontSize: fontValue(34)},
              ]}>
              {`${firstName}${' '}${lastName}`}
            </Text>
            <Text
              style={[
                styles.text,
                {color: COLORS.black, opacity: 0.4, fontSize: fontValue(14)},
              ]}>
              {activeTime instanceof Date && activeStatus === 'normal'
                ? firestore?.Timestamp?.fromDate(new Date())
                    ?.toDate()
                    .getTime() -
                    activeTime.getTime() >
                  86400000
                  ? `active on ${moment(activeTime)?.format(
                      "YYYY 'MMMM DD - hh:mm A",
                    )}`
                  : `last seen on ${moment(activeTime)?.format('hh:mm A')}`
                : 'Last seen recently'}
            </Text>
          </View>
          <Spacer height={heightPercentageToDP(2)} />
          <ViewItemTitle titleItem={'Info'} />
          {bioText ? (
            <ViewItem
              withDivider
              enableDescription={true}
              descriptionColor={COLORS.black}
              descriptionText={bioText}
              rippleColor={COLORS.rippleColor}
              titleColor={COLORS.accentLight}
              titleText={'Biography'}
              onLongPressTrigger={() => {
                Clipboard.setString(bioText);
                InfoToast(
                  'bottom',
                  'Biography copied!',
                  `${firstName}${' '}${lastName}'s biography has been copied to Clipboard.`,
                  true,
                  3000,
                );
              }}
            />
          ) : (
            <></>
          )}
          <ViewItem
            withDivider
            enableDescription={true}
            descriptionColor={COLORS.black}
            descriptionText={
              phoneNumberStatus === 'none' ? DecryptAES(phoneNumber) : 'Unknown'
            }
            rippleColor={COLORS.rippleColor}
            titleColor={COLORS.accentLight}
            titleText={'Phone number'}
            onLongPressTrigger={() => {
              if (phoneNumberStatus === 'none') {
                Clipboard.setString(DecryptAES(phoneNumber));
                InfoToast(
                  'bottom',
                  'Number copied!',
                  `${firstName}${' '}${lastName}'s number has been copied to Clipboard.`,
                  true,
                  3000,
                );
              }
            }}
          />
          <ViewItem
            withDivider
            enableDescription={true}
            descriptionColor={COLORS.black}
            descriptionText={usernameText}
            rippleColor={COLORS.rippleColor}
            titleColor={COLORS.accentLight}
            titleText={'Username'}
            onLongPressTrigger={() => {
              Clipboard.setString(usernameText);
              InfoToast(
                'bottom',
                'username copied!',
                `${firstName}${' '}${lastName}'s username has been copied to Clipboard.`,
                true,
                3000,
              );
            }}
          />
          <ViewItem
            withDivider
            enableDescription={true}
            descriptionColor={COLORS.black}
            descriptionText={`${firstName} ${lastName} have a hand since ${moment(
              joinedDate,
            )?.format('YYYY MMMM MM')}`}
            rippleColor={COLORS.rippleColor}
            titleColor={COLORS.accentLight}
            titleText={'Joined date'}
            onLongPressTrigger={() => {
              Clipboard.setString(usernameText);
              InfoToast(
                'bottom',
                'username copied!',
                `${firstName}${' '}${lastName}'s username has been copied to Clipboard.`,
                true,
                3000,
              );
            }}
          />
        </ScrollView>
        <ImageView
          images={[{uri: avatarURL}]}
          imageIndex={0}
          visible={imageViewVisible}
          animationType={'slide'}
          onRequestClose={() => setImageViewVisible(false)}
          presentationStyle={'fullScreen'}
        />
      </MiniBaseView>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  profileImage: {
    width: 150 - 0.1 * 150,
    height: 150 - 0.1 * 150,
    borderRadius: 100,
    overflow: 'hidden',
  },
  add: {
    backgroundColor: COLORS.black,
    position: 'absolute',
    bottom: 5 - 0.1 * 5,
    right: 5 - 0.1 * 5,
    width: 35,
    height: 35,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16 - 0.1 * 16,
  },
});

export default UserProfileScreen;
