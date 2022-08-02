import React from 'react';
import {isUndefined} from 'lodash';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/Dimensions';

const SpacerHorizontal = ({width}) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: heightPercentageToDP(1),
      width: isUndefined(width) ? 10 : widthPercentageToDP(width),
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default SpacerHorizontal;
