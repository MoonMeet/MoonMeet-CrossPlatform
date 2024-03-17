/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'config/Dimensions.ts';
import {FONTS} from 'config/Miscellaneous.ts';

interface ViewItemCustomInterface {
  titleText?: string | undefined;
  titleColor?: string | undefined;
  enableDescription?: boolean | undefined;
  descriptionOpacity?: number | undefined;
  descriptionText?: string | undefined;
  withDivider: boolean | undefined;
  descriptionColor?: string | undefined;
  rippleColor?: string | undefined;
  onPressTrigger?: (() => void) | undefined;
  onLongPressTrigger?: (() => void) | undefined;
}

const ViewItemCustom = (props: ViewItemCustomInterface) => {
  const titleText = StyleSheet.create({
    style: {
      fontSize: fontValue(16),
      paddingLeft: '0.5%',
      paddingRight: '1%',
      textAlign: 'left',
      color: props.titleColor,
      fontFamily: FONTS.regular,
    },
  });
  const descriptionText = StyleSheet.create({
    style: {
      fontSize: fontValue(16),
      paddingLeft: '0.5%',
      paddingRight: '1%',
      textAlign: 'left',
      color: props.descriptionColor,
      fontFamily: FONTS.regular,
      opacity:
        props.descriptionOpacity !== undefined ? props.descriptionOpacity : 0.6,
    },
  });

  return (
    <>
      <Pressable
        android_ripple={{color: props?.rippleColor}}
        onPress={props?.onPressTrigger}
        onLongPress={props?.onLongPressTrigger}
        style={styles.titleViewContainer}>
        <View style={styles.customViewContainer}>
          <Text style={titleText.style}>{props?.titleText}</Text>

          {props?.enableDescription ? (
            <Text style={descriptionText.style}>{props?.descriptionText}</Text>
          ) : (
            <></>
          )}
        </View>
      </Pressable>
      {props.withDivider ? <Divider /> : <></>}
    </>
  );
};

const styles = StyleSheet.create({
  titleViewContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: widthPercentageToDP(1.75),
    paddingRight: '2%',
    paddingBottom: heightPercentageToDP(1.5),
    paddingTop: heightPercentageToDP(1.5),
  },
  customViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '3%',
    paddingRight: '2%',
  },
});

export default ViewItemCustom;
