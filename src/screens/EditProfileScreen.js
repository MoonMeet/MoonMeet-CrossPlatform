import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  ActivityIndicator,
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
import firestore from '@react-native-firebase/firestore';
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
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {heightPercentageToDP} from '../config/Dimensions';
import {lowerToUppercase} from '../utils/converters/lowerToUppercase';

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
  const [oldAvatar, setOldAvatar] = React.useState('');

  const [PickerActionSheet, setPickerActionSheet] = React.useState(false);

  const [UserPhoto, setUserPhoto] = React.useState(null);

  const onFirstnameTextChange = _firstnameText => setFirstName(_firstnameText);
  const onLastnameTextChange = _lastnameText => setLastName(_lastnameText);

  const [Loading, setLoading] = React.useState(true);
  const [loaderVisible, setLoaderVisible] = React.useState(false);
  const [sendingData, setSendingData] = React.useState(false);

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
          setOldAvatar(documentSnapshot?.data()?.avatar);
          setOldFirstname(documentSnapshot?.data()?.first_name);
          setOldLastName(documentSnapshot?.data()?.last_name);
          setLoading(false);
        }
      });

    return () => {};
  }, []);

  const firstnameHasLessLength = () => {
    return firstName.length < 3;
  };

  const lastnameHasLessLength = () => {
    return lastName.length < 3;
  };

  async function pushUserData() {
    let _avatarRef = `avatars/${
      auth()?.currentUser?.uid
    }.${UserPhoto.path?.substr(UserPhoto.path?.lastIndexOf('.') + 1, 3)}`;

    const storageRef = storage().ref(_avatarRef);

    /**
     * Uploading image to Firebase Storage
     * @type {FirebaseStorageTypes.Task}
     */

    const uploadImageTask = storageRef.putFile(UserPhoto?.path);

    uploadImageTask.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot?.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`,
      );
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

  function pushImage(pureImageUrl) {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        avatar: pureImageUrl,
      })
      .finally(() => {
        if (firstName !== oldFirstname && lastName !== oldLastname) {
          // Keep showing loader and FAB
        } else {
          setLoaderVisible(false);
          setSendingData(false);
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
        console.warn(error);
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
        first_name: lowerToUppercase(firstName),
        last_name: lowerToUppercase(lastName),
      })
      .finally(() => {
        setLoaderVisible(false);
        setOldFirstname(firstName);
        setOldLastName(lastName);
        setSendingData(false);
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
      {/**<View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={() => {
              navigation?.goBack();
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
      </View>*/}
      <Spacer height={heightPercentageToDP(0.5)} />
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
            First Name must be longer than 2 characters.
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
            Last Name must be longer than 2 characters.
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
        visible={!sendingData}
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
                navigation?.goBack();
              } else {
                setSendingData(true);
                setLoaderVisible(true);
                if (UserPhoto) {
                  pushUserData();
                }
                if (firstName !== oldFirstname || lastName !== oldLastname) {
                  pushNames()?.finally(() => {
                    setLoaderVisible(false);
                    setSendingData(false);
                  });
                }
              }
            } else {
              ErrorToast(
                'bottom',
                'Invalid report message',
                'Report message must be between 20 and 240 characters',
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
              setLoaderVisible(false);
              console.warn(e.toString());
            });
        }}
        onFilePicker={() => {
          openImagePicker()
            .then(image => {
              setUserPhoto(image);
            })
            .catch(e => {
              setLoaderVisible(false);
              console.warn(e.toString());
            });
        }}
        isVisible={PickerActionSheet}
      />
      <LoadingIndicator isVisible={loaderVisible} />
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
export default EditProfileScreen;
