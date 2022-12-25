/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ActivePeopleList from '../components/HomeScreen/ActivePeopleList';
import {fontValue} from '../config/Dimensions';
import {PurpleBackground} from '../index.d';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserDataMMKV} from '../config/MMKV/UserDataMMKV';
import {remove} from 'lodash';

const HomePeopleScreen = () => {
  const navigation = useNavigation();

  const [Loading, setLoading] = React.useState(true);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [masterData, setMasterData] = React.useState([]);

  const [Me] = React.useState(JSON.parse(UserDataMMKV?.getString('Me')));

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    const userSusbcribe = firestore()
      .collection('users')
      .onSnapshot(collectionSnapshot => {
        let activeSnapshot = [];
        collectionSnapshot?.forEach(documentSnapshot => {
          if (documentSnapshot?.id === auth()?.currentUser?.uid) {
            if (
              documentSnapshot?.data()?.avatar &&
              documentSnapshot?.data()?.jwtKey &&
              documentSnapshot?.data()?.active_status &&
              documentSnapshot?.data()?.active_time
            ) {
              setAvatarURL(documentSnapshot?.data()?.avatar);
              UserDataMMKV.set('Me', JSON?.stringify(documentSnapshot?.data()));
            }
          }
          if (
            Me?.active_status === 'normal' &&
            (documentSnapshot?.data()?.active_time === 'Last seen recently') ===
              false &&
            firestore?.Timestamp?.fromDate(new Date())?.toDate() -
              documentSnapshot?.data()?.active_time?.toDate() <
              180000
          ) {
            if (
              documentSnapshot?.data()?.avatar &&
              documentSnapshot?.data()?.first_name &&
              documentSnapshot?.data()?.last_name &&
              documentSnapshot?.data()?.active_status &&
              documentSnapshot?.data()?.active_time
            ) {
              activeSnapshot.push({
                ...documentSnapshot?.data(),
              });
            }
          } else {
            remove(activeSnapshot, documentSnapshot.data());
          }
          setLoading(false);
        });
        setMasterData(activeSnapshot);
      });
    const activeStatusSubscribe = firestore()
      .collection('users')
      ?.doc(auth()?.currentUser?.uid)
      .get()
      ?.then(documentSnapshot => {
        documentSnapshot?.ref?.update({
          active_status:
            documentSnapshot?.data()?.active_status === 'normal'
              ? 'normal'
              : 'recently',
          active_time:
            documentSnapshot?.data()?.active_time === 'Last seen recently'
              ? 'Last seen recently'
              : firestore?.Timestamp?.fromDate(new Date()),
        });
      });
    return () => {
      userSusbcribe();
    };
  }, [Me?.active_status]);

  if (Loading) {
    return (
      <MiniBaseView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            animating={true}
            size={'large'}
            color={COLORS.accentLight}
          />
        </View>
      </MiniBaseView>
    );
  } else {
    return (
      <MiniBaseView>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            <Pressable
              hitSlop={15}
              onPress={() => {
                navigation.navigate('settings');
              }}>
              <Avatar.Image
                size={35.5}
                source={
                  auth()?.currentUser?.photoURL
                    ? {uri: auth()?.currentUser?.photoURL}
                    : avatarURL
                    ? {uri: avatarURL}
                    : PurpleBackground
                }
                style={{
                  overflow: 'hidden',
                  marginRight: '-1%',
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            </Pressable>
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.top_text}>People</Text>
          </View>
          <View style={styles.right_side}>
            <Pressable
              onPress={() => {
                navigation?.navigate('discover');
              }}
              style={{
                backgroundColor: COLORS.rippleColor,
                borderRadius: 360,
                padding: '2%',
                overflow: 'hidden',
              }}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color={COLORS.black}
                style={{opacity: 0.6, padding: '2%'}}
              />
            </Pressable>
          </View>
        </View>
        <ActivePeopleList ListData={masterData} />
      </MiniBaseView>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
    elevation: 0,
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: 'bold',
    fontFamily: FONTS.regular,
  },
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mid_side: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  right_icon: {
    resizeMode: 'contain',
    overflow: 'hidden',
    paddingBottom: '0.2%',
    paddingRight: '0.2%',
    opacity: 0.4,
  },
});
export default HomePeopleScreen;
