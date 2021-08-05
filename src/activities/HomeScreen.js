import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../config/Miscellaneous';
import {getAvatarURL} from '../utils/database/Authentication';
import {Avatar} from 'react-native-paper';
import BaseView from '../components/BaseView/BaseView';

const HomeScreen = () => {
  return (
    <BaseView>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Avatar.Image
            style={styles.avatarImage}
            color={COLORS.rippleColor}
            source={{
              uri: getAvatarURL(),
            }}
          />
        </View>
      </View>
    </BaseView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  toolbar: {
    flexDirection: 'row',
  },
  avatarImage: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.rippleColor,
  },
});
export default HomeScreen;
