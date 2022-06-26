import React, {useEffect} from 'react';
import BaseView from '../components/BaseView/BaseView';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {
  Avatar,
  FAB,
  HelperText,
  TextInput,
  TouchableRipple,
  ActivityIndicator,
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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';

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

  const [UsernameText, setUsernameText] = React.useState('');
  const [oldUsernameText, setOldUsernameText] = React.useState('');

  const [loaderVisible, setLoaderVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const onUsernameTextChange = _usernameText => setUsernameText(_usernameText);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (documentSnapshot?.data()?.username) {
            setUsernameText(documentSnapshot?.data().username);
            setOldUsernameText(documentSnapshot?.data().username);
            setLoading(false);
          }
        }
      });
    return () => {};
  }, []);

  function pushUsername() {
    setLoaderVisible(true);
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        username: UsernameText,
      })
      .finally(() => {
        SuccessToast(
          'bottom',
          'Username updated',
          'You have successfully changed your username.',
          true,
          3000,
        );
        setOldUsernameText(UsernameText);
        setLoaderVisible(false);
      })
      .catch(error => {
        ErrorToast(
          'bottom',
          'Updating Failed',
          'An error occurred while updating your username.',
          true,
          3000,
        );
        console.log(error);
        setLoaderVisible(false);
        if (navigation?.canGoBack()) {
          navigation?.goBack();
        }
      });
  }

  const hasMoreLength = () => {
    return UsernameText.length > 30;
  };

  const hasLessLength = () => {
    return UsernameText.length < 6;
  };

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
        theme={{
          colors: {
            accent: COLORS.accentLight,
          },
        }}
        onPress={() => {
          if (isConnected) {
            if (!hasMoreLength() && !hasLessLength()) {
              if (UsernameText === oldUsernameText) {
                if (navigation?.canGoBack) {
                  navigation?.goBack();
                }
              } else {
                pushUsername();
              }
            } else {
              ErrorToast(
                'bottom',
                'Invalid username',
                'username must be between 6 and 30 characters',
                true,
                3000,
              );
            }
          } else {
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to send bug reports',
              true,
              3000,
            );
          }
        }}
      />
      <LoadingIndicator isVisible={loaderVisible} />
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
