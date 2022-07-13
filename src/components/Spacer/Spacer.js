import React from 'react';
import {StyleSheet, View} from 'react-native';

type SpacerProps = {
  height: number | undefined,
};

const Spacer = (props: SpacerProps) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: props?.height || 10,
      width: '100%',
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default Spacer;
