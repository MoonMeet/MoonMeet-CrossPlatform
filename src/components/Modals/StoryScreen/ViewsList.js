import React, {useEffect} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import database from '@react-native-firebase/database';
import {COLORS, FONTS} from '../../../config/Miscellaneous';

interface ViewListInterface {
  ViewData: Array;
}

const ViewList = (props: ViewListInterface) => {
  const [normalViewsData, setNormalViewsData] = React.useState(props.ViewData);
  const [usersData, setUsers] = React.useState([]);
  const fetchEveryUser = () => {
    let data = [];
    Object.values(normalViewsData).forEach(item => {
      database()
        .ref(`/users/${item?.uid}/`)
        .once('value', snapshot => {
          data.push({
            uid: snapshot?.val().uid,
            first_name: snapshot?.val().first_name,
            last_name: snapshot?.val().last_name,
            avatar: snapshot?.val().avatar,
            bio: snapshot?.val().bio,
            username: snapshot?.val().username,
          });
          setUsers(data);
        });
    });
  };

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
    fetchEveryUser();
  }, []);
  return (
    <View style={{flex: 1}}>
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
          <Text>{item.bio < 1 ? item.username : item.bio}</Text>
        )}
      />
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
