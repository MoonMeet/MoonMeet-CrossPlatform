import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';
import appCheck from '@react-native-firebase/app-check';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {Center, HStack, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LogoImage from '../assets/images/logo.png';
import {heightPercentageToDP, widthPercentageToDP} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';

const SplashScreen = () => {
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
    await crashlytics().setCrashlyticsCollectionEnabled(true);
    await analytics().setAnalyticsCollectionEnabled(true);
    await appCheck().activate('ignored', false);
  }

  useEffect(() => {
    enableFirebaseTools();
    getViewPagerCompleted();
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
                navigation.navigate('passcodeVerify');
              } else {
                navigation.navigate('home');
              }
            });
        } else {
          navigation.navigate('login');
        }
      } else {
        navigation.navigate('onboarding');
      }
    }, 2000);
    return () => {
      clearTimeout(SplashScreenTimerTask);
    };
  });

  return (
    <SafeAreaView style={styles.fill_screen}>
      <VStack style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle={'dark-content'} />
        <Image style={styles.logo} source={LogoImage} />
        <Text style={styles.bottom_text}>Moon Meet</Text>
        <Text style={styles.slogan_text}>
          We give people the closest distances
        </Text>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fill_screen: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(55),
    position: 'relative',
    bottom: heightPercentageToDP(13.5),
  },
  bottom_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    bottom: heightPercentageToDP(6.25),
    color: COLORS.accentLight,
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

export default SplashScreen;
