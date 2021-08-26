import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  Avatar,
  FAB,
  HelperText,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back.png';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import CameraIcon from '../assets/images/photo-camera.png';
import {openCamera, openImagePicker} from '../config/Image-Picker-Config';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import ArrowForward from '../assets/images/arrow-forward.png';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import NetInfo from '@react-native-community/netinfo';
import storage from '@react-native-firebase/storage';

const EditProfileScreen = () => {
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

  const [PickerActionSheet, setPickerActionSheet] = React.useState(false);

  const [newAvatarURL, setNewAvatarURL] = React.useState('');

  const [UserPhoto, setUserPhoto] = React.useState(null);

  const onFirstnameTextChange = _firstnameText => setFirstName(_firstnameText);
  const onLastnameTextChange = _lastnameText => setLastName(_lastnameText);

  const [isFABLoading, setIsFABLoading] = React.useState(false);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (
          snapshot?.val().avatar &&
          snapshot?.val().first_name &&
          snapshot?.val().last_name
        ) {
          setAvatarURL(snapshot?.val().avatar);
          setFirstName(snapshot?.val().first_name);
          setLastName(snapshot?.val().last_name);

          setOldFirstname(snapshot?.val().first_name);
          setOldLastName(snapshot?.val().last_name);
        }
      });
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
    };
  }, []);

  const firstnameHasLessLength = () => {
    return firstName.length < 3;
  };

  const lastnameHasLessLength = () => {
    return lastName.length < 3;
  };

  function pushUserData() {
    setIsFABLoading(!isFABLoading);
    let _avatarRef = `avatars/${
      auth()?.currentUser?.uid
    }.${UserPhoto.path?.substr(UserPhoto.path?.lastIndexOf('.') + 1, 3)}`;

    const storageRef = storage().ref(_avatarRef);

    /**
     * Uploading image to Firebase Storage
     * @type {FirebaseStorageTypes.Task}
     */

    const uploadImageTask = storageRef.putFile(UserPhoto?.path);

    /**
     * Add observer to image uploading.
     */

    uploadImageTask.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot?.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`,
      );
    });

    /**
     * an async function to get {avatarUrl} and upload all user data.
     */
    uploadImageTask.then(async () => {
      let _avatar = await storage().ref(_avatarRef).getDownloadURL();
      console.warn(_avatar);
      setNewAvatarURL(_avatar);
      database()
        .ref(`/users/${auth().currentUser.uid}`)
        .set({
          avatar: newAvatarURL,
        })
        .then(() => {
          pushNames();
        })
        .catch(error => {
          setIsFABLoading(!isFABLoading);
          ErrorToast(
            'bottom',
            'Avatar update failed',
            'An error occurred when updating your avatar.',
            true,
            4000,
          );
        });
    });
  }

  function pushNames() {
    database()
      .ref(`/users/${auth().currentUser.uid}`)
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .then(() => {
        setIsFABLoading(!isFABLoading);
        SuccessToast(
          'bottom',
          'Profile Updated',
          'Your profile was updated successfully.',
          true,
          4000,
        );
        navigation.goBack();
      })
      .catch(error => {
        setIsFABLoading(!isFABLoading);
        ErrorToast(
          'bottom',
          'Profile updated failed',
          'An error occurred when updating your profile',
          true,
          4000,
        );
      });
  }

  return (
    <BaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
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
          <Text style={styles.toolbar_text}>Edit Profile</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
      <View style={styles.avatarHolder}>
        <Avatar.Image
          size={85}
          source={UserPhoto ? {uri: UserPhoto?.path} : {uri: avatarURL}}
        />
        <Pressable
          style={{
            position: 'relative',
            marginTop: '-6%',
            marginLeft: '12.5%',
          }}
          onPress={() => {
            setPickerActionSheet(true);
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
      </View>
      <View style={styles.inputHolder}>
        <TextInput
          style={{
            width: '100%',
            paddingRight: '2%',
            paddingLeft: '2%',
            paddingTop: '1%',
          }}
          mode="outlined"
          label="First Name"
          multiline={false}
          value={firstName}
          maxLength={20}
          right={<TextInput.Affix text={`${firstName.length}/20`} />}
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
          onChangeText={onFirstnameTextChange}
        />
        {firstnameHasLessLength() ? (
          <HelperText type="error" visible={firstnameHasLessLength()}>
            First Name must be longer longer than 2 characters.
          </HelperText>
        ) : null}
        <TextInput
          style={{
            width: '100%',
            paddingRight: '2%',
            paddingLeft: '2%',
            paddingTop: '1%',
          }}
          mode="outlined"
          label="Last name"
          multiline={false}
          value={lastName}
          maxLength={20}
          right={<TextInput.Affix text={`${lastName.length}/20`} />}
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
          onChangeText={onLastnameTextChange}
        />
        {lastnameHasLessLength() ? (
          <HelperText type="error" visible={lastnameHasLessLength()}>
            Last Name must be longer longer than 2 characters.
          </HelperText>
        ) : null}
      </View>
      <View style={styles.instruction}>
        <HelperText
          style={{fontSize: 13}}
          padding={'none'}
          type="info"
          visible={true}>
          If you want to change your bio, We need to redirect you
        </HelperText>
        <View
          style={{
            padding: '0.5%',
          }}
        />
        <Pressable onPress={() => navigation.navigate('addBio')}>
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
            if (!firstnameHasLessLength() && !firstnameHasLessLength()) {
              if (
                firstName === oldFirstname &&
                lastName === oldLastname &&
                !UserPhoto
              ) {
                navigation.goBack();
              } else {
                if (UserPhoto) {
                  pushUserData();
                }
                pushNames();
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
      <ImagePickerActionSheet
        hideModal={() => {
          setPickerActionSheet(false);
        }}
        onCameraPress={() => {
          openCamera()
            .then(image => {
              console.log(image);
              setUserPhoto(image);
            })
            .catch(e => {
              console.log(e.toString());
            });
        }}
        onFilePicker={() => {
          openImagePicker()
            .then(image => {
              setUserPhoto(image);
            })
            .catch(e => {
              console.log(e.toString());
            });
        }}
        isVisible={PickerActionSheet}
      />
    </BaseView>
  );
};
const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  under_header_text: {
    position: 'relative',
    fontSize: 24,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  avatarHolder: {
    padding: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHolder: {
    padding: '2%',
    justifyContent: 'center',
  },
  instruction: {
    flexDirection: 'row',
    padding: '2%',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default React.memo(EditProfileScreen);
