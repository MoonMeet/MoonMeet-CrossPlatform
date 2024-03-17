/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {Pressable, StyleSheet, Text, TextStyle, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'config/Dimensions.ts';
import {FONTS} from 'config/Miscellaneous.ts';

interface ViewItemInterface {
  titleText?: string;
  titleColor?: string;
  enableDescription?: boolean;
  descriptionOpacity?: number;
  descriptionText?: string;
  withDivider?: boolean;
  descriptionColor?: string;
  rippleColor?: string;
  onPressTrigger?: () => void;
  onLongPressTrigger?: () => void;
}

const ViewItem = (props: ViewItemInterface) => {
  const titleTextContainer: TextStyle = {
    fontSize: fontValue(16),
    paddingLeft: '0.5%',
    paddingRight: '1%',
    textAlign: 'left',
    color: props.titleColor,
    fontFamily: FONTS.regular,
  };

  const descriptionContainer: TextStyle = {
    fontSize: fontValue(15),
    paddingLeft: '0.5%',
    paddingRight: '1%',
    paddingTop: '0.5%',
    textAlign: 'left',
    color: props.descriptionColor,
    fontFamily: FONTS.regular,
    opacity:
      props.descriptionOpacity !== undefined ? props.descriptionOpacity : 0.6,
  };
  return (
    <>
      <Pressable
        android_ripple={{color: props?.rippleColor}}
        onPress={props?.onPressTrigger}
        onLongPress={props?.onLongPressTrigger}
        style={titleTextContainer}>
        <View style={styles.customViewContainer}>
          <Text style={descriptionContainer}>{props?.titleText}</Text>
          {props?.enableDescription ? (
            <Text style={descriptionContainer}>{props?.descriptionText}</Text>
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
    paddingLeft: widthPercentageToDP(1.75),
    paddingRight: '2%',
    paddingBottom: heightPercentageToDP(1.5),
    paddingTop: heightPercentageToDP(1.5),
  },
  customViewContainer: {
    flexDirection: 'column',
    paddingLeft: '3%',
    paddingRight: '2%',
  },
});

export default ViewItem;
