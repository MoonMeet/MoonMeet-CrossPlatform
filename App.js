import React from 'react';
import StackNavigator from './src/config/Stack';
import {StatusBar, UIManager, Platform} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import Toast from 'react-native-toast-message';
import {enableFreeze} from 'react-native-screens';
import {COLORS} from './src/config/Miscellaneous';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  PreferencesContext,
} from './src/config/Theme/Theme';

const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

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

  const MoonPaperTheme = {
    ...CombinedDarkTheme,
    colors: {
      ...CombinedDarkTheme.colors,
      accent: COLORS.accentLight,
    },
    version: 3,
  };

  // Enabling the experimental freeze of react-native-screens
  enableFreeze(true);
  // TODO: add application animation
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  return (
    <PaperProvider theme={CombinedDefaultTheme}>
      <NativeBaseProvider>
        <StatusBar
          backgroundColor={COLORS.primaryLight}
          animated={true}
          barStyle={'dark-content'}
        />
        <StackNavigator />
        <Toast />
      </NativeBaseProvider>
    </PaperProvider>
  );
};

export default App;
