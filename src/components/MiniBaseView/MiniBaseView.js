import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {isIOS} from '../../utils/device/DeviceInfo';
import React from 'react';
import {COLORS} from '../../config/Miscellaneous';

const MiniBaseView = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={isIOS === 'ios' ? 'padding' : 'height'}>
          {children}
        </KeyboardAvoidingView>
      </Pressable>
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
