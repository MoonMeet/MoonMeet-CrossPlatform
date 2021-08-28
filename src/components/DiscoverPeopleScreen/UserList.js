import {FlatList, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../config/Miscellaneous';

const UserList = ({ListData}) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={ListData}
        contentContainerStyle={{
          paddingStart: '1%',
          paddingEnd: '2%',
        }}
        showsVerticalScrollIndicator={false}
        disableVirtualization
        removeClippedSubviews={true}
        initialNumToRender={10}
        renderItem={({item}) =>
          item.map(() => {
            return (
              <View style={{backgroundColor: COLORS.blue}}>
                <Text>{item.first_name}</Text>
              </View>
            );
          })
        }
      />
    </View>
  );
};
export default React.memo(UserList);
