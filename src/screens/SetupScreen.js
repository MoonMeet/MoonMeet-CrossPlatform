import React, {useRef, useMemo, useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View, Keyboard} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, FAB, TextInput} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {openCamera, openImagePicker} from '../config/Image-Picker-Config';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {
  getManufacturer,
  getModel,
  getProduct,
  getSystemName,
  getSystemVersion,
  getVersion,
} from 'react-native-device-info';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import {isWeb, isWindows} from '../utils/device/DeviceInfo';
import placeHolderPhoto from '../assets/images/pick-photo.png';
import ArrowForward from '../assets/images/arrow-forward.png';
import {
  ErrorToast,
  InfoToast,
} from '../components/ToastInitializer/ToastInitializer';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {heightPercentageToDP} from '../config/Dimensions';
import {lowerToUppercase} from '../utils/converters/lowerToUppercase';

const SetupScreen = ({route}) => {
  const pickerRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['25%', '35%'], []);

  const handlePresentModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef?.current?.present();
  }, []);

  const handleCloseModal = useCallback(() => {
    pickerRef?.current?.close();
    pickerRef?.current?.forceClose();
  }, []);

  const [UserPhoto, setUserPhoto] = React.useState(null);

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

  const [LoaderVisible, setLoaderVisible] = React.useState(false);

  /**
   * Using react navigation.
   */

  const navigation = useNavigation();

  /**
   * JwtKey used for terminate all active sessions in your Moon Meet account.
   * @type {*|string}
   */

  let jwt_key = uuidv4();
  /**
   * Used for getting Device Information, useful for DeviceScreen.js
   */

  const [systemName, setSystemName] = React.useState(getSystemName());
  const [systemVersion, setSystemVersion] = React.useState(getSystemVersion());
  const [Manufacturer, setManufacturer] = React.useState(
    getManufacturer().then(manufacturer => {
      setManufacturer(manufacturer);
    }),
  );
  const [Product, setProduct] = React.useState(
    getProduct().then(product => {
      setProduct(product);
    }),
  );
  const [Model, setModel] = React.useState(getModel());
  const [appVersion, setAppVersion] = React.useState(getVersion());

  return (
    <BaseView>
      <Pressable style={{flex: 1}} onPress={() => handleCloseModal()}>
        <View style={styles.top_bar}>
          <Text style={styles.top_text}>
            Enter your name and select a profile picture
          </Text>
        </View>
        <View style={styles.large_box}>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              handlePresentModal();
            }}
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
              onFocus={() => handleCloseModal()}
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
              onFocus={() => handleCloseModal()}
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
          theme={{
            colors: {
              accent: COLORS.accentLight,
            },
          }}
          onPress={async () => {
            if (UserPhoto) {
              setLoaderVisible(!LoaderVisible);
              /**
               * Reference to users image path
               * @type {FirebaseStorageTypes.Reference}
               */
              try {
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

                  /**
                   * pushing device information for later use in DeviceScreen.js
                   */
                  if (!isWindows && !isWeb) {
                    firestore()
                      .collection('users')
                      .doc(auth()?.currentUser?.uid)
                      .collection('devices')
                      .add({
                        manufacturer: Manufacturer,
                        system_name: systemName,
                        system_version: systemVersion,
                        product: Product,
                        model: Model,
                        app_version: appVersion,
                        time: firestore.Timestamp.fromDate(new Date()),
                      })
                      .catch(error => {
                        console.error(error);
                        setLoaderVisible(!LoaderVisible);
                      });
                  }

                  /**
                   * Since we got everything except a girlfriend.
                   * we must push data to firebase.
                   */

                  await AsyncStorage.setItem('currentUserJwtKey', jwt_key).then(
                    () => {
                      firestore()
                        .collection('users')
                        .doc(auth()?.currentUser?.uid)
                        .set({
                          ...user,
                          first_name: lowerToUppercase(firstName),
                          last_name: lowerToUppercase(lastName),
                          avatar: avatarUrl,
                          active_status: 'normal',
                          info: {
                            created_At: firestore.Timestamp.fromDate(
                              new Date(),
                            ),
                            premuim: false,
                            premuimUntil: 'none',
                            banned: false,
                            bannedUntil: '',
                          },
                          active_time: firestore.Timestamp.fromDate(new Date()),
                          bio: '',
                          jwtKey: jwt_key,
                          passcode: {
                            passcode_enabled: false,
                          },
                        })
                        .finally(() => {
                          navigation.navigate('home');
                          setLoaderVisible(!LoaderVisible);
                        });
                    },
                  );
                });
              } catch (e) {
                console.log(e);
                setLoaderVisible(!LoaderVisible);
              }
            } else {
              ErrorToast(
                'bottom',
                'Please select a photo',
                'Select a photo and try again.',
                true,
                3000,
              );
            }
          }}
        />
        <LoadingIndicator
          isVisible={LoaderVisible}
          hideModal={() => {
            setLoaderVisible(!LoaderVisible);
          }}
        />
        <ImagePickerActionSheet
          sheetRef={pickerRef}
          index={0}
          snapPoints={sheetSnapPoints}
          onCameraPress={() => {
            openCamera()
              .then(image => {
                setUserPhoto(image);
              })
              .catch(e => {
                console.error(e);
              });
          }}
          onFilePicker={() => {
            openImagePicker()
              .then(image => {
                setUserPhoto(image);
              })
              .catch(e => {
                console.error(e);
              });
          }}
        />
      </Pressable>
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
    padding: heightPercentageToDP(1.5),
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default SetupScreen;
