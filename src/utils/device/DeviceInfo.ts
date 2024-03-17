/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {Dimensions, Platform} from 'react-native';
// Screen Constants
const Screen = Dimensions.get('window');
const ScreenWidth: number = Screen.width;
const ScreenHeight: number = Screen.height;
const ScreenScale: number = Screen.scale;
const ScreenFontScale: number = Screen.fontScale;
// Window Constants
const Window = Dimensions.get('window');
const WindowWidth: number = Window.width;
const WindowHeight: number = Window.height;
const WindowFontScale: number = Window.fontScale;
const WindowScale: number = Window.scale;

const isIOS: boolean = Platform.OS === 'ios';
const isAndroid: boolean = Platform.OS === 'android';
const isWeb: boolean = Platform.OS === 'web';
const isWindows: boolean = Platform.OS === 'windows';
const PlatformVersion = Platform.Version;

export {
  isIOS,
  isAndroid,
  isWeb,
  isWindows,
  ScreenWidth,
  ScreenHeight,
  ScreenScale,
  ScreenFontScale,
  WindowWidth,
  WindowHeight,
  WindowScale,
  WindowFontScale,
  PlatformVersion,
};
