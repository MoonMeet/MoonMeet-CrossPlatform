import React from 'react';
import {View, Image, Text} from 'react-native';
import {IntroStyles} from './IntroStyles';
import StartupIntro from '../../assets/images/startup_intro.png';

const AppOverview = () => {
  return (
    <View style={IntroStyles.PagerRender} key="0">
      <Image style={IntroStyles.illustration} source={StartupIntro} />
      <Text style={IntroStyles.introduction_top_text}>
        Welcome to Moon Meet
      </Text>
      <Text style={IntroStyles.introduction_bottom_text}>
        Moon Meet is a chat application that completely focus on Privacy,
        Connection and Features.
      </Text>
    </View>
  );
};

export default AppOverview;
