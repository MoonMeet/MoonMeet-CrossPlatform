import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../config/Miscellaneous';
import {withTheme, useTheme} from 'react-native-paper';
import {ThemeContext} from '../../config/Theme/Context';

const MiniBaseView = ({children}) => {
  const theme = useTheme();
  const {isThemeDark} = React.useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isThemeDark ? COLORS.primaryDark : COLORS.primaryLight,
    },
  });

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default withTheme(MiniBaseView);
