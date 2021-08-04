import React, {useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

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

  const isUserAuthenticated = () => {
    return auth()?.currentUser !== null;
  };

  useEffect(() => {
    getViewPagerCompleted();
    const SplashScreenTimerTask = setTimeout(() => {
      if (getViewPagerStats === 'true') {
        if (isUserAuthenticated()) {
          navigation.navigate('home');
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
      <View style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle={'dark-content'} />
        <Image
          style={styles.logo}
          source={require('../assets/images/logo.png')}
        />
        <Text style={styles.bottom_text}>Moon Meet</Text>
        <Text style={styles.slogan_text}>
          We give people the closest distances
        </Text>
      </View>
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
    padding: '2%',
  },
  logo: {
    height: 230,
    width: 230,
    position: 'relative',
    bottom: '13%',
  },
  bottom_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    bottom: '6.5%',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  slogan_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 16,
    bottom: '2.5%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
    opacity: 0.4,
  },
});

export default SplashScreen;
