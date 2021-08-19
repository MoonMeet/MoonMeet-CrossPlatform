import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {isIOS} from '../../utils/device/DeviceInfo';
import React from 'react';
import {COLORS} from '../../config/Miscellaneous';

const MiniBaseView = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle={'dark-content'} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
});

export default MiniBaseView;
