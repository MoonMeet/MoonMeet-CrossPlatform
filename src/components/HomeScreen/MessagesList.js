import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import React from 'react';
import {COLORS} from '../../config/Miscellaneous';
import {heightPercentageToDP} from '../../config/Dimensions';

const MessagesList = ({ListData}) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={ListData}
        contentContainerStyle={{
          paddingStart: '1%',
          paddingEnd: '2%',
          paddingBottom: heightPercentageToDP(10),
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={10}
        renderItem={({item}) => (
          <Pressable
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                padding: '2%',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Avatar.Image
                style={styles.userHaveStory}
                size={50}
                source={{uri: 'https://i.pravatar.cc/300'}}
              />
            </View>
            <View
              style={{
                padding: '2%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text>{item?.name}</Text>
              <Text>{item?.lastmessage}</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Text>{item.time}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userHaveStory: {
    borderWidth: /*1.5*/ 0,
    borderColor: COLORS.accentLight,
    overflow: 'hidden',
  },
});

export default React.memo(MessagesList);
