import React from 'react';
import StackNavigator from './src/config/Stack';
import {StatusBar, UIManager, Platform} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import Toast from 'react-native-toast-message';
import {enableFreeze} from 'react-native-screens';
import {COLORS} from './src/config/Miscellaneous';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  MoonPaperDarkTheme,
  MoonPaperLightTheme,
} from './src/config/Theme/Theme';

/**
 * Enabling the experimental freeze of react-native-screens
 * enableFreeze(true);
 * Will enable this soon
 */

const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  let theme = isThemeDark ? MoonPaperDarkTheme : MoonPaperLightTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );
  // TODO: add application animation
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  return (
    <PaperProvider>
      <NativeBaseProvider>
        <StatusBar
          backgroundColor={
            isThemeDark ? COLORS.primaryDark : COLORS.primaryLight
          }
          animated={true}
          barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        />
        <StackNavigator />
        <Toast />
      </NativeBaseProvider>
    </PaperProvider>
  );
};

export default App;
