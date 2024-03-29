/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {Image, View} from 'react-native';
import {IntroStyles} from './IntroStyles.ts';
import {Text} from 'react-native-paper';
import {StartupIntro} from 'index.d';

const AppOverview = () => {
  return (
    <View style={IntroStyles.PagerRender} key="0">
      <Image style={IntroStyles.illustration} source={StartupIntro} />
      <Text
        adjustsFontSizeToFit={true}
        style={IntroStyles.introduction_top_text}>
        Welcome to Moon Meet
      </Text>
      <Text
        adjustsFontSizeToFit={true}
        style={IntroStyles.introduction_bottom_text}>
        Moon Meet is a chat application that completely focus on Privacy,
        Connection and Features.
      </Text>
    </View>
  );
};

export default AppOverview;
