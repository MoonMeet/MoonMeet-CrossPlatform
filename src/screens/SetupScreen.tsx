/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from 'config/Miscellaneous';
import {Avatar, FAB, TextInput} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';
import {
  openCamera,
  openImagePicker,
  PhotoType,
} from 'config/Image-Picker-Config';
import ImagePickerActionSheet from '@components/ImagePickerActionSheet/ImagePickerActionSheet.tsx';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  CommonActions,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
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
import {
  ErrorToast,
  InfoToast,
} from '../components/ToastInitializer/ToastInitializer';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {lowerToUppercase} from '../utils/converters/lowerToUppercase';
import {StorageInstance} from 'config/MMKV/StorageInstance';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {placeHolderPhoto} from 'index.d';

interface SetupScreenProps {
  route: RouteProp<RootStackParamList, 'setup'>;
}

const SetupScreen = (props: SetupScreenProps) => {
  const pickerRef = useRef<BottomSheetModal>(null);
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

  const [UserPhoto, setUserPhoto] = useState<PhotoType | null>(null);

  /**
   * getting params from stack navigator
   * you can use the following static values:
   * user#uid, user#phone etc...
   */

  const user = props?.route?.params?.user;

  /**
   * TextInput stuffs (setter & getter)
   */

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const memoizedFirstName = useMemo(() => firstName?.trim(), [firstName]);
  const memoizedLastName = useMemo(() => lastName?.trim(), [lastName]);

  /**
   * Open a modal as BottomSheet
   */

  const [LoaderVisible, setLoaderVisible] = useState<boolean>(false);

  /**
   * Using react navigation.
   */

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  /**
   * JwtKey used for terminate all active sessions in your Moon Meet account.
   * @type {*|string}
   */

  let jwt_key: string =
    StorageInstance.getString('currentUserJwtKey') || uuidv4();
  /**
   * Used for getting Device Information, useful for DeviceScreen.js
   */

  const [systemName] = useState(getSystemName());
  const [systemVersion] = useState(getSystemVersion());
  const [Manufacturer, setManufacturer] = useState<string>('');
  const [Product, setProduct] = useState<string>('');
  const [Model] = useState(getModel());
  const [appVersion] = useState(getVersion());

  useEffect(() => {
    getManufacturer().then(manufacturer => {
      setManufacturer(manufacturer);
    });
  }, []);

  useEffect(() => {
    getProduct().then(product => {
      setProduct(product);
    });
  }, []);

  StorageInstance?.set('currentUserJwtKey', jwt_key);

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
            const _firstName = lowerToUppercase(memoizedFirstName);
            const _lastName = lowerToUppercase(memoizedLastName);
            jwt_key =
              StorageInstance?.getString('currentUserJwtKey') || uuidv4();
            if (UserPhoto) {
              if (_firstName?.length > 1 && _lastName?.length > 1) {
                setLoaderVisible(true);
                /**
                 * Reference to users image path
                 */
                try {
                  let _userAvatarRef = `avatars/${
                    auth()?.currentUser?.uid
                  }.${UserPhoto?.path?.substring(
                    UserPhoto?.path?.lastIndexOf('.') + 1,
                    3,
                  )}`;

                  const storageRef = storage().ref(_userAvatarRef);

                  /**
                   * Uploading image to Firebase Storage
                   */

                  const uploadImageTask = storageRef?.putFile(UserPhoto?.path);

                  /**
                   * Add observer to image uploading.
                   */

                  if (__DEV__) {
                    uploadImageTask.on('state_changed', taskSnapshot => {
                      let percentage =
                        (taskSnapshot.bytesTransferred /
                          taskSnapshot.totalBytes) *
                        100;
                      console.log(`Upload is ${percentage}% done`);
                    });
                  }

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

                    StorageInstance?.set('currentUserJwtKey', jwt_key);
                    firestore()
                      .collection('users')
                      .doc(auth()?.currentUser?.uid)
                      .set({
                        ...user,
                        first_name: _firstName,
                        last_name: _lastName,
                        avatar: avatarUrl,
                        active_status: 'normal',
                        info: {
                          created_At: firestore?.Timestamp?.fromDate(
                            new Date(),
                          ),
                          premium: false,
                          premiumUntil: 'none',
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
                          displayName: `${_firstName} ${_lastName}`,
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
                    'Unexpected error occurred',
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
      <LoadingIndicator isVisible={LoaderVisible} />
      <ImagePickerActionSheet
        sheetRef={pickerRef}
        index={0}
        snapPoints={sheetSnapPoints}
        onCameraPress={async () => {
          await openCamera()
            .then(image => {
              setUserPhoto(image as PhotoType);
            })
            .catch(e => {
              console.error(e);
            });
          dismissAll();
        }}
        onFilePicker={async () => {
          await openImagePicker()
            .then(image => {
              setUserPhoto(image as PhotoType);
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
