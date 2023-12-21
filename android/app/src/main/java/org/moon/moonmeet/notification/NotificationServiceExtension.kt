/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */
package org.moon.moonmeet.notification

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.core.app.NotificationCompat
import com.onesignal.OSMutableNotification
import com.onesignal.OSNotification
import com.onesignal.OSNotificationReceivedEvent
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;
import org.json.JSONException
import org.json.JSONObject
import org.moon.moonmeet.R
import java.io.IOException
import java.math.BigInteger
import java.net.HttpURLConnection
import java.net.URL

@Suppress("unused")
class NotificationServiceExtension : OSRemoteNotificationReceivedHandler {
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

    override fun remoteNotificationReceived(
        context: Context?,
        notificationReceivedEvent: OSNotificationReceivedEvent
    ) {
        val osNotification: OSNotification = notificationReceivedEvent.notification
        val notificationAdditionalData: JSONObject = osNotification.additionalData
        Log.i(TAG, notificationAdditionalData.toString())
        val mutableNotification: OSMutableNotification = osNotification.mutableCopy()
        try {
            if (notificationAdditionalData.getString("type") == "chat") {
                mutableNotification.setExtender { builder : NotificationCompat.Builder ->
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
                                getBitmapFromURL(
                                    notificationAdditionalData.getString(
                                        "senderPhoto"
                                    )
                                )
                            )
                        } catch (e: JSONException) {
                            e.printStackTrace()
                            notificationReceivedEvent.complete(null)
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
                                "New message from " + notificationAdditionalData.getString(
                                    "senderName"
                                )
                            )
                            builder.setPriority(NotificationCompat.PRIORITY_HIGH)
                            builder.setWhen(
                                notificationAdditionalData.getString("messageTime").toLong()
                            )
                            builder.setLargeIcon(
                                getBitmapFromURL(
                                    notificationAdditionalData.getString(
                                        "senderPhoto"
                                    )
                                )
                            )
                        } catch (e: JSONException) {
                            e.printStackTrace()
                            notificationReceivedEvent.complete(null)
                        }
                    }
                    Log.i(TAG, "returning a builder from notification chat type.")
                    builder
                }
            } else {
                mutableNotification.setExtender { builder : NotificationCompat.Builder->
                    builder.setChannelId("default")
                    builder.setSmallIcon(R.drawable.moon_icon)
                    builder.setColor(BigInteger("FF566193", 16).toInt())
                    builder.setContentTitle(osNotification.title)
                    builder.setContentText(osNotification.body)
                    builder
                }
            }
            notificationReceivedEvent.complete(mutableNotification)
        } catch (e: JSONException) {
            e.printStackTrace()
            notificationReceivedEvent.complete(null)
        }
    }

    companion object {
        private const val TAG = "NotificationServiceExtension"
    }
}