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
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';

/**
 * Notifee message channel
 */

notifee.createChannel({
  id: 'messages',
  name: 'Messages',
  lights: true,
  vibration: true,
  importance: AndroidImportance.HIGH,
});

/**
 *Initialize OneSignal
 */

OneSignal.setAppId(ONESIGNAL_APP_ID);
OneSignal.setLanguage('en');

OneSignal.setNotificationWillShowInForegroundHandler(
  async notificationReceivedEvent => {
    let NotificationAdditiionalData =
      notificationReceivedEvent?.getNotification()?.additionalData;
    console.log(NotificationAdditiionalData);
    if (NotificationAdditiionalData?.type === 'chat') {
      await notifee.displayNotification({
        title: 'Bilel Aifa',
        body: `New message from ${NotificationAdditiionalData?.senderName}`,
        android: {
          channelId: 'messages',
          largeIcon: NotificationAdditiionalData?.senderPhoto,
          timestamp: NotificationAdditiionalData?.messageTime,
          showTimestamp: true,
          smallIcon: 'moon_icon',
          style: {
            type: AndroidStyle.BIGTEXT,
            text: `${NotificationAdditiionalData?.messageDelivered}`,
          },
        },
      });
      notificationReceivedEvent.complete(null);
    } else {
      notificationReceivedEvent.complete(
        notificationReceivedEvent?.getNotification(),
      );
    }
  },
);

AppRegistry.registerComponent(MoonMeet, () => App);
