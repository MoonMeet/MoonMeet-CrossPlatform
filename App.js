/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useEffect} from 'react';
import StackNavigator from './src/config/Stack';
import {StatusBar, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {COLORS} from './src/config/Miscellaneous';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {ThemeContext} from './src/config/Theme/Context';
import {ThemeMMKV} from './src/config/MMKV/ThemeMMKV';
import {MoonMeetDarkTheme} from './src/config/Theme/Theme';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import OneSignal from 'react-native-onesignal';

async function enableFirebaseTools() {
  await crashlytics()?.setCrashlyticsCollectionEnabled(true);
  await analytics()?.setAnalyticsCollectionEnabled(true);
}

const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  useEffect(() => {
    enableFirebaseTools();
  }, []);

  useEffect(() => {
    OneSignal.getDeviceState().then(deviceState => {
      if (deviceState !== null) {
        let {isSubscribed} = deviceState;
        if (isSubscribed) {
          OneSignal.addTrigger('unsubscribed', false);
        } else {
          OneSignal.addTrigger('unsubscribed', true);
          OneSignal.promptForPushNotificationsWithUserResponse(true);
        }
        if (__DEV__) {
          console.warn('OneSignal: isSubscribed ', deviceState.isSubscribed);
          console.warn('OneSignal: userId ', deviceState.userId);
        }
      }
    });
    return () => {};
  }, []);

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

  const styles = StyleSheet.create({
    GHRV: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: isThemeDark ? COLORS.primaryDark : COLORS.primaryLight,
    },
  });

  return (
    <>
      <StatusBar
        backgroundColor={isThemeDark ? COLORS.primaryDark : COLORS.primaryLight}
        animated={true}
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
      />
      <ThemeContext.Provider value={themePrefernces}>
        <PaperProvider theme={theme}>
          <GestureHandlerRootView style={styles.GHRV}>
            <BottomSheetModalProvider>
              <StackNavigator />
              <Toast />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </PaperProvider>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
