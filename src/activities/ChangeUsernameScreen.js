import React, {useEffect} from 'react';
import BaseView from '../components/BaseView/BaseView';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {
  Avatar,
  FAB,
  HelperText,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import ArrowForward from '../assets/images/arrow-forward.png';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import NetInfo from '@react-native-community/netinfo';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ChangeUsernameScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

  /**
   * Dummy NetInfoObserver
   */

  const addNetInfoObserver = () => {
    NetInfo.addEventListener(networkState => {
      console.info(networkState.details);
      console.info(networkState.type);
    });
  };

  const [isFABLoading, setIsFABLoading] = React.useState(false);

  const [UsernameText, setUsernameText] = React.useState('');

  const [oldUsernameText, setOldUsernameText] = React.useState('');

  const onUsernameTextChange = _usernameText => setUsernameText(_usernameText);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser.uid}`)
      .once('value', snapshot => {
        if (snapshot?.val().username) {
          setUsernameText(snapshot?.val().username);
          setOldUsernameText(snapshot?.val().username);
        }
      });
    return () => {};
  }, []);

  function pushUsername() {
    setIsFABLoading(!isFABLoading);
    database()
      .ref(`/users/${auth().currentUser.uid}`)
      .update({
        username: UsernameText,
      })
      .finally(() => {
        SuccessToast(
          'bottom',
          'Username updated',
          'You have successfully changed your username.',
          true,
          4000,
        );
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      })
      .catch(error => {
        ErrorToast(
          'bottom',
          'Updating Failed',
          'An error occurred while updating your username.',
          true,
          4000,
        );
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        setIsFABLoading(!isFABLoading);
      });
  }

  const hasMoreLength = () => {
    return UsernameText.length > 30;
  };

  const hasLessLength = () => {
    return UsernameText.length < 6;
  };

  return (
    <BaseView>
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
          <Text style={styles.toolbar_text}>Change Username</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
      <View style={{paddingRight: '2%', paddingLeft: '2%'}}>
        <TextInput
          style={{
            width: '100%',
          }}
          mode="outlined"
          label="Change username"
          multiline={false}
          value={UsernameText}
          placeholder={'Type your new username here.'}
          theme={{
            colors: {
              text: COLORS.black,
              primary: COLORS.accentLight,
              backgroundColor: COLORS.rippleColor,
              placeholder: COLORS.darkGrey,
              underlineColor: '#566193',
              selectionColor: '#DADADA',
              outlineColor: '#566193',
            },
          }}
          onChangeText={onUsernameTextChange}
        />
      </View>

      <HelperText type="info" visible={true}>
        You can choose a username on Moon Meet, if you do, people will be able
        to find you by this username and contact you without needing your phone
        number.
      </HelperText>
      {hasMoreLength() ? (
        <HelperText type="error" visible={hasMoreLength()}>
          Username must be less than 30 characters.
        </HelperText>
      ) : (
        <HelperText type="info" visible={hasLessLength()}>
          Username message can contains a-z, 0-9 and underscores and must be
          longer than 5 characters.
        </HelperText>
      )}
      <FAB
        style={styles.fab}
        normal
        icon={ArrowForward}
        color={COLORS.primaryLight}
        animated={true}
        loading={isFABLoading}
        theme={{
          colors: {
            accent: COLORS.accentLight,
          },
        }}
        onPress={() => {
          if (isConnected) {
            if (!hasMoreLength() && !hasLessLength()) {
              if (UsernameText === oldUsernameText) {
                navigation.goBack();
              } else {
                pushUsername();
              }
            } else {
              ErrorToast(
                'bottom',
                'Invalid report message',
                'Report message must be between 20 and 240 characters',
                true,
                4000,
              );
            }
          } else {
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to send bug reports',
              true,
              4000,
            );
          }
        }}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default React.memo(ChangeUsernameScreen);
