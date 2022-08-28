/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

package org.moon.moonmeet.notification;
  
import android.content.Context;
import android.graphics.Color;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.util.Log;

import org.moon.moonmeet.*;
import org.json.JSONObject;

import com.onesignal.OSNotification;
import com.onesignal.OSMutableNotification;
import com.onesignal.OSNotificationReceivedEvent;
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;

import java.math.BigInteger;

@SuppressWarnings("unused")
public class NotificationServiceExtension implements OSRemoteNotificationReceivedHandler {

    @Override
    public void remoteNotificationReceived(Context context, OSNotificationReceivedEvent notificationReceivedEvent) {
        OSNotification notification = notificationReceivedEvent.getNotification();

        OSMutableNotification mutableNotification = notification.mutableCopy();
        mutableNotification.setExtender(builder -> {

            builder.setColor(new BigInteger("FF566193", 16).intValue());
            Spannable spannableTitle = new SpannableString(notification.getTitle());
            spannableTitle.setSpan(new ForegroundColorSpan(Color.BLACK), 0, notification.getTitle().length(), 0);
            builder.setContentTitle(spannableTitle);

            Spannable spannableBody = new SpannableString(notification.getBody());
            spannableBody.setSpan(new ForegroundColorSpan(Color.BLACK), 0, notification.getBody().length(), 0);
            builder.setContentText(spannableBody);

            builder.setTimeoutAfter(30000);
            return builder;
        });
        if (BuildConfig.DEBUG) {
            JSONObject data = notification.getAdditionalData();
            Log.i("OneSignal", "Received Notification Data: " + data);
        }
        notificationReceivedEvent.complete(mutableNotification);
    }
}
