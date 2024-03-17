/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {
  BackHandler,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
} from 'react-native';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {StorageInstance} from 'config/MMKV/StorageInstance';
import {getVersion} from 'react-native-device-info';
import {inRange, isEmpty, isNull} from 'lodash';
import UpdateBottomSheet from '../components/SplashScreen/UpdateBottomSheet';
import {
  ErrorToast,
  InfoToast,
} from '../components/ToastInitializer/ToastInitializer';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import {ThemeContext} from 'config/Theme/Context.ts';
import {LogoImage} from '../index.d';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/NavigationTypes/NavigationTypes';

const SplashScreen = () => {
  const {isThemeDark} = useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  /**
   * Passcode Checking
   */

  const [havePasscode, setHavePasscode] = React.useState<Boolean>(false);
  /**
   * Bottom Sheet
   */
  const {dismissAll} = useBottomSheetModal();
  const updateSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const handleModalShow = useCallback(() => {
    updateSheetRef?.current?.present();
  }, []);

  /**
   * Update variables, used in to check for required updates.
   */

  const [updatedRequired, setUpdateRequired] = React.useState(false);
  const [updateVersion, setUpdateVersion] = React.useState('');
  const [updateURL, setUpdateURL] = React.useState('');

  const [currentAppVersion] = React.useState(getVersion());

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

  const ManualFetchForDoItLater = useCallback(() => {
    if (isViewPagerCompleted()) {
      if (auth()?.currentUser !== null) {
        firestore()
          .collection('users')
          .doc(auth()?.currentUser?.uid)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot?.exists) {
              if (documentSnapshot?.data()?.passcode?.passcode_enabled) {
                setHavePasscode(true);
              } else {
                setHavePasscode(false);
              }
            } else {
              auth()
                ?.signOut()
                .catch(error => {
                  ErrorToast(
                    'bottom',
                    'Failed to log out',
                    `${error}`,
                    true,
                    1000,
                  );
                })
                .finally(() => {
                  navigation?.dispatch(
                    CommonActions?.reset({
                      index: 0,
                      routes: [{name: 'splash'}],
                    }),
                  );
                  InfoToast(
                    'bottom',
                    'Please re-login',
                    'You need to re-login and complete your profile',
                    true,
                    1000,
                  );
                  navigation?.navigate('login');
                });
            }
          })
          .finally(() => {
            if (!isNull(havePasscode)) {
              if (havePasscode) {
                navigation?.navigate('passcodeVerify');
              } else {
                navigation?.navigate('home');
              }
            }
          });
      } else {
        navigation?.navigate('login');
      }
    } else {
      navigation?.navigate('onboarding');
    }
  }, [havePasscode, navigation]);

  /**
   * Splash Screen animations.
   */
  const scaleX = useSharedValue(0.1);
  const scaleY = useSharedValue(0.1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const isViewPagerCompleted = () => {
    return (
      StorageInstance?.contains('onboardingComplete') &&
      StorageInstance?.getBoolean('onboardingComplete')
    );
  };
  useEffect(() => {
    const AnimateSceneTimerTask = setTimeout(() => {
      scaleX.value = withDelay(30, withTiming(0.08, {duration: 275}));
      scaleY.value = withDelay(30, withTiming(0.08, {duration: 275}));
      opacity.value = withTiming(0, {duration: 275});
      translateY.value = withDelay(0, withTiming(-35, {duration: 250}));
      translateY.value = withDelay(300, withTiming(40, {duration: 375}));
      scaleX.value = withSpring(0.08);
      scaleY.value = withSpring(0.08);
      scaleX.value = withSpring(0);
      scaleY.value = withSpring(0);
      opacity.value = withSpring(1);
      scaleX.value = withDelay(750, withTiming(0.08, {duration: 250}));
      scaleY.value = withDelay(750, withTiming(0.08, {duration: 250}));
    }, 1000);
    return () => {
      clearTimeout(AnimateSceneTimerTask);
    };
  }, [opacity, scaleX, scaleY, translateY]);

  useEffect(() => {
    firestore()
      .collection('update')
      .doc('releasedUpdate')
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (documentSnapshot?.data()?.server_status === 'running') {
            setUpdateRequired(documentSnapshot?.data()?.isRequired);
            setUpdateVersion(documentSnapshot?.data()?.version);
            setUpdateURL(documentSnapshot?.data()?.updateURL);
          } else if (documentSnapshot?.data()?.server_status === 'stopped') {
            ToastAndroid.show(
              'Server maintenance, try again later.',
              ToastAndroid.LONG,
            );
            BackHandler.exitApp();
          }
        } else {
          if (__DEV__) {
            console.warn(
              `if you are a DEV, please open your firestore database and create the following: ${'\n'} collection: "update" ${'\n'} document: "releasedUpdate' ${'\n'} then, create the following: isRequired, updateURL, server_status and version.`,
            );
          }
        }
      })
      .finally(() => {
        if (!isEmpty(updateVersion)) {
          if (currentAppVersion !== updateVersion && !__DEV__) {
            handleModalShow();
          } else {
            if (isViewPagerCompleted()) {
              if (auth()?.currentUser !== null) {
                firestore()
                  .collection('users')
                  .doc(auth()?.currentUser?.uid)
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot?.exists) {
                      if (
                        documentSnapshot?.data()?.passcode?.passcode_enabled
                      ) {
                        setHavePasscode(true);
                      } else {
                        setHavePasscode(false);
                      }
                    } else {
                      auth()
                        ?.signOut()
                        .catch(error => {
                          ErrorToast(
                            'bottom',
                            'Failed to log out',
                            `${error}`,
                            true,
                            1000,
                          );
                        })
                        .finally(() => {
                          navigation?.dispatch(
                            CommonActions?.reset({
                              index: 0,
                              routes: [{name: 'splash'}],
                            }),
                          );
                          InfoToast(
                            'bottom',
                            'Please re-login',
                            'You need to re-login and complete your profile',
                            true,
                            1000,
                          );
                          navigation?.navigate('login');
                        });
                    }
                  })
                  .finally(() => {
                    if (!isNull(havePasscode)) {
                      if (havePasscode) {
                        navigation?.navigate('passcodeVerify');
                      } else {
                        navigation?.navigate('home');
                      }
                    }
                  });
              } else {
                navigation?.navigate('login');
              }
            } else {
              navigation?.navigate('onboarding');
            }
          }
        }
      });
    return () => {};
  }, [
    currentAppVersion,
    handleModalShow,
    havePasscode,
    navigation,
    updateVersion,
  ]);

  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY?.value}],
    };
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scaleX: scaleX?.value}, {scaleY: scaleY?.value}],
      opacity: opacity?.value,
    };
  }, []);

  const styles = StyleSheet.create({
    fill_screen: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    logo: {
      height: heightPercentageToDP(300),
      width: widthPercentageToDP(800),
      bottom: heightPercentageToDP(13.5),
    },
    bottom_text: {
      position: 'absolute',
      textAlign: 'center',
      fontSize: fontValue(20),
      bottom: heightPercentageToDP(6.25),
      fontFamily: FONTS.bold,
    },
    slogan_text: {
      position: 'absolute',
      textAlign: 'center',
      fontSize: fontValue(16),
      bottom: heightPercentageToDP(2.75),
      color: isThemeDark ? COLORS.white : COLORS.black,
      fontFamily: FONTS.regular,
      opacity: 0.4,
    },
  });

  function newYearDescription() {
    const dateObject = new Date();
    const currentDay = dateObject.getDate();
    const currentMonth = dateObject.getMonth();
    const currentYear = dateObject.getFullYear();
    let sloganText = 'We give people the closest distances';
    if (
      inRange(currentDay, 15, 32) &&
      currentMonth === 11 &&
      currentYear === 2024
    ) {
      sloganText = 'Hoping you shimmy shake your way into 2024';
    } else if (
      inRange(currentDay, 1, 11) &&
      currentMonth === 0 &&
      currentYear === 2025
    ) {
      sloganText = 'Wishing you the best in 2024';
    }
    return sloganText;
  }

  return (
    <SafeAreaView
      style={[
        styles.fill_screen,
        {
          backgroundColor: isThemeDark
            ? COLORS.primaryDark
            : COLORS.primaryLight,
        },
      ]}>
      <Animated.View style={[styles.container, viewAnimatedStyle]}>
        <Animated.Image
          style={[styles.logo, imageAnimatedStyle]}
          source={LogoImage}
        />
        <Text
          style={[
            styles.bottom_text,
            {color: isThemeDark ? COLORS.accentDark : COLORS.accentLight},
          ]}>
          Moon Meet
        </Text>
        <Text style={styles.slogan_text}>{newYearDescription()}</Text>
      </Animated.View>
      <UpdateBottomSheet
        sheetRef={updateSheetRef}
        sheetIndex={0}
        sheetSnapPoints={snapPoints}
        required={updatedRequired}
        onDownloadNowPress={async () => {
          if (await Linking.canOpenURL(updateURL)) {
            await Linking.openURL(updateURL);
          }
          dismissAll();
          BackHandler?.exitApp();
        }}
        onDoItLaterPress={() => {
          dismissAll();
          ManualFetchForDoItLater();
        }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
