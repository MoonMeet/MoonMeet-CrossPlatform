import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

interface DataItemInterface {
  leftIcon: IconSource;
  leftIconColor: string;
  titleTextContainer: string;
  onPressTrigger: Function;
}

const DataItem = (props: DataItemInterface) => {
  return (
    <Pressable
      android_ripple={{color: COLORS.rippleColor}}
      onPress={props.onPressTrigger}
      style={styles.titleViewContainer}>
      <Avatar.Icon
        icon={props.leftIcon}
        size={36.5}
        color={COLORS.white}
        style={{
          overflow: 'hidden',
          marginRight: '-1%',
        }}
        theme={{
          colors: {
            primary: props.leftIconColor,
          },
        }}
      />
      <Text style={styles.titleTextContainer}>{props.titleTextContainer}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  titleViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '6%',
    paddingRight: '2%',
    paddingBottom: '2%',
    paddingTop: '2%',
  },
  titleTextContainer: {
    fontSize: 17,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(DataItem);
