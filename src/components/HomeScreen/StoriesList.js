import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {FlatGrid} from 'react-native-super-grid';
import {COLORS} from '../../config/Miscellaneous';
import {Avatar, Surface} from 'react-native-paper';
import {transformTime} from '../../utils/TimeHandler/TimeHandler';

const StoriesList = ({ListData}) => {
  return (
    <FlatGrid
      itemDimension={225}
      data={ListData}
      style={styles.gridView}
      staticDimension={Dimensions.get('window').width}
      spacing={10}
      renderItem={({item}) => (
        <Pressable
          android_ripple={{color: COLORS.accentLight}}
          style={styles.imageWrapper}>
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            style={styles.container}>
            <View style={styles.left_side}>
              <Avatar.Image
                source={item.avatar ? {uri: item.avatar} : null}
                size={55}
              />
            </View>
            <View style={styles.mid_side}>
              <Text style={styles.heading}>
                {item.first_name + ' ' + item.last_name}
              </Text>
              <Text style={styles.subheading}>
                {item.active_status === 'recently'
                  ? 'Last seen recently'
                  : transformTime(item.active_time)}
              </Text>
            </View>
          </Pressable>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({});

export default React.memo(StoriesList);
