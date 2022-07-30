import React, {useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import ViewItem from '../components/PrivacySecurityScreen/ViewItem';
import ViewItemTitle from '../components/PrivacySecurityScreen/ViewItemTitle';
import Spacer from '../components/Spacer/Spacer';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PrivacySecurityScreen = () => {
  const navigation = useNavigation();

  const [phoneNumberStatus, setPhoneNumberStatus] = React.useState('');
  const [lastSeenNOnline, setLastSeenNOnline] = React.useState('');

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const UserSubscribe = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot?.exists) {
          setPhoneNumberStatus(documentSnapshot?.data()?.phone_status);
          setLastSeenNOnline(documentSnapshot?.data().active_status);
          setLoading(false);
        }
      });
    return () => UserSubscribe();
  });

  if (loading) {
    return <></>;
  }

  return (
    <BaseView>
      <View style={{flex: 1}} onPress={undefined}>
        <Spacer height={heightPercentageToDP(0.25)} />
        <ViewItemTitle titleItem="Privacy" />
        <ViewItem
          titleText={'Phone number'}
          rippleColor={COLORS.rippleColor}
          titleColor={COLORS.black}
          enableDescription
          descriptionText={
            phoneNumberStatus === 'none' ? 'Everyone' : 'Only me'
          }
          withDivider
          onPressTrigger={undefined}
        />
        <ViewItem
          titleText={'Last seen & Online'}
          rippleColor={COLORS.rippleColor}
          titleColor={COLORS.black}
          enableDescription
          descriptionText={
            lastSeenNOnline === 'normal' ? 'Online' : 'Last seen recently'
          }
          withDivider
          onPressTrigger={() => navigation?.navigate('activeStatus')}
        />
        <View style={styles.greyView}>
          <Text style={styles.greyViewText}>
            Choose who can see your information.
          </Text>
        </View>
        <ViewItemTitle titleItem="Security" />
        <ViewItem
          titleText={'Passcode lock'}
          rippleColor={COLORS.rippleColor}
          titleColor={COLORS.black}
          withDivider
          onPressTrigger={() => navigation?.navigate('passcodeSetup')}
        />
        <ViewItem
          titleText={'Devices'}
          rippleColor={COLORS.rippleColor}
          titleColor={COLORS.black}
          withDivider
          onPressTrigger={() => navigation?.navigate('devices')}
        />
        <View style={styles.greyView}>
          <Text style={styles.greyViewText}>
            Manage your sessions on all your devices.
          </Text>
        </View>
      </View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  greyView: {
    height: heightPercentageToDP(4),
    justifyContent: 'center',
    paddingLeft: widthPercentageToDP(2),
    backgroundColor: COLORS.dimmed,
  },
  greyViewText: {
    color: COLORS.grey,
    fontSize: fontValue(14),
    fontFamily: FONTS.regular,
  },
});

export default PrivacySecurityScreen;
