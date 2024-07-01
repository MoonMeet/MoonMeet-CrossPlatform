/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';
import {Avatar, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {PurpleBackground} from '../../index.d';
import {uniqBy} from 'lodash';
import {fontValue} from 'config/Dimensions.ts';
import {StorageInstance} from 'config/MMKV/StorageInstance';
import firestore from '@react-native-firebase/firestore';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface UserListProps {
  ListData: Item[];
}

interface Item {
  uid?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  active_status?: string;
  active_time?: Date;
}

const UserList = (props: UserListProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const storedData = StorageInstance?.getString('Me') || '{}';
  const [Me] = React.useState(JSON.parse(storedData));

  const renderItem = ({item}: {item: Item}) => {
    if (item && item?.active_time && item?.uid !== auth()?.currentUser?.uid) {
      return (
        <>
          <Pressable
            android_ripple={{color: COLORS.rippleColor}}
            style={styles.container}
            onPress={() => {
              navigation?.navigate('chat', {item: item?.uid});
            }}
            onLongPress={() => {
              navigation?.navigate('userProfile', {
                userProfile: {
                  uid: item?.uid,
                  cameFrom: 'others',
                },
              });
            }}>
            <View style={styles.left_side}>
              <Avatar.Image
                source={item?.avatar ? {uri: item?.avatar} : PurpleBackground}
                style={{overflow: 'hidden'}}
                size={55}
              />
            </View>
            <View style={styles.mid_side}>
              <Text style={styles.heading}>
                {item?.first_name + ' ' + item?.last_name}
              </Text>
              <Text style={styles.subheading}>
                {Me?.active_status === 'recently'
                  ? 'last seen recently'
                  : Me?.active_status === 'normal' &&
                    item?.active_status === 'recently'
                  ? 'last seen recently'
                  : Me?.active_status === 'normal' &&
                    item?.active_status === 'normal'
                  ? firestore?.Timestamp?.fromDate(new Date())
                      ?.toDate()
                      .getTime() -
                      item?.active_time?.seconds * 1000 >
                    86400000
                    ? `last seen on ${moment(
                        item?.active_time?.seconds * 1000,
                      )?.format('YYYY MMMM DD')}`
                    : `last seen on ${moment(
                        item?.active_time?.seconds * 1000,
                      )?.format('HH:MM A')}`
                  : 'long time ago'}
              </Text>
            </View>
          </Pressable>
          <Divider leftInset />
        </>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={uniqBy(props.ListData, 'uid') as Item[]}
      contentContainerStyle={{
        paddingStart: '0.5%',
        paddingEnd: '0.5%',
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={25}
      keyExtractor={item => (item as any)?.uid}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '2%',
    flexDirection: 'row',
  },
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mid_side: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  heading: {
    fontSize: fontValue(16),
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  subheading: {
    fontSize: fontValue(14),
    paddingTop: '1%',
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});

export default UserList;
