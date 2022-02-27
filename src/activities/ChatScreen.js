import React, {useCallback, useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import BaseView from '../components/BaseView/BaseView';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import auth from '@react-native-firebase/auth';

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
      <View style={styles.header}>
        <TouchableRipple
          rippleColor={COLORS.rippleColor}
          borderless={false}
          onPress={() => {
            navigation.goBack();
          }}>
          <Avatar.Icon
            icon={BackImage}
            size={50}
            color={COLORS.black}
            style={{
              overflow: 'hidden',
              marginRight: '-1%',
              opacity: 0.4,
            }}
            theme={{
              colors: {
                primary: COLORS.transparent,
              },
            }}
          />
        </TouchableRipple>
        <Avatar.Image size={45} source={{uri: destinedUser?.avatar}} />
        <Text style={styles.userFullName}>
          {destinedUser?.first_name} {destinedUser?.last_name}
        </Text>
      </View>
      <GiftedChat
        renderChatEmpty={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{rotateX: '180deg'}],
            }}>
            <Text style={styles.emptyHolderHeaderText}>No Messages, yet.</Text>
            <Text style={styles.emptyHolderSubText}>
              There's no messages between you and {destinedUser.first_name}
            </Text>
          </View>
        )}
        messages={messages}
        onSend={data => onSend(data)}
        user={{
          uid: auth().currentUser?.uid,
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
  },
  userFullName: {
    fontSize: fontValue(15),
    paddingStart: widthPercentageToDP(2),
    alignSelf: 'center',
  },
  emptyHolderHeaderText: {
    fontSize: fontValue(14),
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.6,
    fontFamily: FONTS.regular,
  },
  emptyHolderSubText: {
    fontSize: fontValue(13.5),
    paddingTop: '2%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});
export default React.memo(ChatScreen);
