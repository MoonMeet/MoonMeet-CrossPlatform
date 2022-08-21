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

const Spacer = ({height}) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: isUndefined(height) ? 10 : height,
      width: '100%',
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default Spacer;
