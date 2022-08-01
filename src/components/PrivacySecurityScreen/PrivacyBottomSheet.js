import React, {useMemo} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {Text} from 'react-native-paper';
import {fontValue} from '../../config/Dimensions';

const PrivacyBottomSheet = ({sheetRef, sheetIndex, sheetSnapPoints}) => {
  const {animatedHandleHeight, handleContentLayout} =
    useBottomSheetDynamicSnapPoints(sheetSnapPoints);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      padding: '0.5%',
      shadowColor: COLORS.black,
    }),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={sheetIndex}
      snapPoints={sheetSnapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={true}
      handleHeight={animatedHandleHeight}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{
          backgroundColor: COLORS.primaryLight,
          margin: '1%',
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: fontValue(18),
          fontFamily: FONTS.regular,
          color: COLORS.accentLight,
        }}>
        Phone Privacy
      </Text>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  text: {
    paddingLeft: '3%',
    paddingRight: '3%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

export default PrivacyBottomSheet;
