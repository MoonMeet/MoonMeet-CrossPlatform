import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {FONTS, COLORS} from '../../config/Miscellaneous';

interface ViewItemCustomInterface {
  titleText?: string | undefined;
  titleColor?: string | undefined;
  enableDescription?: boolean | undefined;
  descriptionOpacity?: number | undefined;
  descriptionText?: string | undefined;
  descriptionColor?: string | undefined;
  rippleColor?: any;
  onPressTrigger?: (() => void) | undefined;
  onLongPressTrigger?: (() => void) | undefined;
}

const DataItemCustom = (props: ViewItemCustomInterface) => {
  return (
    <Pressable
      android_ripple={{color: props?.rippleColor}}
      onPress={[props?.onPressTrigger]}
      onLongPress={props?.onLongPressTrigger}
      style={styles.titleViewContainer}>
      <View style={styles.customViewContainer}>
        <Text style={styles.titleTextContainer(props?.titleColor)}>
          {props?.titleTextContainer}
        </Text>
        {props.enableDescription ? (
          <Text style={styles.descriptionContainer(props?.descriptionColor)}>
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
    paddingLeft: '6%',
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
  titleTextContainer: titleColor => {
    return {
      fontSize: 17,
      paddingLeft: '0.5%',
      paddingRight: '1%',
      textAlign: 'left',
      color: titleColor,
      fontFamily: FONTS.regular,
    };
  },
  descriptionContainer: (descriptionColor, descriptionOpacity) => {
    return {
      fontSize: 15,
      paddingLeft: '0.5%',
      paddingRight: '1%',
      textAlign: 'left',
      color: descriptionColor,
      fontFamily: FONTS.regular,
      opacity: descriptionOpacity !== undefined ? descriptionOpacity : 0.6,
    };
  },
});

export default DataItemCustom;
