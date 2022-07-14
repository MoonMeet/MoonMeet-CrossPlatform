import React, {useEffect} from 'react';
import StackNavigator from './src/config/Stack';
import {StatusBar, UIManager, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {enableFreeze} from 'react-native-screens';
import {COLORS} from './src/config/Miscellaneous';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {ThemeContext} from './src/config/Theme/Context';
import {MoonMeetDarkTheme, MoonMeetLightTheme} from './src/config/Theme/Theme';
import {ThemeMMKV} from './src/config/MMKV/ThemeMMKV';

/**
 * Enabling the experimental freeze of react-native-screens
 * enableFreeze(true);
 * Will enable this soon
 */

const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  useEffect(() => {
    if (ThemeMMKV.contains('isThemeDark')) {
      if (ThemeMMKV.getBoolean('isThemeDark')) {
        if (!isThemeDark) {
          toggleTheme();
        }
      } else {
        ThemeMMKV.set('isThemeDark', false);
      }
    } else {
      if (isThemeDark) {
        toggleTheme();
        ThemeMMKV.set('isThemeDark', false);
      }
    }
  }, [isThemeDark, toggleTheme]);

  let theme = isThemeDark ? MoonMeetDarkTheme : DefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const themePrefernces = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );
  return (
    <ThemeContext.Provider value={themePrefernces}>
      <PaperProvider theme={theme}>
        <StatusBar
          backgroundColor={
            isThemeDark ? COLORS.primaryDark : COLORS.primaryLight
          }
          animated={true}
          barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        />
        <StackNavigator />
        <Toast />
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default App;
