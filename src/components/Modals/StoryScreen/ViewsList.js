import React, {useEffect} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS} from '../../../config/Miscellaneous';

interface ViewListInterface {
  ViewsData: Array;
}

const ViewList = (props: ViewListInterface) => {
  const [usersData, setUsersData] = React.useState([]);
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading}>No views available, yet.</Text>
        <Text style={styles.subheading}>
          Unfortunately, No one have seen your story.
        </Text>
      </View>
    );
  };

  useEffect(() => {
    Object.values(props.ViewsData).map(value => {
      firestore()
        .collection('users')
        .doc(value.uid)
        .get()
        .then(documentSnapshot => {
          const data = [];
          data.push({...documentSnapshot?.data()});
          setUsersData(data);
        });
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      {Object.values(usersData)?.length > 0 ? (
        <FlatList
          data={usersData}
          contentContainerStyle={{
            paddingStart: '1%',
            paddingEnd: '2%',
          }}
          ListEmptyComponent={listEmptyComponent}
          showsVerticalScrollIndicator={false}
          disableVirtualization
          nestedScrollEnabled={true}
          removeClippedSubviews={true}
          initialNumToRender={10}
          renderItem={({item}) => (
            <Text>{item?.first_name + ' ' + item?.last_name}</Text>
          )}
        />
      ) : null}
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
