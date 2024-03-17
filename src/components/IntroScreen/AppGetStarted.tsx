/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {GestureResponderEvent, Image, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {IntroStyles} from './IntroStyles.ts';
import {COLORS} from 'config/Miscellaneous.ts';
import {GetStarted} from 'index.d';

interface AppGetStartedProps {
  onPressButton: (e: GestureResponderEvent) => void | undefined;
}

const AppGetStarted = (props: AppGetStartedProps) => {
  return (
    <View style={IntroStyles.PagerRender} key="2">
      <Image style={IntroStyles.illustration} source={GetStarted} />
      <Text
        adjustsFontSizeToFit={true}
        style={IntroStyles.introduction_top_text}>
        Let's get started
      </Text>
      <Text
        adjustsFontSizeToFit={true}
        style={IntroStyles.introduction_bottom_text}>
        Press the Continue button bellow to access to your Moon Meet Account or
        Sign Up
      </Text>
      <Button
        style={IntroStyles.introduction_button}
        uppercase={false}
        textColor={COLORS.accentLight}
        mode="outlined"
        onPress={props.onPressButton}>
        Continue
      </Button>
    </View>
  );
};
export default AppGetStarted;
