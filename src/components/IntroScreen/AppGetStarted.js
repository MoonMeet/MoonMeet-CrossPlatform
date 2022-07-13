import React from 'react';
import {View, Text, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {IntroStyles} from './IntroStyles';
import GetStarted from '../../assets/images/get_started.png';

interface AppGetStartedInterface {
  onPressButton: (() => void) | undefined;
}

const AppGetStarted = (props: AppGetStartedInterface) => {
  return (
    <View style={IntroStyles.PagerRender} key="2">
      <Image style={IntroStyles.illustration} source={GetStarted} />
      <Text style={IntroStyles.introduction_top_text}>Let's get started</Text>
      <Text style={IntroStyles.introduction_bottom_text}>
        Press the Continue button bellow to access to your Moon Meet Account or
        Sign Up
      </Text>
      <Button
        style={IntroStyles.introduction_button}
        uppercase={false}
        color="#566193"
        mode="contained"
        onPress={props.onPressButton}>
        Continue
      </Button>
    </View>
  );
};
export default AppGetStarted;
