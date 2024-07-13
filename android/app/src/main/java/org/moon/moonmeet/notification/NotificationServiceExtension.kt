/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2024.
 */
package org.moon.moonmeet.notification

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.annotation.Keep
import androidx.core.app.NotificationCompat
import com.onesignal.notifications.IDisplayableMutableNotification
import com.onesignal.notifications.INotificationReceivedEvent
import com.onesignal.notifications.INotificationServiceExtension
import org.json.JSONException
import org.json.JSONObject
import org.moon.moonmeet.R
import java.io.IOException
import java.math.BigInteger
import java.net.HttpURLConnection
import java.net.URL

@Keep
class NotificationServiceExtension : INotificationServiceExtension {

    private fun getBitmapFromURL(src: String): Bitmap? {
        return try {
            val url = URL(src)
            val connection = url.openConnection() as HttpURLConnection
            connection.doInput = true
            connection.connect()
            val input = connection.inputStream
            BitmapFactory.decodeStream(input)
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }

    override fun onNotificationReceived(event: INotificationReceivedEvent) {
        val notification: IDisplayableMutableNotification = event.notification
        val notificationAdditionalData: JSONObject? = notification.additionalData
        Log.i(TAG, notificationAdditionalData.toString())

        try {
            if (notificationAdditionalData != null) {
                if (notificationAdditionalData.getString("type") == "chat") {
                    notification.setExtender { builder: NotificationCompat.Builder ->
                        if (notificationAdditionalData.has("imageDelivered")) {
                            try {
                                builder.setChannelId("messages")
                                builder.setSmallIcon(R.drawable.moon_icon)
                                builder.setColor(BigInteger("FF566193", 16).toInt())
                                builder.setContentTitle(notificationAdditionalData.getString("senderName"))
                                builder.setContentText(notificationAdditionalData.getString("imageDelivered"))
                                builder.setPriority(NotificationCompat.PRIORITY_HIGH)
                                builder.setWhen(
                                    notificationAdditionalData.getString("messageTime").toLong()
                                )
                                builder.setLargeIcon(
                                    getBitmapFromURL(notificationAdditionalData.getString("senderPhoto"))
                                )
                            } catch (e: JSONException) {
                                e.printStackTrace()
                                event.preventDefault()
                            }
                        } else if (notificationAdditionalData.has("messageDelivered")) {
                            try {
                                builder.setChannelId("messages")
                                builder.setSmallIcon(R.drawable.moon_icon)
                                builder.setStyle(
                                    NotificationCompat.BigTextStyle()
                                        .bigText(notificationAdditionalData.getString("messageDelivered"))
                                )
                                builder.setColor(BigInteger("FF566193", 16).toInt())
                                builder.setContentTitle(notificationAdditionalData.getString("senderName"))
                                builder.setContentText(
                                    "New message from " + notificationAdditionalData.getString("senderName")
                                )
                                builder.setPriority(NotificationCompat.PRIORITY_HIGH)
                                builder.setWhen(
                                    notificationAdditionalData.getString("messageTime").toLong()
                                )
                                builder.setLargeIcon(
                                    getBitmapFromURL(notificationAdditionalData.getString("senderPhoto"))
                                )
                            } catch (e: JSONException) {
                                e.printStackTrace()
                                event.preventDefault()
                            }
                        }
                        builder
                    }
                } else {
                    notification.setExtender { builder: NotificationCompat.Builder ->
                        builder.setChannelId("default")
                        builder.setSmallIcon(R.drawable.moon_icon)
                        builder.setColor(BigInteger("FF566193", 16).toInt())
                        builder.setContentTitle(notification.title)
                        builder.setContentText(notification.body)
                        builder
                    }
                }
            }
        } catch (e: JSONException) {
            e.printStackTrace()
            event.preventDefault()
        }
    }

    companion object {
        private const val TAG = "NotificationServiceExtension"
    }
}
