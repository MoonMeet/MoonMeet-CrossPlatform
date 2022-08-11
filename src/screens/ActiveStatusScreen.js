import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
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

const ActiveStatusScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching a SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const [switchState, setSwitchState] = React.useState(false);

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
            if (documentSnapshot?.data().active_status === 'normal') {
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
          onValueChange={() => {
            if (isConnected) {
              setSwitchState(!switchState);
              firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .update({
                  active_status: switchState === true ? 'recently' : 'normal',
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
          Everyone can see you when you're active, recently active and currently
          in the same chat as them. To change this, turn off the setting on
          Active Status Settings, you'll also see when anyone are active or
          recently active.
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
