import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import LoaderLottie from '../../../assets/lotties/loader_150.json';

const LoadingIndicator = ({isVisible}) => {
  return (
    <Modal
      style={{
        margin: '0%',
      }}
      animationType={'slide'}
      transpaerent={true}
      visible={isVisible}>
      <View style={styles.container}>
        <LottieView
          autoPlay={true}
          cacheStrategy="strong"
          cacheComposition={true}
          renderMode="AUTOMATIC"
          resizeMode="center"
          hardwareAccelerationAndroid={true}
          loop={true}
          source={LoaderLottie}
        />
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
