import React, {useCallback, useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import BaseView from '../components/BaseView/BaseView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS} from '../config/Miscellaneous';

const ChatScreen = () => {
  const navigation = useNavigation();
  const destinedUser = useRoute()?.params?.item;
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {}, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <BaseView>
      <Pressable onPress={navigation.goBack} style={styles.header}>
        <Ionicons
          style={{paddingStart: widthPercentageToDP(3)}}
          size={fontValue(27)}
          name={'chevron-back'}
        />
        <Image
          source={{uri: destinedUser?.avatar}}
          style={{
            height: heightPercentageToDP(5),
            width: heightPercentageToDP(5),
            borderRadius: heightPercentageToDP(2.5),
          }}
        />
        <Text style={styles.userFullName}>
          {destinedUser?.first_name} {destinedUser?.last_name}
        </Text>
      </Pressable>
      <GiftedChat
        renderChatEmpty={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{rotateX: '180deg'}],
            }}>
            <Text style={{fontSize: fontValue(15)}}>No messages here</Text>
          </View>
        )}
        messages={messages}
        onSend={data => onSend(data)}
        user={{
          _id: 1,
        }}
      />
    </BaseView>
  );
};
const styles = StyleSheet.create({
  header: {
    height: heightPercentageToDP(8),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 0.3,
  },
  userFullName: {
    fontSize: fontValue(20),
    paddingStart: widthPercentageToDP(2),
  },
});
export default React.memo(ChatScreen);
