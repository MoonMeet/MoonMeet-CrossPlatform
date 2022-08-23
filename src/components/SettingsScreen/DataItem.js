/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {fontValue} from '../../config/Dimensions';
import {ThemeContext} from '../../config/Theme/Context';

interface DataItemInterface {
  leftIcon: IconSource;
  leftIconColor: string;
  titleTextContainer: string;
  onPressTrigger: (() => void) | undefined;
}

const DataItem = (props: DataItemInterface) => {
  const theme = useTheme();
  const {isThemeDark} = React.useContext(ThemeContext);
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
    titleTextContainer: {
      fontSize: fontValue(17),
      paddingLeft: '3%',
      paddingRight: '3%',
      textAlign: 'center',
      color: isThemeDark ? COLORS.white : COLORS.black,
      fontFamily: FONTS.regular,
    },
  });

  return (
    <Pressable
      android_ripple={{color: COLORS.rippleColor}}
      onPress={props?.onPressTrigger}
      style={styles.titleViewContainer}>
      <Avatar.Icon
        icon={props?.leftIcon}
        size={36.5}
        color={COLORS.white}
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
      <Text style={styles.titleTextContainer}>{props?.titleTextContainer}</Text>
    </Pressable>
  );
};

export default DataItem;
