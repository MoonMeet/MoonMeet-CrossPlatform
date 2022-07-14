import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/Dimensions';

type SpacerProps = {
  width: number | undefined,
};

const SpacerHorizontal = (props: SpacerProps) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: heightPercentageToDP(1),
      width: widthPercentageToDP(props.width) || 10,
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default SpacerHorizontal;
