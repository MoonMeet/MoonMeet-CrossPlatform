import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, FAB, IconButton, TextInput} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {openCamera, openImagePicker} from '../config/image-picker-config';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const SetupScreen = ({route}) => {
  /**
   * Importing `pick-photo, arrow-forward` from assets
   */
  const placeHolderPhoto = require('../assets/images/pick-photo.png');

  const [UserPhoto, setUserPhoto] = React.useState(null);

  const ArrowForward = require('../assets/images/arrow-forward.png');

  /**
   * TextInput stuffs (setter & getter)
   */
  const user = route?.params?.user;

  const [firstName, setFirstName] = React.useState('');

  const [lastName, setLastName] = React.useState('');

  const [isPickerVisible, setIsPickerVisible] = React.useState(false);

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
          <View
            style={{
              height: 55,
              width: 55,
              backgroundColor: COLORS.rippleColor,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 27,
              overflow: 'hidden',
            }}>
            <Image
              style={{
                height: UserPhoto ? 55 : 30,
                width: UserPhoto ? 55 : 30,
                backgroundColor: COLORS.rippleColor,
                resizeMode: 'cover',
              }}
              color={COLORS.rippleColor}
              source={UserPhoto ? {uri: UserPhoto.path} : placeHolderPhoto}
              theme={{
                colors: {
                  primary: COLORS.accentLight,
                },
              }}
            />
          </View>
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
        theme={{
          colors: {
            accent: COLORS.accentLight,
          },
        }}
        onPress={async () => {
          const storageRef = storage().ref(
            `avatars/${auth().currentUser.uid}.${UserPhoto.path?.substr(
              UserPhoto.path?.lastIndexOf('.') + 1,
              3,
            )}`,
          );

          storageRef.putFile(UserPhoto?.path).then(() => {
            database()
              .ref(`/users/${auth().currentUser.uid}`)
              .set({
                ...user,
                first_name: firstName,
                last_name: lastName,
              })
              .then(() => {
                console.log('Data set.');
              });
          });
        }}
      />
      <ImagePickerActionSheet
        hideModal={() => {
          setIsPickerVisible(false);
        }}
        onCameraPress={() => {
          openCamera().then(image => {
            setUserPhoto(image);
            console.log(image);
          });
        }}
        onFilePicker={() => {
          openImagePicker().then(image => {
            setUserPhoto(image);
            console.log(image);
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
