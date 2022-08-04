import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/Dimensions';
import {COLORS, FONTS} from '../../config/Miscellaneous';

const ViewItemTitle = ({titleItem}) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.titleTextView}>{titleItem}</Text>
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
    fontSize: fontValue(16),
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
});
export default ViewItemTitle;
