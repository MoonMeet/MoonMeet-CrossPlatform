/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';

import moment from 'moment';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'config/Dimensions.ts';
import {Divider} from 'react-native-paper';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface DeviceListInterface {
  ListData: FirebaseFirestoreTypes.DocumentData[];
  onPressTrigger: (e: GestureResponderEvent) => void;
  onLongPressTrigger: (e: GestureResponderEvent) => void;
}

const DevicesList = (props: DeviceListInterface) => {
  const subheadingStyle = (isTime: boolean): StyleProp<TextStyle> => ({
    fontSize: isTime ? fontValue(12) : fontValue(13),
    paddingTop: '1%',
    color: COLORS.black,
    opacity: 0.4,
  });

  type ItemType = {
    system_name?: string;
    app_version?: string;
    manufacturer?: string;
    model?: string;
    time?: {toDate(): Date};
  };

  const renderItem = ({item}: {item: ItemType}) => {
    const textSubheadingStyle = subheadingStyle(false);
    const textSubheadingTimeStyle = subheadingStyle(true);
    return (
      <>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          onPress={props.onPressTrigger}
          onLongPress={props.onLongPressTrigger}
          style={styles.container}>
          <View style={styles.left_side}>
            <Text style={styles.heading}>
              {'Moon Meet' + ' ' + item?.system_name + ' ' + item?.app_version}
            </Text>
            <Text style={textSubheadingStyle}>
              {item?.manufacturer + ' ' + item?.model}
            </Text>
          </View>
          <View style={styles.right_side}>
            <Text style={textSubheadingTimeStyle}>
              {moment(item?.time?.toDate())?.calendar()}
            </Text>
          </View>
        </Pressable>
        <Divider />
      </>
    );
  };

  return (
    <FlatList
      data={props.ListData}
      contentContainerStyle={{
        paddingStart: widthPercentageToDP(1.75),
        paddingEnd: widthPercentageToDP(1.75),
      }}
      showsVerticalScrollIndicator={false}
      disableVirtualization
      removeClippedSubviews={true}
      initialNumToRender={10}
      keyExtractor={(item: ItemType, index: number) =>
        item?.time ? item?.time?.toString() : index.toString()
      }
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: heightPercentageToDP(1.25),
    paddingBottom: heightPercentageToDP(1.25),
    paddingLeft: widthPercentageToDP(1.25),
    paddingRight: widthPercentageToDP(1.25),
  },
  topView: {
    flexDirection: 'row',
  },
  left_side: {
    flexDirection: 'column',
    flex: 1,
  },
  right_side: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: fontValue(16),
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

export default DevicesList;
