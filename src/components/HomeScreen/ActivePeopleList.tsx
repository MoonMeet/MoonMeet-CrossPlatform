/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2024.
 */

import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from 'config/Miscellaneous';
import {Avatar, Divider} from 'react-native-paper';
import moment from 'moment';
import {uniqBy} from 'lodash';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {StorageInstance} from 'config/MMKV/StorageInstance';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';
import {fontValue, heightPercentageToDP} from 'config/Dimensions.ts';
import {PurpleBackground} from 'index';

interface ActivePeopleProps {
  ListData: any;
}

interface ItemProps {
  avatar?: string;
  uid?: string;
  first_name?: string;
  last_name?: string;
  active_time?: any;
}

const ActivePeopleList = (props: ActivePeopleProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const storedData = StorageInstance?.getString('Me') || '{}';
  const [Me] = React.useState(JSON.parse(storedData));

  const headingStyles = (align: string, isRead: boolean) => ({
    fontSize: fontValue(16),
    textAlign: align as 'auto' | 'left' | 'right' | 'center' | 'justify',
    color: COLORS.black,
    opacity: isRead ? 0.6 : 1,
    fontFamily: FONTS.regular,
  });

  const subheadingStyles = (
    align: string,
    isMessage: boolean,
    isRead: boolean,
  ) => ({
    fontSize: isMessage ? fontValue(14) : fontValue(11.5),
    paddingTop: heightPercentageToDP(1),
    textAlign: align as 'auto' | 'left' | 'right' | 'center' | 'justify',
    color: COLORS.black,
    opacity: isRead ? 0.6 : 1,
    fontFamily: FONTS.regular,
  });
  const listEmptyComponent = (lastSeenHidden: boolean) => {
    return (
      <View style={styles.emptyView}>
        <Text style={headingStyles('center', false)}>
          {lastSeenHidden
            ? "You can't see who's active."
            : 'No one active, yet.'}
        </Text>
        <Text style={subheadingStyles('center', false, true)}>
          {lastSeenHidden
            ? "turn on your active status to see who's active"
            : "there's no one active at the moment."}
        </Text>
      </View>
    );
  };

  const renderItem = ({item}: {item: ItemProps}) => {
    if (Me?.active_time === 'Last seen recently') {
      return listEmptyComponent(true);
    }
    return (
      <>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          style={styles.container}
          onPress={() => {
            if (item?.uid !== auth()?.currentUser?.uid) {
              navigation.navigate('userProfile', {
                userProfile: {
                  uid: item?.uid,
                  cameFrom: 'others',
                },
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
              source={item?.avatar ? {uri: item?.avatar} : PurpleBackground}
              size={52.5}
            />
          </View>
          <View style={styles.mid_side}>
            <Text style={headingStyles('left', true)}>
              {item?.first_name + ' ' + item?.last_name}
            </Text>
            <Text style={subheadingStyles('left', true, true)}>
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
      data={uniqBy(props.ListData, 'uid') as ItemProps[]}
      contentContainerStyle={{
        paddingStart: '1%',
        paddingEnd: '1%',
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={25}
      ListEmptyComponent={listEmptyComponent}
      keyExtractor={(item: ItemProps, index: number) =>
        item?.avatar || String(index)
      }
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
  emptyView: {
    marginTop: 16 - 0.1 * 16,
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default ActivePeopleList;
