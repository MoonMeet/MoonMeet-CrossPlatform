/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../components/Spacer/Spacer';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView.tsx';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {RadioButton, withTheme} from 'react-native-paper';
import {ThemeContext} from '../config/Theme/Context.ts';
import {COLORS, FONTS} from '../config/Miscellaneous';
import SpacerHorizontal from '../components/Spacer/SpacerHorizontal';
import {StorageInstance} from '../config/MMKV/StorageInstance';

const DarkModeSettings = () => {
  const {toggleTheme, isThemeDark} = React.useContext(ThemeContext);

  const styles = StyleSheet.create({
    radioView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginLeft: widthPercentageToDP(2.5),
    },
    textStyle: {
      fontFamily: FONTS.regular,
      color: isThemeDark ? COLORS.white : COLORS.black,
      fontSize: fontValue(20.5),
      opacity: isThemeDark ? 0.8 : 0.4,
    },
  });

  return (
    <MiniBaseView>
      <Spacer height={heightPercentageToDP(0.5)} />
      <View style={styles.radioView}>
        <RadioButton
          color={isThemeDark ? COLORS.accentDark : COLORS.accentLight}
          status={isThemeDark ? 'checked' : 'unchecked'}
          value={'true'}
          onPress={() => {
            if (!isThemeDark) {
              toggleTheme();
              StorageInstance.set('isThemeDark', true);
            }
          }}
        />
        <SpacerHorizontal width={2.5} />
        <Text style={styles.textStyle}>Dark</Text>
      </View>
      <View style={styles.radioView}>
        <RadioButton
          color={isThemeDark ? COLORS.accentDark : COLORS.accentLight}
          status={!isThemeDark ? 'checked' : 'unchecked'}
          value={'false'}
          onPress={() => {
            if (isThemeDark) {
              toggleTheme();
              StorageInstance.set('isThemeDark', false);
            }
          }}
        />
        <SpacerHorizontal width={2.5} />
        <Text style={styles.textStyle}>Light</Text>
      </View>
    </MiniBaseView>
  );
};
export default withTheme(DarkModeSettings);
