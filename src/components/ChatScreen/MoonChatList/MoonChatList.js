import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../config/Dimensions';
import {Avatar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {COLORS} from '../../../config/Miscellaneous';

const MoonChatList = ({ChatData}) => {
  const mListEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{rotateX: '180deg'}],
        }}>
        <Text style={styles.emptyHolderHeaderText}>No Messages, yet.</Text>
        <Text style={styles.emptyHolderSubText}>
          There's no messages between you and {mUserUID.first_name}
        </Text>
      </View>
    );
  };
  return (
    <FlatList
      data={ChatData}
      ListEmptyComponent={mListEmptyComponent}
      contentContainerStyle={{
        paddingStart: '1%',
        paddingEnd: '2%',
        paddingBottom: heightPercentageToDP(10),
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      inverted={true}
      initialNumToRender={10}
      renderItem={({item}) => (
        <Pressable
          style={styles.pressableContainer(item.uid)}
          onPress={() => {
            //TODO: Implement Modal / BottomSheet
            console.log(item.uid);
          }}>
          <Text style={styles.messagetext(item.uid)}>
            Hello Sir Hiw Ara Youa
          </Text>
        </Pressable>
      )}
    />
  );
};
const styles = StyleSheet.create({
  pressableContainer: currentUser => {
    return {
      alignSelf:
        auth()?.currentUser.uid === currentUser ? 'flex-end' : 'flex-start',
      backgroundColor:
        auth()?.currentUser.uid === currentUser
          ? COLORS.accentLight
          : COLORS.rippleColor,
      borderRadius: widthPercentageToDP(4),
      padding: heightPercentageToDP(1.5),
    };
  },
  messagetext: currentUser => {
    return {
      color:
        auth()?.currentUser.uid === currentUser ? COLORS.white : COLORS.black,
    };
  },
});
export default React.memo(MoonChatList);
