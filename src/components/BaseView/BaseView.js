import React from 'react';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {COLORS} from '../../config/Miscellaneous';

const BaseView = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        {children}
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

export default BaseView;
