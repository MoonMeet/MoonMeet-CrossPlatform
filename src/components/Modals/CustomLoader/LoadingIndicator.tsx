/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {LoadingAnimation} from 'index.d';

interface LoadingIndicatorInterface {
  isVisible: boolean;
}

const LoadingIndicator = (props: LoadingIndicatorInterface) => {
  return (
    <Modal
      style={{
        margin: '0%',
      }}
      hardwareAccelerated={true}
      transparent={true}
      animationType={'slide'}
      visible={props.isVisible}>
      <View style={styles.container}>
        <LottieView source={LoadingAnimation} autoPlay={true} loop={true} />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
});
export default LoadingIndicator;
