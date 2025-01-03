/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2022.
 */

import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from 'config/Miscellaneous';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView.tsx';
import MessagesList from '@components/HomeScreen/MessagesList';
import firestore from '@react-native-firebase/firestore';
import {fontValue, heightPercentageToDP} from 'config/Dimensions';
import {InfoToast} from 'components/ToastInitializer/ToastInitializer';
import {PurpleBackground} from '../index.d';
import {reverse, sortBy} from 'lodash';
import Spacer from '../components/Spacer/Spacer';
import {StorageInstance} from 'config/MMKV/StorageInstance';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'config/NavigationTypes/NavigationTypes.ts';

type ChatData = {typing: any; id: string; time: Date};

const HomeChatsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [chatsData, setChatsData] = React.useState<ChatData[]>([]);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [chatsLoading, setChatsLoading] = React.useState(true);

  const checkJwtKey = useCallback(
    (currentJwtKey: string) => {
      const currentKey = StorageInstance?.getString('currentUserJwtKey');
      if (currentKey !== currentJwtKey) {
        StorageInstance?.delete('currentUserJwtKey');
        if (auth()?.currentUser !== null) {
          auth()
            ?.signOut()
            .then(() => {
              navigation?.navigate('login');
              InfoToast(
                'bottom',
                'Session Expired',
                'Your session in this account has been expired, Please re-login',
                true,
                3000,
              );
            })
            .catch(() => {
              auth()
                ?.signOut()
                .then(() => {
                  navigation?.navigate('login');
                });
              if (__DEV__) {
                console.error('failed loggin out the user');
              }
            });
        }
      }
    },
    [navigation],
  );

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
    const userSubscribe = firestore()
      .collection('users')
      .onSnapshot(collectionSnapshot => {
        collectionSnapshot?.forEach(documentSnapshot => {
          if (documentSnapshot?.exists) {
            if (documentSnapshot?.id === auth()?.currentUser?.uid) {
              if (
                documentSnapshot?.data()?.avatar &&
                documentSnapshot?.data()?.jwtKey &&
                documentSnapshot?.data()?.active_status &&
                documentSnapshot?.data()?.active_time
              ) {
                setAvatarURL(documentSnapshot?.data()?.avatar);
                checkJwtKey(documentSnapshot?.data()?.jwtKey);
                StorageInstance.set(
                  'Me',
                  JSON?.stringify(documentSnapshot?.data()),
                );
              }
            }
          }
        });
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      userSubscribe();
    };
  }, [checkJwtKey]);

  useEffect(() => {
    const chatSubscribe = firestore()
      .collection('chats')
      .doc(auth()?.currentUser?.uid)
      .collection('discussions')
      .onSnapshot(collectionSnapshot => {
        if (collectionSnapshot?.empty) {
          setChatsData([]);
        } else {
          let collectionDocs = collectionSnapshot?.docs?.map(subMap => ({
            ...subMap?.data(),
            typing: subMap?.data()?.typing,
            id: subMap?.id,
            time: subMap?.data()?.time,
          }));
          collectionDocs = sortBy(collectionDocs, [
            data => data?.time?.toDate(),
          ]);
          collectionDocs = reverse(collectionDocs);
          setChatsData(collectionDocs);
        }
        setChatsLoading(false);
      });
    return () => {
      chatSubscribe();
    };
  }, []);

  if (chatsLoading) {
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
            <Text style={styles.top_text}>Chats</Text>
          </View>
        </View>
        <Spacer height={heightPercentageToDP(0.5)} />
        <MessagesList ListData={chatsData} />
      </MiniBaseView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
    elevation: 0,
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '1%',
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
    paddingRight: heightPercentageToDP(0.25),
  },
  mid_side: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
});

export default HomeChatsScreen;
