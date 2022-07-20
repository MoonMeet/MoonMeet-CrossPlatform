import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';

interface ViewItemInterface {
  titleText?: string | undefined;
  onPressTrigger?: (() => void) | undefined;
}

const ViewItem = (props: ViewItemInterface) => {
  return (
    <Pressable
      android_ripple={{color: COLORS.rippleColor}}
      onPress={props?.onPressTrigger}
      style={styles.titleViewContainer}>
      <Text style={styles.titleTextContainer}>{props?.titleText}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  titleViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '2%',
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

export default ViewItem;
