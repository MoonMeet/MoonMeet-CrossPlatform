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

/**
 * Calculates the font value in pixels based on the given font size and standard screen height.
 *
 * @param {number} fontSize - The font size in points.
 * @param {number=} standardScreenHeight - The standard screen height in pixels. If not provided, the default screen height will be used.
 * @returns {number} - The calculated font value in pixels.
 */
export const fontValue = (
  fontSize: number,
  standardScreenHeight: number = screenHeight,
): number => {
  const heightPercent = (fontSize * screenHeight) / standardScreenHeight;
  return PixelRatio.roundToNearestPixel(heightPercent);
};

/**
 * Converts a width percentage to the corresponding device pixels.
 *
 * @param {number} widthPercent - The width percentage to convert.
 * @returns {number} - The corresponding device pixels.
 */
export const widthPercentageToDP = (widthPercent: number): number => {
  // Convert string input to decimal number
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

/**
 * Converts a height percentage to device pixels.
 *
 * @param {number} heightPercent - The height percentage to convert.
 * @returns {number} The equivalent height value in device pixels.
 */
export const heightPercentageToDP = (heightPercent: number): number => {
  // Convert string input to decimal number
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

export const vw = screenWidth / 100;
export const vh = screenHeight / 100;
