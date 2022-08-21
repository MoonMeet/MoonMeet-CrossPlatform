/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {StyleSheet} from 'react-native';
import {fontValue} from '../../config/Dimensions';
import {COLORS, FONTS} from '../../config/Miscellaneous';

export const IntroStyles = StyleSheet.create({
  PagerRender: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: '2%',
  },
  illustration: {
    height: 300 - 0.1 * 300,
    width: 300 - 0.1 * 300,
    bottom: '12.5%',
    position: 'relative',
  },
  introduction_top_text: {
    textAlign: 'center',
    fontSize: fontValue(20),
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  introduction_bottom_text: {
    textAlign: 'center',
    fontSize: fontValue(16),
    top: '2.5%',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  introduction_button: {
    position: 'absolute',
    bottom: '2%',
    fontFamily: FONTS.regular,
  },
});
