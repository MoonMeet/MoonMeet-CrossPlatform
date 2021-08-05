import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, FAB, TextInput} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {openCamera, openImagePicker} from '../config/Image-Picker-Config';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

const SetupScreen = ({route}) => {
  /**
   * Importing needed images/icon from assets
   */
  const placeHolderPhoto = require('../assets/images/pick-photo.png');

  const [UserPhoto, setUserPhoto] = React.useState(null);

  const ArrowForward = require('../assets/images/arrow-forward.png');

  /**
   * getting params from stack navigator
   * you can use the following static values:
   * user#uid, user#phone etc...
   */

  const user = route?.params?.user;

  /**
   * TextInput stuffs (setter & getter)
   */

  const [firstName, setFirstName] = React.useState('');

  const [lastName, setLastName] = React.useState('');

  /**
   * Open a modal as BottomSheet
   */

  const [isPickerVisible, setIsPickerVisible] = React.useState(false);

  /**
   * set whether the FAB Loading or not
   */

  const [isFABLoading, setFABLoading] = React.useState(false);

  /**
   * Using react navigation.
   */

  const navigation = useNavigation();

  return (
    <BaseView>
      <View style={styles.top_bar}>
        <Text style={styles.top_text}>
          Enter your name and select a profile picture
        </Text>
      </View>
      <View style={styles.large_box}>
        <Pressable
          onPress={() => {
            setIsPickerVisible(true);
          }}
          style={{
            justifyContent: 'center',
            paddingLeft: '2.5%',
          }}>
          {UserPhoto ? (
            <Avatar.Image
              style={{
                height: 55,
                width: 55,
                backgroundColor: COLORS.rippleColor,
              }}
              color={COLORS.rippleColor}
              size={55}
              source={{uri: UserPhoto?.path}}
              theme={{
                colors: {
                  primary: COLORS.accentLight,
                },
              }}
            />
          ) : (
            <View
              style={{
                height: 55,
                width: 55,
                backgroundColor: COLORS.darkGrey,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 27,
                overflow: 'hidden',
              }}>
              <Image
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: COLORS.darkGrey,
                  resizeMode: 'cover',
                }}
                source={placeHolderPhoto}
              />
            </View>
          )}
        </Pressable>

        <View
          style={{
            height: '-1%',
            width: '3%',
          }}
        />

        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            padding: '1%',
          }}>
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label="First Name"
            value={firstName}
            multiline={false}
            theme={{
              colors: {
                text: COLORS.accentLight,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={_firstName => {
              setFirstName(_firstName);
            }}
          />
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label="Last Name"
            value={lastName}
            multiline={false}
            theme={{
              colors: {
                text: COLORS.accentLight,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={_lastName => {
              setLastName(_lastName);
            }}
          />
        </View>
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
        onPress={async () => {
          /**
           * Reference to users image path
           * @type {FirebaseStorageTypes.Reference}
           */
          try {
            setFABLoading(!isFABLoading);
            let _userAvatarRef = `avatars/${
              auth()?.currentUser?.uid
            }.${UserPhoto.path?.substr(
              UserPhoto.path?.lastIndexOf('.') + 1,
              3,
            )}`;

            const storageRef = storage().ref(_userAvatarRef);

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
              const avatarUrl = await storage()
                .ref(_userAvatarRef)
                .getDownloadURL();
              console.log(avatarUrl);
              const trimmedAvatar = avatarUrl.toString();
              console.log(trimmedAvatar);

              /**
               * Since we got everything except a girlfriend.
               * we must push data to firebase.
               */

              database()
                .ref(`/users/${auth()?.currentUser?.uid}`)
                .set({
                  ...user,
                  first_name: firstName,
                  last_name: lastName,
                  avatar: avatarUrl,
                })
                .then(() => {
                  navigation.navigate('home');
                });
            });
          } catch (e) {
            console.log(e.toString());
            setFABLoading(!isFABLoading);
          }
        }}
      />
      <ImagePickerActionSheet
        hideModal={() => {
          setIsPickerVisible(false);
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
              console.log(image);
              setUserPhoto(image);
            })
            .catch(e => {
              console.log(e.toString());
            });
        }}
        isVisible={isPickerVisible}
      />
    </BaseView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  top_bar: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'center',
  },
  top_text: {
    position: 'relative',
    fontSize: 28,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  large_box: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default SetupScreen;
