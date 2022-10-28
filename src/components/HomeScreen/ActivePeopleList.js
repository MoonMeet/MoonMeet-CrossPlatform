/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {Avatar, Divider} from 'react-native-paper';
import moment from 'moment';
import {uniqBy} from 'lodash';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {fontValue} from '../../config/Dimensions';

const ActivePeopleList = ({ListData}) => {
  const navigation = useNavigation();

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading('center', false)}>No one active, yet.</Text>
        <Text style={styles.subheading('center', false, true)}>
          there's no one active at the moment.
        </Text>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          style={styles.container}
          onPress={() => {
            if (item?.uid !== auth()?.currentUser?.uid) {
              navigation.navigate('userProfile', {
                uid: item?.uid,
                cameFrom: 'others',
              });
            }
          }}
          onLongPress={() => {
            if (item?.uid !== auth()?.currentUser?.uid) {
              navigation?.navigate('chat', {item: item?.uid});
            }
          }}>
          <View style={styles.left_side}>
            <Avatar.Image
              source={item?.avatar ? {uri: item?.avatar} : null}
              size={52.5}
            />
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.heading('left', true)}>
              {item?.first_name + ' ' + item?.last_name}
            </Text>
            <Text style={styles.subheading('left', true, true)}>
              {moment(item?.active_time?.toDate())?.calendar()}
            </Text>
          </View>
        </Pressable>
        <Divider leftInset />
      </>
    );
  };

  return (
    <FlatList
      data={uniqBy(ListData, 'uid')}
      contentContainerStyle={{
        paddingStart: '1%',
        paddingEnd: '1%',
      }}
      showsVerticalScrollIndicator={false}
      disableVirtualization
      removeClippedSubviews={true}
      initialNumToRender={25}
      ListEmptyComponent={listEmptyComponent}
      keyExtractor={item => item?.avatar}
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
  heading: (align, isRead) => {
    return {
      fontSize: fontValue(16),
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  },
  subheading: (align, isMessage, isRead) => {
    return {
      fontSize: isMessage ? fontValue(14) : fontValue(11.5),
      paddingTop: '1%',
      textAlign: align,
      color: COLORS.black,
      opacity: isRead ? 0.6 : 1,
      fontFamily: FONTS.regular,
    };
  },
  emptyView: {
    marginTop: 16 - 0.1 * 16,
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default ActivePeopleList;
