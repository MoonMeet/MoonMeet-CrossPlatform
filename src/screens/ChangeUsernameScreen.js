import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  FAB,
  HelperText,
  TextInput,
} from 'react-native-paper';
import ArrowForward from '../assets/images/arrow-forward.png';
import BaseView from '../components/BaseView/BaseView';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import Spacer from '../components/Spacer/Spacer';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import {heightPercentageToDP} from '../config/Dimensions';
import {COLORS} from '../config/Miscellaneous';

const ChangeUsernameScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

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
            setUsernameText(documentSnapshot?.data()?.username);
            setOldUsernameText(documentSnapshot?.data()?.username);
            setLoading(false);
          }
        }
      });
    return () => {};
  }, []);

  const pushUsername = useCallback(() => {
    setLoaderVisible(true);
    firestore()
      .collection('users')
      .where('username', '==', UsernameText?.trim())
      .get()
      .then(async collectionSnapshot => {
        if (collectionSnapshot?.empty) {
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .update({
              username: UsernameText?.trim(),
            })
            .finally(() => {
              SuccessToast(
                'bottom',
                'Username updated',
                'You have successfully changed your username.',
                true,
                2000,
              );
              setOldUsernameText(UsernameText?.trim());
              setLoaderVisible(false);
            })
            .catch(error => {
              ErrorToast(
                'bottom',
                'Updating Failed',
                'An error occurred while updating your username.',
                true,
                2000,
              );
              setLoaderVisible(false);
              if (navigation?.canGoBack()) {
                navigation?.goBack();
              }
            });
        } else {
          ErrorToast(
            'bottom',
            'Username already taken',
            'Please choose another username which it is not taken.',
            true,
            2000,
          );
          setLoaderVisible(false);
        }
      });
  }, [UsernameText, navigation]);

  const hasMoreLength = () => {
    return UsernameText?.trim()?.length > 30;
  };

  const hasLessLength = () => {
    return UsernameText?.trim()?.length < 6;
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
      <Spacer height={heightPercentageToDP(0.5)} />
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
              if (UsernameText?.trim() === oldUsernameText?.trim()) {
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
              'Network connection is needed to update your username',
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
  fab: {
    position: 'absolute',
    margin: 16 - 0.1 * 16,
    right: 0,
    bottom: 0,
  },
});
export default ChangeUsernameScreen;
