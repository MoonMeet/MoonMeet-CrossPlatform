import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {transformTimeDevices} from '../../utils/TimeHandler/TimeHandler';

interface UserListInterface {
  ListData: any;
  onPressTrigger: Function;
  onLongPressTrigger: Function;
}

const DevicesList = (props: UserListInterface) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={props.ListData}
        contentContainerStyle={{
          paddingStart: '1%',
          paddingEnd: '2%',
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
                {'Moon Meet' + ' ' + item.system_name + ' ' + item.app_version}
              </Text>
              <Text style={styles.subheading}>
                {item.manufacturer + ' ' + item.model}
              </Text>
            </View>
            <View style={styles.right_side}>
              <Text style={styles.subheading}>
                {transformTimeDevices(item.time)}
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
    padding: '2%',
    flexDirection: 'row',
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
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  subheading: {
    fontSize: 14,
    paddingTop: '1%',
    color: COLORS.black,
    opacity: 0.4,
  },
});

export default React.memo(DevicesList);
