/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {BackHandler, Pressable, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView';
import PrivacyBottomSheet from '@components/PrivacySecurityScreen/PrivacyBottomSheet';
import ViewItem from '@components/PrivacySecurityScreen/ViewItem';
import ViewItemTitle from '@components/PrivacySecurityScreen/ViewItemTitle';
import Spacer from '../components/Spacer/Spacer';
import {InfoToast} from 'components/ToastInitializer/ToastInitializer';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'config/Dimensions';
import {COLORS, FONTS} from 'config/Miscellaneous';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const PrivacySecurityScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const PnPRef = useRef<BottomSheetModal>(null);
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
          setLastSeenNOnline(documentSnapshot?.data()?.active_status);
          setLoading(false);
        }
      });
    return () => {
      UserSubscribe();
    };
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
          withDivider={true}
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
          withDivider={true}
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
          withDivider={true}
          onPressTrigger={() => {
            if (__DEV__) {
              navigation?.navigate('passcodeSetup');
            } else {
              InfoToast(
                'bottom',
                'Feature will be available soon',
                'stay tuned for Moon Meet new updates.',
                true,
                2000,
              );
            }
          }}
        />
        <ViewItem
          titleText={'Devices'}
          rippleColor={COLORS.rippleColor}
          titleColor={COLORS.black}
          withDivider={true}
          onPressTrigger={() => navigation?.navigate('devices')}
        />
        <View style={styles.greyView}>
          <Text style={styles.greyViewText}>
            Manage your sessions on all your devices.
          </Text>
        </View>
        <PrivacyBottomSheet
          sheetRef={PnPRef}
          index={0}
          snapPoints={snapPoints}
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

export default PrivacySecurityScreen;
