import Toast, {ToastPosition} from 'react-native-toast-message';
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
    bottomOffset: 40,
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
    bottomOffset: 40,
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
    bottomOffset: 40,
    visibilityTime: time,
    activeOpacity: 1,
  });
}

function CustomToast(
  type: string,
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
