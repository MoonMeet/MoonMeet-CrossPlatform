import React, {useCallback} from 'react';
import {BackHandler} from 'react-native';
import PagerView from 'react-native-pager-view';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AppOverview from '../components/IntroScreen/AppOverview';
import AppDiscover from '../components/IntroScreen/AppDiscover';
import AppGetStarted from '../components/IntroScreen/AppGetStarted';
import {OnboardingMMKV} from '../config/MMKV/OnboardingMMKV';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import auth from '@react-native-firebase/auth';

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
  const setViewPagerCompleted = () => {
    OnboardingMMKV.set('onboardingComplete', true);
  };

  return (
    <MiniBaseView>
      <PagerView style={{flex: 1}} initialPage={0}>
        <AppOverview />
        <AppDiscover />
        <AppGetStarted
          onPressButton={() => {
            setViewPagerCompleted();
            if (auth()?.currentUser !== null) {
              navigation?.navigate('home');
            } else {
              navigation?.navigate('login');
            }
          }}
        />
      </PagerView>
    </MiniBaseView>
  );
};

export default IntroScreen;
