import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

interface DataItemCustomInterface {
  rightIcon: IconSource;
  rightIconColor: string;
  titleTextContainer: string;
  rippleColor: string;
  imageSize: Number;
  iconColor: string;
  onPressTrigger: Function;
  titleColor: string;
  enableDescription: boolean;
  descriptionText: string;
  descriptionColor: string;
}

const DataItemCustom = (props: DataItemCustomInterface) => {
  return (
    <Pressable
      android_ripple={{color: props.rippleColor}}
      onPress={props.onPressTrigger}
      style={styles.titleViewContainer}>
      <Avatar.Icon
        icon={props.rightIcon}
        size={props.imageSize}
        color={props.iconColor}
        style={{
          overflow: 'hidden',
          marginRight: '-1%',
        }}
        theme={{
          colors: {
            primary: props.rightIconColor,
          },
        }}
      />
      <View style={styles.customViewContainer}>
        <Text style={styles.titleTextContainer(props.titleColor)}>
          {props.titleTextContainer}
        </Text>
        {props.enableDescription ? (
          <Text style={styles.descriptionContainer(props.descriptionColor)}>
            {props.descriptionText}
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
      paddingLeft: '1%',
      paddingRight: '1%',
      textAlign: 'left',
      color: titleColor,
      fontFamily: FONTS.regular,
    };
  },
  descriptionContainer: descriptionColor => {
    return {
      fontSize: 15,
      paddingLeft: '1%',
      paddingRight: '1%',
      textAlign: 'left',
      color: descriptionColor,
      fontFamily: FONTS.regular,
      opacity: descriptionColor !== COLORS.black ? 1 : 0.4,
    };
  },
});

export default React.memo(DataItemCustom);
