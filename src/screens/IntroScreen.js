import React, {useCallback} from 'react';
import {
  BackHandler,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {Button} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import AppOverview from '../components/IntroScreen/AppOverview';
import AppDiscover from '../components/IntroScreen/AppDiscover';
import AppGetStarted from '../components/IntroScreen/AppGetStarted';

const IntroScreen = () => {
  const navigation = useNavigation();

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

  const ViewPagerPassed = 'true';

  const storeViewPagerCompleted = stringValue => {
    AsyncStorage.setItem('isViewPagerCompleted', stringValue);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PagerView style={{flex: 1}} initialPage={0}>
        <AppOverview />
        <AppDiscover />
        <AppGetStarted
          onPressButton={() => {
            storeViewPagerCompleted(ViewPagerPassed);
            navigation?.navigate('login');
          }}
        />
      </PagerView>
    </SafeAreaView>
  );
};

export default IntroScreen;
