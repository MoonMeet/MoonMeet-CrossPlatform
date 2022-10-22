/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import Toast, {ToastPosition, ToastType} from 'react-native-toast-message';
import {heightPercentageToDP} from '../../config/Dimensions';

const SuccessToast = (
  position: ToastPosition,
  text1: string,
  text2: string,
  autoHide: boolean,
  time: number,
) => {
  return Toast.show({
    type: 'success',
    position: position,
    text1: text1,
    text2: text2,
    autoHide: autoHide,
    topOffset: 30,
    bottomOffset: heightPercentageToDP(10),
    visibilityTime: time,
    activeOpacity: 1,
  });
};

function InfoToast(
  position: ToastPosition,
  text1: string,
  text2: string,
  autoHide: boolean,
  time: number,
) {
  return Toast.show({
    type: 'info',
    position: position,
    text1: text1,
    text2: text2,
    autoHide: autoHide,
    topOffset: heightPercentageToDP(7),
    bottomOffset: heightPercentageToDP(10),
    visibilityTime: time,
    activeOpacity: 1,
  });
}

function ErrorToast(
  position: ToastPosition,
  text1: string,
  text2: string,
  autoHide: boolean,
  time: number,
) {
  return Toast.show({
    type: 'error',
    position: position,
    text1: text1,
    text2: text2,
    autoHide: autoHide,
    topOffset: heightPercentageToDP(7),
    bottomOffset: heightPercentageToDP(10),
    visibilityTime: time,
    activeOpacity: 1,
  });
}

function CustomToast(
  type: ToastType,
  position: ToastPosition,
  text1: string,
  text2: string,
  autoHide: boolean,
  topOffset: number,
  bottomOffset: number,
  time: number,
) {
  return Toast.show({
    type: type,
    position: position,
    text1: text1,
    text2: text2,
    autoHide: autoHide,
    topOffset: topOffset,
    bottomOffset: bottomOffset,
    visibilityTime: time,
    activeOpacity: 1,
  });
}

export {SuccessToast, InfoToast, ErrorToast, CustomToast};
