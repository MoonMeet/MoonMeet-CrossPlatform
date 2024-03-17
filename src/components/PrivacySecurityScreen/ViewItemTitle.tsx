/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'config/Dimensions';
import {COLORS, FONTS} from 'config/Miscellaneous';

interface ViewItemTitleProps {
  titleItem?: string;
}

const ViewItemTitle = (props: ViewItemTitleProps) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.titleTextView}>{props.titleItem}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  titleView: {
    paddingTop: heightPercentageToDP(1),
    paddingBottom: heightPercentageToDP(0.25),
    paddingRight: widthPercentageToDP(1),
    paddingLeft: widthPercentageToDP(1),
    flexDirection: 'row',
  },
  titleTextView: {
    paddingLeft: widthPercentageToDP(3.75),
    fontSize: fontValue(15),
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
});
export default ViewItemTitle;
