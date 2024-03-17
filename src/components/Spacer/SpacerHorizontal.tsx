/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {isUndefined} from 'lodash';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'config/Dimensions.ts';

interface SpacerHorizontalInterface {
  width: number;
}

const SpacerHorizontal = (props: SpacerHorizontalInterface) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: heightPercentageToDP(1),
      width: isUndefined(props.width) ? 10 : widthPercentageToDP(props.width),
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default SpacerHorizontal;
