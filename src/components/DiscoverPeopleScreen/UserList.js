/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {Avatar, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {PurpleBackground} from '../../index.d';
import {uniqBy} from 'lodash';
import {fontValue} from '../../config/Dimensions';

const UserList = ({ListData}) => {
  const navigation = useNavigation();

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
      renderItem={({item}) => (
        <>
          {auth()?.currentUser?.uid !== item?.uid ? (
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
                  {item?.active_status === 'recently'
                    ? 'Last seen recently'
                    : moment(item?.active_time?.toDate())?.calendar()}
                </Text>
              </View>
            </Pressable>
          ) : null}
          <Divider leftInset />
        </>
      )}
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
