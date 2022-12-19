/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useEffect} from 'react';
import {View} from 'react-native';
import {COLORS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ActivityIndicator} from 'react-native-paper';
import Spacer from '../components/Spacer/Spacer';
import UserList from '../components/DiscoverPeopleScreen/UserList';
import firestore from '@react-native-firebase/firestore';
import {heightPercentageToDP} from '../config/Dimensions';
import auth from '@react-native-firebase/auth';

const DiscoverPeopleScreen = () => {
  const [Loading, setLoading] = React.useState(true);

  const [masterData, setMasterData] = React.useState([]);

  useEffect(() => {
    const discoverSubscribe = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const usersSnapshot = [];
        querySnapshot?.forEach(documentSnapshot => {
          if (
            documentSnapshot?.data()?.avatar &&
            documentSnapshot?.data()?.first_name &&
            documentSnapshot?.data()?.last_name &&
            documentSnapshot?.data()?.active_status &&
            documentSnapshot?.data()?.active_time
          ) {
            usersSnapshot.push(documentSnapshot?.data());
          }
        });
        setMasterData(usersSnapshot);
        setLoading(false);
      });
    firestore()
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
      discoverSubscribe();
    };
  }, []);
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
  }
  return (
    <MiniBaseView>
      <Spacer height={heightPercentageToDP(0.5)} />
      <UserList ListData={masterData} onLongPressTrigger={null} />
    </MiniBaseView>
  );
};
export default DiscoverPeopleScreen;
