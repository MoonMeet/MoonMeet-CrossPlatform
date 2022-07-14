import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../components/Spacer/Spacer';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {heightPercentageToDP} from '../config/Dimensions';
import {withTheme} from 'react-native-paper';
import {RadioButton, HelperText, useTheme} from 'react-native-paper';
import {ThemeContext} from '../config/Theme/Context';

const DarkModeSettings = () => {
  const theme = useTheme();
  const {toggleTheme, isThemeDark} = React.useContext(ThemeContext);

  return (
    <MiniBaseView>
      <Spacer height={heightPercentageToDP(0.5)} />
      <View>
        <Text>On</Text>
        <RadioButton
          status={isThemeDark ? 'checked' : 'unchecked'}
          value={true}
          onPress={() => {
            if (!isThemeDark) {
              toggleTheme();
            }
          }}
        />
      </View>
      <View>
        <Text>Off</Text>
        <RadioButton
          status={!isThemeDark ? 'checked' : 'unchecked'}
          value={false}
          onPress={() => {
            if (isThemeDark) {
              toggleTheme();
            }
          }}
        />
      </View>
      <HelperText type="info" visible />
    </MiniBaseView>
  );
};
export default withTheme(DarkModeSettings);
