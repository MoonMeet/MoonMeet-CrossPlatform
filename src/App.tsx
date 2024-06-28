/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, { useEffect } from "react";
import StackNavigator from "./config/Stack";
import { StatusBar, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { COLORS } from "./config/Miscellaneous";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { ThemeContext } from "config/Theme/Context.ts";
import { StorageInstance } from "config/MMKV/StorageInstance.ts";
import { MoonMeetDarkTheme } from "config/Theme/Theme.ts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import crashlytics from "@react-native-firebase/crashlytics";
import analytics from "@react-native-firebase/analytics";
import appCheck from "@react-native-firebase/app-check";
import OneSignal from "react-native-onesignal";
import { enableLayoutAnimations } from "react-native-reanimated";

/**
 * It enables the firebase tools.
 *
 * @async
 * @function
 */

async function firebaseToolsEnablement() {
  try {
    const crashlyticsInstance = crashlytics();
    const analyticsInstance = analytics();

    if (crashlyticsInstance) {
      await crashlyticsInstance.setCrashlyticsCollectionEnabled(!__DEV__);
    }

    if (analyticsInstance) {
      await analyticsInstance.setAnalyticsCollectionEnabled(!__DEV__);
    }
  } catch (err) {
    if (__DEV__) {
      console.error("Failed to enable Firebase tools: ", err);
    }
  }
}

/**
 * It enables the firebase tools.
 *
 * @async
 * @function
 */
async function appCheckInitialization(rnFbProvider: any) {
  try {
    await appCheck().initializeAppCheck({
      provider: rnFbProvider,
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    if (__DEV__) {
      console.error("Failed to initialize Firebase App Check: ", err);
    }
  }
}

const GHRVStyles = StyleSheet.create({
  light: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.primaryLight
  },
  dark: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.primaryDark
  }
});

/**
 * Play integrity initialisation
 */
let rnFbProvider: any = appCheck().newReactNativeFirebaseAppCheckProvider();
rnFbProvider.configure({
  android: {
    provider: __DEV__ ? "debug" : "playIntegrity",
    debugToken: "FIREBASE_APPCHECK_DEBUG_TOKEN"
  },
  apple: {
    provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
    debugToken: "NO-TOKEN"
  },
  web: {
    provider: "reCaptchaV3",
    siteKey: "NO-TOKEN"
  }
});

/**
 * Disabling layoutAnimations fixes React Navigation Header.
 */
enableLayoutAnimations(false);

const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(
    StorageInstance.contains("isThemeDark")
      ? StorageInstance.getBoolean("isThemeDark") === true
      : false
  );

  useEffect(() => {
    appCheckInitialization(rnFbProvider);
    (async () => {
      await firebaseToolsEnablement();
    })();
  }, []);

  useEffect(() => {
    OneSignal.getDeviceState().then(deviceState => {
      if (deviceState !== null) {
        let { isSubscribed } = deviceState;
        if (isSubscribed) {
          OneSignal.addTrigger("unsubscribed", "false");
        } else {
          OneSignal.promptForPushNotificationsWithUserResponse(true);
        }
      }
    });
  }, []);

  let theme = isThemeDark ? MoonMeetDarkTheme : DefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const themePreferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark
    }),
    [toggleTheme, isThemeDark]
  );

  useEffect(() => {
    if (StorageInstance.contains("isThemeDark")) {
      if (StorageInstance.getBoolean("isThemeDark")) {
        if (!isThemeDark) {
          toggleTheme();
        }
      } else {
        StorageInstance.set("isThemeDark", false);
      }
    } else {
      if (isThemeDark) {
        toggleTheme();
        StorageInstance.set("isThemeDark", false);
      }
    }
  }, [isThemeDark, toggleTheme]);

  return (
    <>
      <StatusBar
        backgroundColor={isThemeDark ? COLORS.primaryDark : COLORS.primaryLight}
        animated={true}
        barStyle={isThemeDark ? "light-content" : "dark-content"}
      />
      <ThemeContext.Provider value={themePreferences}>
        <PaperProvider theme={theme}>
          <GestureHandlerRootView
            style={isThemeDark ? GHRVStyles.dark : GHRVStyles.light}>
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
