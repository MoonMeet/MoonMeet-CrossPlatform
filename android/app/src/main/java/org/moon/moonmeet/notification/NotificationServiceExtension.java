/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

package org.moon.moonmeet.notification;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.onesignal.OSMutableNotification;
import com.onesignal.OSNotification;
import com.onesignal.OSNotificationReceivedEvent;
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;

import org.json.JSONException;
import org.json.JSONObject;
import org.moon.moonmeet.R;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;

@SuppressWarnings("unused")
public class NotificationServiceExtension implements OSRemoteNotificationReceivedHandler {
    private static final String TAG = "NotificationServiceExtension";

    private Bitmap getBitmapFromURL(String src) {
        try {
            URL url = new URL(src);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            return BitmapFactory.decodeStream(input);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void remoteNotificationReceived(Context context, OSNotificationReceivedEvent notificationReceivedEvent) {
        OSNotification osNotification = notificationReceivedEvent.getNotification();
        JSONObject NotificationAdditionalData = osNotification.getAdditionalData();
        Log.i(TAG, NotificationAdditionalData.toString());
        OSMutableNotification mutableNotification = osNotification.mutableCopy();
        try {
            if (NotificationAdditionalData.getString("type").equals("chat")) {
                mutableNotification.setExtender(builder -> {
                    try {
                        builder.setChannelId("messages");
                        builder.setSmallIcon(R.drawable.moon_icon);
                        builder.setStyle(new NotificationCompat.BigTextStyle().bigText(NotificationAdditionalData.getString("messageDelivered")));
                        builder.setColor(new BigInteger("FF566193", 16).intValue());
                        builder.setContentTitle(NotificationAdditionalData.getString("senderName"));
                        builder.setContentText("New message from " + NotificationAdditionalData.getString("senderName"));
                        builder.setPriority(NotificationCompat.PRIORITY_HIGH);
                        builder.setWhen(Long.parseLong(NotificationAdditionalData.getString("messageTime")));
                        builder.setLargeIcon(getBitmapFromURL(NotificationAdditionalData.getString("senderPhoto")));
                    } catch (JSONException e) {
                        e.printStackTrace();
                        notificationReceivedEvent.complete(null);
                    }
                    Log.i(TAG, "returning a builder from notification chat type.");
                    return builder;
                });
            } else {
                mutableNotification.setExtender(builder -> {
                    builder.setChannelId("default");
                    builder.setSmallIcon(R.drawable.moon_icon);
                    builder.setColor(new BigInteger("FF566193", 16).intValue());
                    builder.setContentTitle(osNotification.getTitle());
                    builder.setContentText(osNotification.getBody());
                    return builder;
                });
            }
            notificationReceivedEvent.complete(mutableNotification);
        } catch (JSONException e) {
            e.printStackTrace();
            notificationReceivedEvent.complete(null);
        }
    }
}
