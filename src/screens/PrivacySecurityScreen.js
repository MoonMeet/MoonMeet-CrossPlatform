import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {BackHandler, Pressable, StyleSheet, View} from 'react-native';
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PrivacyBottomSheet from '../components/PrivacySecurityScreen/PrivacyBottomSheet';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';

const PrivacySecurityScreen = () => {
  const navigation = useNavigation();

  const PnPRef = useRef(null);
  const snapPoints = useMemo(
    () => [heightPercentageToDP(10), heightPercentageToDP(25)],
    [],
  );
  const handleOpenModal = useCallback(() => {
    PnPRef?.current?.present();
  }, []);

  const [phoneNumberStatus, setPhoneNumberStatus] = React.useState('');

  const [lastSeenNOnline, setLastSeenNOnline] = React.useState('');

  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        PnPRef?.current?.dismiss();
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

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
    <BaseView>
      <Pressable style={{flex: 1}} onPress={() => PnPRef?.current?.dismiss()}>
        <Spacer height={heightPercentageToDP(0.25)} />
        <ViewItemTitle titleItem="Privacy" />
        <ViewItem
          titleText={'Phone number'}
          rippleColor={COLORS.rippleColor}
          titleColor={COLORS.black}
          enableDescription
          descriptionText={phoneNumberStatus === 'none' ? 'Everyone' : 'Nobody'}
          withDivider
          onPressTrigger={() => handleOpenModal()}
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
        <PrivacyBottomSheet
          sheetRef={PnPRef}
          sheetIndex={0}
          sheetSnapPoints={snapPoints}
          phoneNumberStatus={phoneNumberStatus}
        />
      </Pressable>
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

export default gestureHandlerRootHOC(PrivacySecurityScreen);
