/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {FONTS} from 'config/Miscellaneous.ts';

interface DataItemCustomInterface {
  leftIcon: IconSource;
  leftIconColor: string;
  titleTextContainer: string;
  rippleColor: string;
  imageSize: number;
  iconColor: string;
  onPressTrigger: ((event: GestureResponderEvent) => void) | null | undefined;
  onLongPressTrigger:
    | ((event: GestureResponderEvent) => void)
    | null
    | undefined;
  titleColor: string;
  enableDescription: boolean;
  descriptionOpacity: number | undefined;
  descriptionText: string | undefined;
  descriptionColor: string;
}

const DataItemCustom = (props: DataItemCustomInterface) => {
  const titleTextContainer: TextStyle = {
    fontSize: 17,
    paddingLeft: '0.5%',
    paddingRight: '1%',
    textAlign: 'left',
  };

  const descriptionContainer: TextStyle = {
    fontSize: 15,
    paddingLeft: '0.5%',
    paddingRight: '1%',
    textAlign: 'left',
    opacity:
      props.descriptionOpacity !== undefined ? props.descriptionOpacity : 0.6,
  };

  return (
    <Pressable
      android_ripple={{color: props?.rippleColor}}
      onPress={props?.onPressTrigger}
      onLongPress={props?.onLongPressTrigger}
      style={styles.titleViewContainer}>
      <Avatar.Icon
        icon={props?.leftIcon}
        size={props?.imageSize}
        color={props?.iconColor}
        style={{
          overflow: 'hidden',
          marginRight: '-1%',
        }}
        theme={{
          colors: {
            primary: props?.leftIconColor,
          },
        }}
      />
      <View style={styles.customViewContainer}>
        <Text
          style={[
            titleTextContainer,
            {color: props.titleColor, fontFamily: FONTS.regular},
          ]}>
          {props?.titleTextContainer}
        </Text>
        {props.enableDescription ? (
          <Text
            style={[
              descriptionContainer,
              {color: props.descriptionColor, fontFamily: FONTS.regular},
            ]}>
            {props?.descriptionText}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  titleViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '4%',
    paddingRight: '2%',
    paddingBottom: '2%',
    paddingTop: '2%',
  },
  customViewContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: '3%',
    paddingRight: '2%',
  },
});

export default DataItemCustom;
