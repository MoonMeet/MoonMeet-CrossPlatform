import React from 'react';
import {isUndefined} from 'lodash';
import {StyleSheet, View} from 'react-native';

const Spacer = ({height}) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: isUndefined(height) ? 10 : height,
      width: '100%',
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default Spacer;
