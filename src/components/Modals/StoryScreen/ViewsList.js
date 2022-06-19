import React, {useEffect} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import database from '@react-native-firebase/database';

interface ViewListInterface {
  ViewData: Array;
}

const ViewList = (props: ViewListInterface) => {
  const [normalViewsData, setNormalViewsData] = React.useState(props.ViewData);
  const [usersData, setUsers] = React.useState([]);
  const fetchEveryUser = () => {
    Object.values(normalViewsData).forEach(item => {
      database()
        .ref(`/users/${item.uid}/`)
        .once('value', snapshot => {
          setUsers(snapshot?.val());
        })
        .finally(() => {
          console.log(usersData);
        });
    });
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
        showsVerticalScrollIndicator={false}
        disableVirtualization
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
        initialNumToRender={10}
        renderItem={({item}) => <Text>AAAAAAAAAAAAAAAAAAAAAA</Text>}
      />
    </View>
  );
};
const styles = StyleSheet.create({});
export default ViewList;
