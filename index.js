/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2023.
 */
import {AppRegistry} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import App from './src/App';
import {name as MoonMeet} from './app.json';
import {ONESIGNAL_APP_ID} from 'secrets/sensitive';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';

/**
 * Notifee message channel
 */

notifee.isChannelCreated('messages').then(created => {
  if (created) {
    if (__DEV__) {
      console.log('channelId: messages - is already created.');
    }
  } else {
    notifee
      .createChannel({
        id: 'messages',
        name: 'Messages',
        lights: true,
        vibration: true,
        importance: AndroidImportance.HIGH,
      })
      .then(() => {
        if (__DEV__) {
          console.log('messages channel created.');
        }
      });
  }
});
/**
 *Initialize OneSignal
 */

if (__DEV__) {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
}

OneSignal.initialize(ONESIGNAL_APP_ID);

OneSignal.Notifications.addEventListener(
  'foregroundWillDisplay',
  async event => {
    const notification = event.getNotification();
    const NotificationAdditionalData = notification?.additionalData;

    if (NotificationAdditionalData?.type === 'chat') {
      if (NotificationAdditionalData?.messageDelivered) {
        await notifee.displayNotification({
          title: NotificationAdditionalData.senderName,
          body: `New message from ${NotificationAdditionalData?.senderName}`,
          android: {
            channelId: 'messages',
            largeIcon: NotificationAdditionalData?.senderPhoto,
            timestamp: NotificationAdditionalData?.messageTime,
            showTimestamp: true,
            smallIcon: 'moon_icon',
            style: {
              type: AndroidStyle.BIGTEXT,
              text: NotificationAdditionalData.messageDelivered,
            },
          },
        });
      } else if (NotificationAdditionalData?.imageDelivered) {
        await notifee.displayNotification({
          title: NotificationAdditionalData?.senderName,
          body: NotificationAdditionalData?.imageDelivered,
          android: {
            channelId: 'messages',
            largeIcon: NotificationAdditionalData?.senderPhoto,
            timestamp: NotificationAdditionalData?.messageTime,
            showTimestamp: true,
            smallIcon: 'moon_icon',
          },
        });
      }
      event.preventDefault(); // Prevent OneSignal notification from being displayed
    } else {
      event.getNotification().display(); // Display the OneSignal notification
    }
  },
);

AppRegistry.registerComponent(MoonMeet, () => App);
