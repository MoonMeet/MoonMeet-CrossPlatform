import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/Dimensions';
import {FONTS} from '../../config/Miscellaneous';

interface ViewItemInterface {
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

const ViewItem = (props: ViewItemInterface) => {
  return (
    <>
      <Pressable
        android_ripple={{color: props?.rippleColor}}
        onPress={props?.onPressTrigger}
        onLongPress={props?.onLongPressTrigger}
        style={styles.titleViewContainer}>
        <View style={styles.customViewContainer}>
          <Text style={styles.titleTextContainer(props?.titleColor)}>
            {props?.titleText}
          </Text>

          {props?.enableDescription ? (
            <Text style={styles.descriptionContainer(props?.descriptionColor)}>
              {props?.descriptionText}
            </Text>
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
  titleTextContainer: titleColor => {
    return {
      fontSize: fontValue(16),
      paddingLeft: '0.5%',
      paddingRight: '1%',
      textAlign: 'left',
      color: titleColor,
      fontFamily: FONTS.regular,
    };
  },
  descriptionContainer: (descriptionColor, descriptionOpacity) => {
    return {
      fontSize: fontValue(15),
      paddingLeft: '0.5%',
      paddingRight: '1%',
      paddingTop: '0.5%',
      textAlign: 'left',
      color: descriptionColor,
      fontFamily: FONTS.regular,
      opacity: descriptionOpacity !== undefined ? descriptionOpacity : 0.6,
    };
  },
});

export default ViewItem;
