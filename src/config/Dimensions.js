/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {Dimensions, PixelRatio} from 'react-native';
export const screenHeight: number = Dimensions.get('window').height;
export const screenWidth: number = Dimensions.get('window').width;

export const fontValue = (
  fontSize: number,
  standardScreenHeight: number = screenHeight,
): number => {
  const heightPercent = (fontSize * screenHeight) / standardScreenHeight;
  return PixelRatio.roundToNearestPixel(heightPercent);
};
export const widthPercentageToDP = (widthPercent: number): number => {
  // Convert string input to decimal number
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

export const heightPercentageToDP = (heightPercent: number): number => {
  // Convert string input to decimal number
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

export const vw = screenWidth / 100;
export const vh = screenHeight / 100;
