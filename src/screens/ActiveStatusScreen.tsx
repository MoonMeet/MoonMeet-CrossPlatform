/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Moon, 2021-2023.
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView.tsx';
import {HelperText, Switch} from 'react-native-paper';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';

const ActiveStatusScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  /**
   * Checking if network is OK before sending SMS or catching a SnackBar Exception.
   */
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      setIsConnected(networkState?.isConnected);
    });
  }, []);

  const [newActiveTime, setNewActiveTime] = React.useState<String>('');

  const [switchState, setSwitchState] = React.useState<boolean | undefined>(
    false,
  );

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (
            documentSnapshot?.data()?.active_status &&
            documentSnapshot?.data()?.active_time
          ) {
            if (documentSnapshot?.data()?.active_status === 'normal') {
              setSwitchState(true);
            } else {
              setSwitchState(false);
            }
            setNewActiveTime(documentSnapshot?.data()?.active_time);
          }
        }
      });
    return () => {};
  }, []);
  return (
    <MiniBaseView>
      <Spacer height={heightPercentageToDP(0.5)} />
      <View style={styles.switchRow}>
        <Text style={styles.activeText}>Show when you're active</Text>
        <Switch
          value={switchState}
          color={COLORS.accentLight}
          onValueChange={value => {
            if (isConnected) {
              setSwitchState(value);
              firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .update({
                  active_status: value === false ? 'recently' : 'normal',
                  active_time:
                    newActiveTime === 'Last seen recently'
                      ? firestore?.Timestamp?.fromDate(new Date())
                      : 'Last seen recently',
                })
                .finally(() => {
                  SuccessToast(
                    'bottom',
                    'Active status changed',
                    'Your active status has changed',
                    true,
                    1500,
                  );
                  if (navigation?.canGoBack()) {
                    navigation?.goBack();
                  }
                })
                .catch(() => {
                  ErrorToast(
                    'bottom',
                    'Changing active status failed',
                    'An error occurred when changing your Active Status',
                    true,
                    1500,
                  );
                  if (navigation?.canGoBack()) {
                    navigation?.goBack();
                  }
                });
            } else {
              ErrorToast(
                'bottom',
                'Network unavailable',
                'Network connection is needed to change your active status',
                true,
                1500,
              );
              if (navigation?.canGoBack()) {
                navigation?.goBack();
              }
            }
          }}
        />
      </View>
      <View style={styles.switchRow}>
        <HelperText type={'info'} visible={true}>
          {switchState
            ? "Everyone can see you when you're active, recently active on this profile. To change this setting, turn it off on and your active status will no longer be shown, you'll can't also see when anyone are active or recently active."
            : "You won't see anybody on Moon Meet active, recently active on this profile. To make sure they can see things about you, turn on this setting, and your active status will be shown. "}
        </HelperText>
      </View>
    </MiniBaseView>
  );
};

const styles = StyleSheet.create({
  switchRow: {
    padding: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeText: {
    position: 'relative',
    fontSize: fontValue(16),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.6,
    fontFamily: FONTS.regular,
  },
});

export default ActiveStatusScreen;
