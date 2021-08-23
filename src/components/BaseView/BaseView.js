import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {isIOS} from '../../utils/device/DeviceInfo';
import {COLORS} from '../../config/Miscellaneous';

const BaseView = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <StatusBar backgroundColor="#FFFFFF" barStyle={'dark-content'} />
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

export default React.memo(BaseView);
