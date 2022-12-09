/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useEffect, useRef, useMemo, useCallback} from 'react';
import {Pressable, StyleSheet, View, Keyboard} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  ActivityIndicator,
  Avatar,
  FAB,
  HelperText,
  TextInput,
} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CameraIcon from '../assets/images/photo-camera.png';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import NetInfo from '@react-native-community/netinfo';
import storage from '@react-native-firebase/storage';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {lowerToUppercase} from '../utils/converters/lowerToUppercase';
import {PurpleBackground} from '../index.d';
import {InfoToast} from '../components/ToastInitializer/ToastInitializer';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {waitForAnd} from '../utils/timers/delay';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditProfileScreen = () => {
  const pickerRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['25%', '35%'], []);
  const {dismissAll} = useBottomSheetModal();

  const handlePresentModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef?.current?.present();
  }, []);

  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

  const [avatarURL, setAvatarURL] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const [oldFirstname, setOldFirstname] = React.useState('');
  const [oldLastname, setOldLastName] = React.useState('');

  const [UserPhoto, setUserPhoto] = React.useState(null);

  const onFirstnameTextChange = _firstnameText => setFirstName(_firstnameText);
  const onLastnameTextChange = _lastnameText => setLastName(_lastnameText);

  const [Loading, setLoading] = React.useState(true);
  const [loaderVisible, setLoaderVisible] = React.useState(false);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        if (
          documentSnapshot?.data()?.first_name &&
          documentSnapshot?.data().last_name &&
          documentSnapshot?.data()?.avatar
        ) {
          setAvatarURL(documentSnapshot?.data()?.avatar);
          setFirstName(documentSnapshot?.data()?.first_name);
          setLastName(documentSnapshot?.data()?.last_name);
          setOldFirstname(documentSnapshot?.data()?.first_name);
          setOldLastName(documentSnapshot?.data()?.last_name);
          setLoading(false);
        }
      });
  }, []);

  const firstnameHasLessLength = () => {
    return firstName?.trim()?.length < 1;
  };

  const lastnameHasLessLength = () => {
    return lastName?.trim()?.length < 1;
  };

  async function pushUserData() {
    let _avatarRef = `avatars/${
      auth()?.currentUser?.uid
    }.${UserPhoto.path?.substring(UserPhoto.path?.lastIndexOf('.') + 1, 3)}`;

    const storageRef = storage().ref(_avatarRef);

    /**
     * Uploading image to Firebase Storage
     * @type {FirebaseStorageTypes.Task}
     */

    const uploadImageTask = storageRef.putFile(UserPhoto?.path);

    uploadImageTask.on('state_changed', taskSnapshot => {
      if (__DEV__) {
        console.log(
          `${taskSnapshot?.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`,
        );
      }
    });

    /**
     * an async function to get {avatarUrl} and upload all user data.
     */
    uploadImageTask.then(async () => {
      const _avatar = await storage().ref(_avatarRef).getDownloadURL();
      if (_avatar.length > 0) {
        pushImage(_avatar);
      }
    });
  }

  /**
   * Push image url to currentUser.
   * @param pureImageUrl
   */
  function pushImage(pureImageUrl) {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        avatar: pureImageUrl,
      })
      .finally(async () => {
        if (
          firstName?.trim() !== oldFirstname?.trim() &&
          lastName?.trim() !== oldLastname?.trim()
        ) {
          // Keep showing loader and FAB
        } else {
          await auth()?.currentUser?.updateProfile({photoURL: pureImageUrl});
          setLoaderVisible(false);
          SuccessToast(
            'bottom',
            'Profile Updated',
            'Your profile was updated successfully.',
            true,
            3000,
          );
        }
      })
      .catch(error => {
        setLoaderVisible(false);
        if (__DEV__) {
          console.warn(error);
        }
        ErrorToast(
          'bottom',
          'Avatar update failed',
          'An error occurred when updating your avatar.',
          true,
          3000,
        );
      });
  }

  async function pushNames() {
    await firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        first_name: lowerToUppercase(firstName?.trim()),
        last_name: lowerToUppercase(lastName?.trim()),
      })
      .finally(async () => {
        await auth()?.currentUser?.updateProfile({
          displayName: `${lowerToUppercase(
            firstName?.trim(),
          )} ${lowerToUppercase(lastName?.trim())}`,
        });
        setLoaderVisible(false);
        setOldFirstname(firstName);
        setOldLastName(lastName);
        SuccessToast(
          'bottom',
          'Profile Updated',
          'Your profile was updated successfully.',
          true,
          3000,
        );
      })
      .catch(() => {
        setLoaderVisible(!loaderVisible);
        ErrorToast(
          'bottom',
          'Profile updated failed',
          'An error occurred when updating your profile',
          true,
          3000,
        );
      });
  }

  if (Loading) {
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
      <Pressable
        onLongPress={() => {
          if (UserPhoto) {
            setUserPhoto(null);
            InfoToast(
              'bottom',
              'Photo Removed',
              'Now select a new photo',
              true,
              2000,
            );
          }
        }}
        style={styles.avatarHolder}>
        <Avatar.Image
          size={85}
          source={
            UserPhoto
              ? {uri: UserPhoto?.path}
              : avatarURL
              ? {uri: avatarURL}
              : PurpleBackground
          }
        />
        <Pressable
          style={{
            position: 'relative',
            marginTop: '-6%',
            marginLeft: '12.5%',
          }}
          onPress={() => {
            handlePresentModal();
          }}>
          <Avatar.Icon
            size={30}
            icon={CameraIcon}
            color={COLORS.black}
            style={{
              overflow: 'hidden',
            }}
            theme={{
              colors: {
                primary: COLORS.rippleColor,
              },
            }}
          />
        </Pressable>
      </Pressable>
      <View style={styles.inputHolder}>
        <TextInput
          style={{
            width: '100%',
            paddingRight: '2%',
            paddingLeft: '2%',
          }}
          mode="outlined"
          label="First name"
          multiline={false}
          value={firstName}
          onFocus={() => dismissAll()}
          maxLength={20}
          right={<TextInput.Affix text={`${firstName?.trim()?.length}/20`} />}
          theme={{
            colors: {
              primary: COLORS.accentLight,
              onSurface: COLORS.black,
              background: COLORS.dimmed,
            },
          }}
          onChangeText={onFirstnameTextChange}
        />
        {firstnameHasLessLength() ? (
          <HelperText type="error" visible={firstnameHasLessLength()}>
            First name must be longer or equal to 1 character.
          </HelperText>
        ) : null}
        <TextInput
          style={{
            width: '100%',
            paddingRight: '2%',
            paddingLeft: '2%',
          }}
          mode="outlined"
          label="Last name"
          multiline={false}
          onFocus={() => dismissAll()}
          value={lastName}
          maxLength={20}
          right={<TextInput.Affix text={`${lastName?.trim()?.length}/20`} />}
          theme={{
            colors: {
              primary: COLORS.accentLight,
              onSurface: COLORS.black,
              background: COLORS.dimmed,
            },
          }}
          onChangeText={onLastnameTextChange}
        />
        {lastnameHasLessLength() ? (
          <HelperText type="error" visible={lastnameHasLessLength()}>
            Last name must be longer or equal to 1 character.
          </HelperText>
        ) : null}
      </View>
      <View style={styles.instruction}>
        <HelperText
          style={{fontSize: 13}}
          padding={'none'}
          type="info"
          visible={true}>
          If you want to change your biography, go
        </HelperText>
        <View
          style={{
            padding: '0.5%',
          }}
        />
        <Pressable onPress={() => navigation?.navigate('addBio')}>
          <HelperText
            padding={'none'}
            style={{
              color: COLORS.accentLight,
              fontSize: 13,
            }}
            type="info"
            visible={true}>
            here
          </HelperText>
        </Pressable>
      </View>
      <FAB
        style={styles.fab}
        mode={'elevated'}
        size={'medium'}
        icon={({size, allowFontScaling}) => (
          <MaterialIcons
            name="chevron-right"
            color={COLORS.white}
            size={size}
            allowFontScaling={allowFontScaling}
          />
        )}
        animated={true}
        theme={{
          colors: {
            primaryContainer: COLORS.accentLight,
          },
        }}
        visible={loaderVisible === false}
        onPress={() => {
          if (isConnected) {
            if (!firstnameHasLessLength() && !lastnameHasLessLength()) {
              if (
                firstName?.trim() === oldFirstname?.trim() &&
                lastName?.trim() === oldLastname?.trim() &&
                !UserPhoto
              ) {
                navigation?.goBack();
              } else {
                setLoaderVisible(true);
                if (UserPhoto) {
                  pushUserData();
                }
                if (
                  firstName?.trim() !== oldFirstname?.trim() ||
                  lastName?.trim() !== oldLastname?.trim()
                ) {
                  pushNames()?.finally(() => {
                    setLoaderVisible(false);
                  });
                }
              }
            } else {
              ErrorToast(
                'bottom',
                'Your name is too short',
                `${
                  firstnameHasLessLength() ? 'First name' : 'Last name'
                } must be longer or equal to 1 characters.`,
                true,
                3000,
              );
            }
          } else {
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to update your profile',
              true,
              3000,
            );
          }
        }}
      />
      <ImagePickerActionSheet
        sheetRef={pickerRef}
        index={0}
        snapPoints={sheetSnapPoints}
        onCameraPress={() => {
          ImagePicker.openCamera({
            height: 1024,
            width: 1024,
            cropping: true,
            mediaType: 'photo',
          })
            .then(async image => {
              setUserPhoto(image);
            })
            .catch(() => {
              setLoaderVisible(false);
              ErrorToast(
                'bottom',
                'Failed to open camera',
                'please accept camera permission from settings',
                true,
                1000,
              );
            });
          waitForAnd(0).then(() => dismissAll());
        }}
        onFilePicker={() => {
          ImagePicker.openPicker({
            height: 1024,
            width: 1024,
            cropping: true,
            mediaType: 'photo',
          })
            .then(async image => {
              setUserPhoto(image);
            })
            .catch(() => {
              setLoaderVisible(false);
              ErrorToast(
                'bottom',
                'Failed to open picker',
                'please accept storage permission from settings',
                true,
                1000,
              );
            });
          waitForAnd(0).then(() => dismissAll());
        }}
      />
      <LoadingIndicator isVisible={loaderVisible} />
    </BaseView>
  );
};
const styles = StyleSheet.create({
  under_header: {
    padding: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar_text: {
    fontSize: fontValue(22),
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  under_header_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  avatarHolder: {
    padding: '1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHolder: {
    padding: '1.5%',
    justifyContent: 'center',
  },
  instruction: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16 - 0.1 * 16,
    right: 0,
    bottom: 0,
  },
});
export default EditProfileScreen;
