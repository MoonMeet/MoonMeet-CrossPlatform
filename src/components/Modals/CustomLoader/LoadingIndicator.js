import React from 'react';
import {StyleSheet, View, PlatformColor} from 'react-native';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import LoaderLottie from '../../../assets/lotties/loader_150.json';

interface LoadingIndicatorInterface {
  isVisible: boolean;
}

const LoadingIndicator = (props: LoadingIndicatorInterface) => {
  return (
    <Modal
      style={{
        margin: '0%',
      }}
      animationType={'slide'}
      transpaerent={true}
      visible={props?.isVisible}>
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
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  loaderText: {
    fontSize: 22,
    padding: '2%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
    opacity: 0.6,
  },
});
export default React.memo(LoadingIndicator);
