/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useRef, useMemo, useCallback} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
  BackHandler,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, FAB, TextInput} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {openCamera, openImagePicker} from '../config/Image-Picker-Config';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {CommonActions, useNavigation} from '@react-navigation/native';
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
import {isWeb, isWindows} from '../utils/device/DeviceInfo';
import placeHolderPhoto from '../assets/images/pick-photo.png';
import {
  ErrorToast,
  InfoToast,
} from '../components/ToastInitializer/ToastInitializer';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {lowerToUppercase} from '../utils/converters/lowerToUppercase';
import {JwtKeyMMKV} from '../config/MMKV/JwtKeyMMKV';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SetupScreen = ({route}) => {
  const pickerRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['25%'], []);

  const handlePresentModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef?.current?.present();
  }, []);

  const {dismissAll} = useBottomSheetModal();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

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
    <>
      <BaseView>
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
                  height: 55 - 0.1 * 55,
                  width: 55 - 0.1 * 55,
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
                  height: 55 - 0.1 * 55,
                  width: 55 - 0.1 * 55,
                  backgroundColor: COLORS.darkGrey,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 27,
                  overflow: 'hidden',
                }}>
                <Image
                  style={{
                    height: 30 - 0.1 * 30,
                    width: 30 - 0.1 * 30,
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
              label="First name"
              value={firstName}
              multiline={false}
              theme={{
                colors: {
                  primary: COLORS.accentLight,
                  onSurface: COLORS.black,
                  background: COLORS.dimmed,
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
              label="Last name"
              value={lastName}
              multiline={false}
              theme={{
                colors: {
                  primary: COLORS.accentLight,
                  onSurface: COLORS.black,
                  background: COLORS.dimmed,
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
          onPress={async () => {
            if (UserPhoto) {
              if (
                firstName?.trim()?.length > 1 &&
                lastName?.trim()?.length > 1
              ) {
                setLoaderVisible(true);
                /**
                 * Reference to users image path
                 * @type {FirebaseStorageTypes.Reference}
                 */
                try {
                  let _userAvatarRef = `avatars/${
                    auth()?.currentUser?.uid
                  }.${UserPhoto?.path?.substr(
                    UserPhoto?.path?.lastIndexOf('.') + 1,
                    3,
                  )}`;

                  const storageRef = storage().ref(_userAvatarRef);

                  /**
                   * Uploading image to Firebase Storage
                   * @type {FirebaseStorageTypes.Task}
                   */

                  const uploadImageTask = storageRef?.putFile(UserPhoto?.path);

                  /**
                   * Add observer to image uploading.
                   */

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
                    const avatarUrl = await storage()
                      .ref(_userAvatarRef)
                      .getDownloadURL();

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
                          if (__DEV__) {
                            console.error(error);
                          }
                          setLoaderVisible(false);
                        });
                    }

                    /**
                     * Since we got everything except a girlfriend.
                     * we must push data to firebase.
                     */

                    JwtKeyMMKV?.set('currentUserJwtKey', jwt_key);
                    firestore()
                      .collection('users')
                      .doc(auth()?.currentUser?.uid)
                      .set({
                        ...user,
                        first_name: lowerToUppercase(firstName?.trim()),
                        last_name: lowerToUppercase(lastName?.trim()),
                        avatar: avatarUrl,
                        active_status: 'normal',
                        info: {
                          created_At: firestore?.Timestamp?.fromDate(
                            new Date(),
                          ),
                          premuim: false,
                          premuimUntil: 'none',
                          banned: false,
                          bannedUntil: '',
                        },
                        active_time: firestore?.Timestamp?.fromDate(new Date()),
                        bio: '',
                        jwtKey: jwt_key,
                        passcode: {
                          passcode_enabled: false,
                        },
                      })

                      .finally(async () => {
                        /**
                         * Updating user profile.
                         */

                        await auth()?.currentUser?.updateProfile({
                          displayName: `${lowerToUppercase(
                            firstName?.trim(),
                          )} ${lowerToUppercase(lastName?.trim())}`,
                          photoURL: avatarUrl,
                        });
                        navigation?.dispatch(
                          CommonActions?.reset({
                            index: 0,
                            routes: [{name: 'setup'}],
                          }),
                        );
                        navigation?.navigate('home');
                        setLoaderVisible(false);
                      });
                  });
                } catch (e) {
                  setLoaderVisible(false);
                  ErrorToast(
                    'bottom',
                    'Unexpected error occured',
                    `${e}`,
                    true,
                    2000,
                  );
                }
              } else {
                ErrorToast(
                  'bottom',
                  'Please enter your name',
                  'fill the blanks with your name and try again.',
                  true,
                  2000,
                );
              }
            } else {
              ErrorToast(
                'bottom',
                'Please select a photo',
                'Select a photo and try again.',
                true,
                2000,
              );
            }
          }}
        />
      </BaseView>
      <LoadingIndicator
        isVisible={LoaderVisible}
        hideModal={() => {
          setLoaderVisible(false);
        }}
      />
      <ImagePickerActionSheet
        sheetRef={pickerRef}
        index={0}
        snapPoints={sheetSnapPoints}
        onCameraPress={async () => {
          await openCamera()
            .then(image => {
              setUserPhoto(image);
            })
            .catch(e => {
              console.error(e);
            });
          dismissAll();
        }}
        onFilePicker={async () => {
          await openImagePicker()
            .then(image => {
              setUserPhoto(image);
            })
            .catch(e => {
              if (__DEV__) {
                console.error(e);
              }
            });
          dismissAll();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
    fontSize: fontValue(28),
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
    margin: 16 - 0.1 * 16,
    right: 0,
    bottom: 0,
  },
});

export default SetupScreen;
