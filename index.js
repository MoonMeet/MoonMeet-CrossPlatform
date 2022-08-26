/**
 * @format
 */

import {AppRegistry} from 'react-native';
import OneSignal from 'react-native-onesignal';
import App from './App';
import {name as MoonMeet} from './app.json';
import {ONESIGNAL_APP_ID} from './src/secrets/sensitive';

OneSignal.setAppId(ONESIGNAL_APP_ID);

OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    console.log(
      'OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    let notification = notificationReceivedEvent.getNotification();
    console.log('notification: ', notification);
    const data = notification.additionalData;
    console.log('additionalData: ', data);
    notificationReceivedEvent.complete(notification);
  },
);

OneSignal.setNotificationOpenedHandler(notification => {
  console.log('OneSignal: notification opened:', notification);
});

AppRegistry.registerComponent(MoonMeet, () => App);
