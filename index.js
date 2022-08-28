/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */
import {AppRegistry} from 'react-native';
import OneSignal from 'react-native-onesignal';
import App from './App';
import {name as MoonMeet} from './app.json';
import {ONESIGNAL_APP_ID} from './src/secrets/sensitive';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {COLORS} from './src/config/Miscellaneous';
import {enableFreeze} from 'react-native-screens';

/**
 * Enabling the experimental freeze of react-native-screens
 * Will enable this soon
 **/

enableFreeze(true);

/**
 *Initialize OneSignal
 */
OneSignal.setAppId(ONESIGNAL_APP_ID);
OneSignal.setLanguage('en');

notifee.createChannel({
  id: 'messages',
  name: 'New Messages',
  lights: true,
  vibration: true,
  importance: AndroidImportance.HIGH,
});

if (__DEV__) {
  OneSignal.setLogLevel(6, 0);
}

OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    console.log(
      'OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    let notification = notificationReceivedEvent.getNotification();
    if (notificationReceivedEvent?.getNotification()?.body === 'New Message') {
      notificationReceivedEvent.complete(null);
      notifee.displayNotification({
        title: 'New Message',
        body: 'A new message has been arrived.',
        android: {
          channelId: 'messages',
          color: COLORS.accentLight,
        },
      });
    } else {
      notificationReceivedEvent.complete(notification);
    }
  },
);

AppRegistry.registerComponent(MoonMeet, () => App);
