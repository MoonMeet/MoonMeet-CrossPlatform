/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useEffect} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {Avatar, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {PurpleBackground} from '../../index.d';
import {uniqBy} from 'lodash';
import {fontValue} from '../../config/Dimensions';
import {UserDataMMKV} from '../../config/MMKV/UserDataMMKV';
import firestore from '@react-native-firebase/firestore';

const UserList = ({ListData}) => {
  const navigation = useNavigation();

  const [Me, setMe] = React.useState([]);

  useEffect(() => {
    try {
      setMe(JSON?.parse(UserDataMMKV?.getString('Me')));
    } catch (error) {
      setMe([]);
    }
  }, []);

  const renderItem = ({item}) => {
    if (item?.uid !== auth()?.currentUser?.uid) {
      console.log(item?.active_status + item?.active_time);
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
                uid: item?.uid,
                cameFrom: 'others',
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
                  ? firestore?.Timestamp?.fromDate(new Date())?.toDate() -
                      item?.active_time?.toDate() >
                    86400000
                    ? `last seen on ${moment(
                        item?.active_time?.toDate(),
                      )?.format('YYYY MMMM DD')}`
                    : `last seen on ${moment(
                        item?.active_time?.toDate(),
                      )?.format('HH:MM A')}`
                  : 'long time ago'}
              </Text>
            </View>
          </Pressable>
          <Divider leftInset />
        </>
      );
    }
  };

  return (
    <FlatList
      data={uniqBy(ListData, 'uid')}
      contentContainerStyle={{
        paddingStart: '0.5%',
        paddingEnd: '0.5%',
      }}
      showsVerticalScrollIndicator={false}
      disableVirtualization
      removeClippedSubviews={true}
      initialNumToRender={25}
      keyExtractor={item => item?.uid}
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
