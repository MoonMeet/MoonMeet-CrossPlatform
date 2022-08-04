import React, {useEffect, useMemo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Image, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {PurpleBackground} from '../index.d';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const stackRoute = useRoute();
  const userUID = useMemo(() => stackRoute?.params?.uid, []);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [avatarURL, setAvatarURL] = React.useState('');
  const [bioText, setBioText] = React.useState('');
  const [joinedDate, setJoinedDate] = React.useState();
  const [username, setUsername] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState('');
  const [activeTime, setActiveTime] = React.useState();
  const [phoneNumberStatus, setPhoneNumberStatus] = React.useState('');
  const [loading, setLoading] = React.useState(true);

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
            setUsername(documentSnapshot?.data()?.username);
            setPhoneNumber(documentSnapshot?.data()?.phone_number);
            setPhoneNumberStatus(documentSnapshot?.data()?.phone_status);
            setActiveStatus(documentSnapshot?.data()?.active_status);
            setActiveTime(documentSnapshot?.data()?.active_time?.toDate());
            if (documentSnapshot?.data()?.bio) {
              setBioText(documentSnapshot?.data()?.bio);
            }
            if (documentSnapshot?.data()?.created_At) {
              setJoinedDate(documentSnapshot?.data()?.created_At?.toDate());
            } else {
              setJoinedDate(
                documentSnapshot?.data()?.info?.created_At?.toDate(),
              );
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
    <MiniBaseView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View style={{alignSelf: 'center'}}>
          <View style={styles.profileImage}>
            <Image
              source={avatarURL ? {uri: avatarURL} : PurpleBackground}
              style={styles.profileImage}
              resizeMode="contain"
            />
          </View>

          {/*<View style={styles.active} />*/}
          <View style={styles.add}>
            <MaterialIcons name="chat" size={24} color={COLORS.white} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[styles.text, {fontWeight: '200', fontSize: fontValue(34)}]}>
            {`${firstName}${' '}${lastName}`}
          </Text>
          <Text
            style={[
              styles.text,
              {color: COLORS.black, opacity: 0.4, fontSize: fontValue(14)},
            ]}>
            {activeStatus === 'normal'
              ? firestore?.Timestamp?.fromDate(new Date())?.toDate() -
                  activeTime >
                8640000
                ? `active on ${moment(activeTime)?.format(
                    'YYYY MMMM DD - hh:mm A',
                  )}`
                : `last seen on ${moment(activeTime)?.format('hh:mm A')}`
              : 'Last seen recently'}
          </Text>
        </View>
      </ScrollView>
    </MiniBaseView>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  profileImage: {
    width: 200 - 0.1 * 200,
    height: 200 - 0.1 * 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  active: {
    backgroundColor: '#34FFB9',
    position: 'absolute',
    bottom: heightPercentageToDP(3),
    left: widthPercentageToDP(2.25),
    padding: heightPercentageToDP(1),
    height: heightPercentageToDP(2),
    width: widthPercentageToDP(2),
    borderRadius: 20,
  },
  add: {
    backgroundColor: '#41444B',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(5),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16 - 0.1 * 16,
  },
  recent: {
    marginLeft: 78 - 0.1 * 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIndicator: {
    backgroundColor: '#CABFAB',
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
});
export default UserProfileScreen;
