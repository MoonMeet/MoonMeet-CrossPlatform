/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {fontValue} from '../../config/Dimensions';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {ThemeContext} from '../../config/Theme/Context';

interface DataItemTitleInterface {
  titleItem: string;
}

const DataItemTitle = (props: DataItemTitleInterface) => {
  const theme = useTheme();
  const {isThemeDark} = React.useContext(ThemeContext);

  const styles = StyleSheet.create({
    titleView: {
      padding: '2%',
      flexDirection: 'row',
    },
    titleTextView: {
      fontSize: fontValue(18),
      paddingLeft: '3%',
      paddingRight: '3%',
      textAlign: 'center',
      color: isThemeDark ? COLORS.accentDark : COLORS.accentLight,
      fontFamily: FONTS.regular,
    },
  });
  return (
    <View style={styles.titleView}>
      <Text style={styles.titleTextView}>{props?.titleItem}</Text>
    </View>
  );
};

export default DataItemTitle;
