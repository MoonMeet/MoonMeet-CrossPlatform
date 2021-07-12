import React from "react"
import { ToastAndroid,  } from "react-native";
import { isAndroid } from "../DeviceInfo";

  export const showMessage = (message, short) => {
    if (isAndroid) {
      ToastAndroid.show(message, short ? ToastAndroid.SHORT : ToastAndroid.LONG);
    } else {
      // TODO: ToastIOS Implementation
    }
  }
