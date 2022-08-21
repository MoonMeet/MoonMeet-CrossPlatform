/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {View, Image, Text} from 'react-native';
import {IntroStyles} from './IntroStyles';
import ChattingIntro from '../../assets/images/chatting_intro.png';

const AppDiscover = () => {
  return (
    <View style={IntroStyles.PagerRender} key="1">
      <Image style={IntroStyles.illustration} source={ChattingIntro} />
      <Text
        adjustFontSizeToFit={true}
        style={IntroStyles.introduction_top_text}>
        Hanging out with your Relationships
      </Text>
      <Text
        adjustFontSizeToFit={true}
        style={IntroStyles.introduction_bottom_text}>
        Get in touch with your Relationships by inviting them to use Moon Meet
        and join the party with you.
      </Text>
    </View>
  );
};

export default AppDiscover;
