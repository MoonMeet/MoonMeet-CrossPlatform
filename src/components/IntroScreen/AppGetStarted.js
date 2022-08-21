/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {View, Text, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {IntroStyles} from './IntroStyles';
import GetStarted from '../../assets/images/get_started.png';

const AppGetStarted = ({onPressButton}) => {
  return (
    <View style={IntroStyles.PagerRender} key="2">
      <Image style={IntroStyles.illustration} source={GetStarted} />
      <Text
        adjustFontSizeToFit={true}
        style={IntroStyles.introduction_top_text}>
        Let's get started
      </Text>
      <Text
        adjustFontSizeToFit={true}
        style={IntroStyles.introduction_bottom_text}>
        Press the Continue button bellow to access to your Moon Meet Account or
        Sign Up
      </Text>
      <Button
        style={IntroStyles.introduction_button}
        uppercase={false}
        color="#566193"
        mode="outlined"
        onPress={onPressButton}>
        Continue
      </Button>
    </View>
  );
};
export default AppGetStarted;
