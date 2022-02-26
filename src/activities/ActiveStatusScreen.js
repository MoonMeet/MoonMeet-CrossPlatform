import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {Avatar, HelperText, Switch, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ActiveStatusScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching a SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

  const [newActiveTime, setNewActiveTime] = React.useState('');

  const getUserActiveStatus = () => {
    database()
      .ref(`/users/${auth()?.currentUser.uid}`)
      .on('value', snapshot => {
        if (snapshot?.val().active_status && snapshot?.val().active_time) {
          if (snapshot?.val().active_status === 'normal') {
            setSwitchState(true);
          } else {
            setSwitchState(false);
          }
          setNewActiveTime(snapshot?.val().active_time);
        }
      });
  };

  const [switchState, setSwitchState] = React.useState(false);

  useEffect(() => {
    getUserActiveStatus();
    return () => {
      database()
        .ref(`/users/${auth().currentUser.uid}`)
        .off('value', getUserActiveStatus);
    };
  }, []);
  return (
    <MiniBaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            borderless={false}
            rippleColor={COLORS.rippleColor}
            onPress={() => {
              navigation.goBack();
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
        <View style={styles.mid_side}>
          <Text style={styles.toolbar_text}>Active Status</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
      <View style={styles.switchRow}>
        <Text style={styles.activeText}>Show when you're active</Text>
        <View style={{flex: 1}}>
          <Switch
            value={switchState}
            color={COLORS.accentLight}
            onValueChange={() => {
              if (isConnected) {
                setSwitchState(!switchState);
                database()
                  .ref(`/users/${auth()?.currentUser.uid}`)
                  .update({
                    active_status: switchState === true ? 'recently' : 'normal',
                    active_time:
                      newActiveTime === 'Last seen recently'
                        ? Date.now()
                        : 'Last seen recently',
                  })
                  .then(() => {
                    SuccessToast(
                      'bottom',
                      'Active status changed',
                      "You're active status has changed",
                      true,
                      4000,
                    );
                  })
                  .catch(() => {
                    ErrorToast(
                      'bottom',
                      'Changing active status failed',
                      'An error occurred when changing your Active Status',
                    );
                  });
              } else {
                ErrorToast(
                  'bottom',
                  'Network unavailable',
                  'Network connection is needed to change your active status',
                  true,
                  4000,
                );
              }
            }}
          />
        </View>
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
    fontFamily: FONTS.regular,
  },
  switchRow: {
    padding: '2%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeText: {
    position: 'relative',
    fontSize: 16,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(ActiveStatusScreen);
