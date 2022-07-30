import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../config/Miscellaneous';

import moment from 'moment';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/Dimensions';

const DevicesList = ({ListData}) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={ListData}
        contentContainerStyle={{
          paddingStart: widthPercentageToDP(1.75),
          paddingEnd: widthPercentageToDP(1.75),
        }}
        showsVerticalScrollIndicator={false}
        disableVirtualization
        removeClippedSubviews={true}
        initialNumToRender={10}
        keyExtractor={item => item.time}
        renderItem={({item}) => (
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            style={styles.container}>
            <View style={styles.left_side}>
              <Text style={styles.heading}>
                {'Moon Meet' +
                  ' ' +
                  item?.system_name +
                  ' ' +
                  item?.app_version}
              </Text>
              <Text style={styles.subheading(false)}>
                {item?.manufacturer + ' ' + item?.model}
              </Text>
            </View>
            <View style={styles.right_side}>
              <Text style={styles.subheading(true)}>
                {moment(item?.time.toDate())?.calendar()}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
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
  subheading: isTime => {
    return {
      fontSize: isTime ? fontValue(12) : fontValue(13),
      paddingTop: '1%',
      color: COLORS.black,
      opacity: 0.4,
    };
  },
});

export default DevicesList;
