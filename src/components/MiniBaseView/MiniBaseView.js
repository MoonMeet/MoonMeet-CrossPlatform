import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../config/Miscellaneous';

const MiniBaseView = ({children}) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
});

export default MiniBaseView;
