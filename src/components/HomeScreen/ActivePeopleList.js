import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {Avatar} from 'react-native-paper';
import moment from 'moment';
import {uniqBy} from 'lodash';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ActivePeopleList = ({ListData}) => {
  const navigation = useNavigation();

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading}>No one active, yet.</Text>
        <Text style={styles.subheading}>
          there's no one active at the moment.
        </Text>
      </View>
    );
  };

  const renderItem = item => {
    return (
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
          <Text style={styles.heading}>
            {item?.first_name + ' ' + item?.last_name}
          </Text>
          <Text style={styles.subheading}>
            {moment(item?.active_time?.toDate())?.calendar()}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={uniqBy(ListData, 'uid')}
      contentContainerStyle={{
        paddingStart: '1%',
        paddingEnd: '2%',
      }}
      showsVerticalScrollIndicator={false}
      disableVirtualization
      removeClippedSubviews={true}
      initialNumToRender={25}
      ListEmptyComponent={listEmptyComponent}
      keyExtractor={item => item?.avatar}
      renderItem={({item}) => renderItem(item)}
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
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  subheading: {
    fontSize: 14,
    paddingTop: '1%',
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  emptyView: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default ActivePeopleList;
