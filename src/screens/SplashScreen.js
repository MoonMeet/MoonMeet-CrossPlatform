import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';
import appCheck from '@react-native-firebase/app-check';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import LogoImage from '../assets/images/logo.png';
import {heightPercentageToDP, widthPercentageToDP} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {withTheme, useTheme} from 'react-native-paper';

const SplashScreen = () => {
  const theme = useTheme();
  /**
   * Splash Screen animations.
   */
  const scaleX = useSharedValue(0.1);
  const scaleY = useSharedValue(0.1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const navigation = useNavigation();

  const [getViewPagerStats, setViewPagerStats] = React.useState('');
  /**
   * Getting Data from AsyncStorage
   */

  const getViewPagerCompleted = () => {
    AsyncStorage.getItem('isViewPagerCompleted').then(stringValue => {
      if (stringValue !== null) {
        setViewPagerStats(stringValue);
        return;
      }
      return false;
    });
  };

  async function enableFirebaseTools() {
    await crashlytics()?.setCrashlyticsCollectionEnabled(true);
    await analytics()?.setAnalyticsCollectionEnabled(true);
    await appCheck()?.activate('ignored', false);
  }

  useEffect(() => {
    enableFirebaseTools();
    getViewPagerCompleted();
    const AnimateScene = setTimeout(() => {
      scaleX.value = withDelay(30, withTiming(0.09, {duration: 275}));
      scaleY.value = withDelay(30, withTiming(0.09, {duration: 275}));
      opacity.value = withTiming(0, {duration: 275});
      translateY.value = withDelay(0, withTiming(375, {duration: 500}));
      translateY.value = withDelay(300, withTiming(0, {duration: 750}));
      scaleX.value = withSpring(0.09);
      scaleY.value = withSpring(0.09);
      scaleX.value = withSpring(0);
      scaleY.value = withSpring(0);
      opacity.value = withSpring(1);
      scaleX.value = withDelay(750, withTiming(0.09, {duration: 250}));
      scaleY.value = withDelay(750, withTiming(0.09, {duration: 250}));
    }, 750);
    const SplashScreenTimerTask = setTimeout(() => {
      if (getViewPagerStats === 'true') {
        if (auth()?.currentUser !== null) {
          let havePasscode = false;
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot?.exists) {
                if (documentSnapshot?.data()?.passcode?.passcode_enabled) {
                  havePasscode = true;
                }
              }
            })
            .finally(() => {
              if (havePasscode) {
                navigation?.navigate('passcodeVerify');
              } else {
                navigation?.navigate('home');
              }
            });
        } else {
          navigation?.navigate('login');
        }
      } else {
        navigation?.navigate('onboarding');
      }
    }, 2000);
    return () => {
      clearTimeout(SplashScreenTimerTask);
      clearTimeout(AnimateScene);
    };
  }, [getViewPagerStats, navigation, opacity, scaleX, scaleY, translateY]);

  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scaleX: scaleX.value}, {scaleY: scaleY.value}],
      opacity: opacity.value,
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.fill_screen, {backgroundColor: theme.colors.background}]}>
      <Animated.View style={[styles.container, viewAnimatedStyle]}>
        <Animated.Image
          style={[styles.logo, imageAnimatedStyle]}
          source={LogoImage}
        />
        <Text style={[styles.bottom_text, {color: theme.accent}]}>
          Moon Meet
        </Text>
        <Text style={styles.slogan_text}>
          We give people the closest distances
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

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
    position: 'relative',
    bottom: heightPercentageToDP(13.5),
  },
  bottom_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    bottom: heightPercentageToDP(6.25),
    fontFamily: FONTS.bold,
  },
  slogan_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 16,
    bottom: heightPercentageToDP(2.75),
    color: COLORS.black,
    fontFamily: FONTS.regular,
    opacity: 0.4,
  },
});

export default withTheme(SplashScreen);
