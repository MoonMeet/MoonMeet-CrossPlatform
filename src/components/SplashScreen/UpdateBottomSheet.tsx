/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2024.
 */

import React, {Ref, useMemo} from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';
import {fontValue} from 'config/Dimensions.ts';
import {Button} from 'react-native-paper';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {SharedValue} from 'react-native-reanimated';
import {RocketImage} from '../../index.d';

interface UpdateBottomSheetProps {
  sheetRef: Ref<BottomSheetModalMethods> | undefined;
  sheetIndex: number | undefined;
  sheetSnapPoints:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | Readonly<(string | number)[] | SharedValue<(string | number)[]>>
    | undefined;
  onDownloadNowPress: (e: GestureResponderEvent) => void;
  onDoItLaterPress: (e: GestureResponderEvent) => void;
  required: boolean;
}

const UpdateBottomSheet = (props: UpdateBottomSheetProps) => {
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const sheetStyle = useMemo(
    () => ({
      padding: 0.5,
      shadowColor: COLORS.black,
    }),
    [],
  );

  return (
    <BottomSheetModal
      ref={props.sheetRef}
      index={props.sheetIndex}
      snapPoints={props.sheetSnapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={false}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        style={{
          backgroundColor: COLORS.primaryLight,
          flex: 1,
          margin: '1%',
        }}>
        <View style={styles.imageHolder}>
          <Image
            style={{
              height: 200,
              width: 200,
              overflow: 'hidden',
            }}
            source={RocketImage}
          />
        </View>
        <Text
          style={[
            styles.text,
            {
              alignSelf: 'center',
              fontSize: fontValue(22),
              color: COLORS.accentLight,
              paddingBottom: '1%',
            },
          ]}>
          New Update Released
        </Text>
        <Button
          style={{margin: '1.5%'}}
          uppercase={false}
          labelStyle={styles.labelStyle}
          textColor={COLORS.accentLight}
          mode="outlined"
          onPress={props.onDownloadNowPress}>
          Download now
        </Button>
        {!props.required && (
          <Button
            style={{margin: '1.5%'}}
            uppercase={false}
            labelStyle={styles.labelStyle}
            textColor={COLORS.accentLight}
            mode="outlined"
            onPress={props.onDoItLaterPress}>
            Do it later
          </Button>
        )}
        <Text
          style={
            (styles.text,
            {
              fontSize: fontValue(12),
              margin: '1.5%',
              color: COLORS.black,
              opacity: 0.6,
            })
          }>
          Note: Changelogs are available on Github releases or Play Store
        </Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  imageHolder: {
    alignItems: 'center',
  },
  text: {
    paddingLeft: '3%',
    paddingRight: '3%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  labelStyle: {
    fontSize: fontValue(18),
    fontFamily: FONTS.regular,
  },
});

export default UpdateBottomSheet;
