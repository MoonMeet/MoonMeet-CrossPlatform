import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../config/Dimensions';
import {Avatar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import Spacer from '../../Spacer/Spacer';
import {COLORS} from '../../../config/Miscellaneous';
import {flexDirection} from 'styled-system';

const MoonChatList = ({ChatData, userInfo}) => {
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
          There's no messages between you and {userInfo.first_name}
        </Text>
      </View>
    );
  };
  return (
    <FlatList
      data={ChatData}
      ListEmptyComponent={mListEmptyComponent}
      ItemSeparatorComponent={() => {
        return <Spacer height={heightPercentageToDP(0.5)} />;
      }}
      contentContainerStyle={{
        paddingStart: '2%',
        paddingEnd: '2%',
        paddingBottom: heightPercentageToDP(10),
      }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      inverted={true}
      initialNumToRender={10}
      renderItem={({item}) => (
        <View style={styles.viewContainer(item.uid)}>
          {auth().currentUser.uid != item.uid ? (
            <View style={styles.avatarContainer}>
              <Avatar.Image size={35} source={{uri: item.avatar}} />
            </View>
          ) : null}
          <Pressable
            style={styles.pressableContainer(item.uid)}
            onPress={() => {
              //TODO: Implement Modal / BottomSheet
              console.log(item.uid);
            }}>
            <Text style={styles.messagetext(item.uid)}>
              This is a simple fucking text.
            </Text>
            <View style={styles.messageSmallView(item.uid)}>
              <Text style={styles.timeText(item.uid)}>{item.time}</Text>
            </View>
          </Pressable>
        </View>
      )}
    />
  );
};
const styles = StyleSheet.create({
  viewContainer: currentUser => {
    return {
      alignSelf:
        auth()?.currentUser.uid === currentUser ? 'flex-end' : 'flex-start',
      flexDirection: 'row',
    };
  },
  avatarContainer: {
    justifyContent: 'center',
    paddingStart: heightPercentageToDP(0.5),
    paddingEnd: heightPercentageToDP(0.5),
  },
  pressableContainer: currentUser => {
    return {
      flexDirection: 'column',
      alignSelf:
        auth()?.currentUser.uid === currentUser ? 'flex-end' : 'flex-start',
      backgroundColor:
        auth()?.currentUser.uid === currentUser
          ? COLORS.accentLight
          : COLORS.rippleColor,
      borderRadius: widthPercentageToDP(4),
      padding: heightPercentageToDP(1.25),
    };
  },
  messagetext: currentUser => {
    return {
      fontSize: fontValue(14),
      color:
        auth()?.currentUser.uid === currentUser ? COLORS.white : COLORS.black,
    };
  },
  messageSmallView: currentUser => {
    return {
      alignSelf:
        auth()?.currentUser.uid === currentUser ? 'flex-end' : 'flex-start',
    };
  },
  timeText: currentUser => {
    return {
      fontSize: fontValue(10),
      color:
        auth()?.currentUser.uid === currentUser ? COLORS.white : COLORS.black,
    };
  },
});
export default React.memo(MoonChatList);
