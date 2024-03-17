/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2024.
 */

import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';

interface User {
  uid: string;
  first_name: string;
  last_name: string;
}

interface ViewListInterface {
  ViewsData: Record<string, User>;
}

const ViewList = (ViewsData: ViewListInterface) => {
  const [usersData, setUsersData] = useState<User[]>([]);

  useEffect(() => {
    Promise.all(
      Object.values(ViewsData).map(async subData => {
        const documentSnapshot = await firestore()
          .collection('users')
          .doc(subData.uid)
          .get();

        return documentSnapshot.exists
          ? {...(documentSnapshot.data() as User)}
          : undefined;
      }),
    ).then(fetchedData => {
      setUsersData(fetchedData.filter(Boolean) as User[]);
    });
  }, [ViewsData]);

  return (
    <View style={{flex: 1}}>
      {Object.values(usersData)?.length > 0 ? (
        <FlatList
          data={usersData}
          contentContainerStyle={{
            paddingStart: '1%',
            paddingEnd: '2%',
          }}
          showsVerticalScrollIndicator={false}
          disableVirtualization
          nestedScrollEnabled={true}
          removeClippedSubviews={true}
          initialNumToRender={10}
          renderItem={({item}) => (
            <Text>{item?.first_name + ' ' + item?.last_name}</Text>
          )}
        />
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.heading}>No views available, yet.</Text>
          <Text style={styles.subheading}>
            Unfortunately, No one have seen your story.
          </Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  heading: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
    width: '100%',
  },
  subheading: {
    fontSize: 14,
    paddingTop: '1%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
    width: '100%',
  },
});
export default ViewList;
