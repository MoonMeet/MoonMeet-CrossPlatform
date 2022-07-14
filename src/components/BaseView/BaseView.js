import React from 'react';
import {Keyboard, Pressable, SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from '../../config/Miscellaneous';
import {withTheme, useTheme} from 'react-native-paper';
import {ThemeContext} from '../../config/Theme/Context';

const BaseView = ({children}) => {
  const theme = useTheme();
  const {isThemeDark} = React.useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isThemeDark ? COLORS.primaryDark : COLORS.primaryLight,
    },
  });
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

export default withTheme(BaseView);
