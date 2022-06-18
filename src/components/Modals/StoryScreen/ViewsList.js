import React from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

interface ViewListInterface {
  ViewData: Array;
}

const ViewList = (props: ViewListInterface) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={props.ViewData}
        contentContainerStyle={{
          paddingStart: '1%',
          paddingEnd: '2%',
        }}
        showsVerticalScrollIndicator={false}
        disableVirtualization
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
        initialNumToRender={10}
        keyExtractor={item => item.avatar}
        renderItem={({item}) => <View />}
      />
    </View>
  );
};
