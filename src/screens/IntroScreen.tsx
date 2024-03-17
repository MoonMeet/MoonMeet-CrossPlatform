/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback} from 'react';
import {BackHandler} from 'react-native';
import PagerView from 'react-native-pager-view';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AppOverview from '@components/IntroScreen/AppOverview.tsx';
import AppDiscover from '@components/IntroScreen/AppDiscover.tsx';
import AppGetStarted from '@components/IntroScreen/AppGetStarted.tsx';
import {StorageInstance} from '../config/MMKV/StorageInstance';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView.tsx';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/NavigationTypes/NavigationTypes';

const IntroScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler?.exitApp();
        return true;
      };

      BackHandler?.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler?.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  const setViewPagerCompleted = () => {
    StorageInstance?.set('onboardingComplete', true);
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
