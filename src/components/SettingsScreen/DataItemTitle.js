/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {fontValue} from '../../config/Dimensions';
import {COLORS, FONTS} from '../../config/Miscellaneous';

interface DataItemTitleInterface {
  titleItem: string;
}

const DataItemTitle = (props: DataItemTitleInterface) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.titleTextView}>{props?.titleItem}</Text>
    </View>
  );
};
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
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
});
export default DataItemTitle;
