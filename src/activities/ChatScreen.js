import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, TextInput, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import MoonChatList from '../components/ChatScreen/MoonChatList/MoonChatList';
import SendImage from '../assets/images/send.png';

const ChatScreen = () => {
  const navigation = useNavigation();
  const destinedUser = useRoute()?.params?.item;
  const [messages, setMessages] = React.useState([
    {
      name: 'Houssin Eraged',
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/moonmeet1920.appspot.com/o/avatars%2FIYguIbTuMbUT2Lb2SMOvuLA06e03.jpg?alt=media&token=e020d7bf-f006-4ddf-8ede-b3cacebea78e',
      lastmessage: 'How are you doing ?',
      time: '12:05',
      uid: '3GbKpy5kmTPdZHMyd9X60of59k72',
    },
    {
      name: 'Houssin Eraged',
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/moonmeet1920.appspot.com/o/avatars%2FIYguIbTuMbUT2Lb2SMOvuLA06e03.jpg?alt=media&token=e020d7bf-f006-4ddf-8ede-b3cacebea78e',
      lastmessage: 'How are you doing ?',
      time: '12:05',
      uid: 'TsYO3H0bbfgxnKuc72Z8VfjBhsk1',
    },
  ]);

  const [mMessageText, setMessageText] = React.useState('');

  useEffect(() => {}, []);

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
      <MoonChatList ChatData={messages} />
      <View style={styles.messageInputBox}>
        <TextInput
          style={{flexGrow: 1}}
          mode="outlined"
          value={mMessageText}
          placeholder={'Type a message'}
          theme={{
            colors: {
              text: COLORS.accentLight,
              primary: COLORS.accentLight,
              backgroundColor: COLORS.rippleColor,
              placeholder: COLORS.darkGrey,
              underlineColor: '#566193',
              selectionColor: '#DADADA',
              outlineColor: '#566193',
            },
            roundness: heightPercentageToDP(3),
          }}
          onChangeText={text => {
            setMessageText(text);
          }}
        />
        <Avatar.Icon
          icon={SendImage}
          size={64}
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
      </View>
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
  messageInputBox: {
    flexDirection: 'row',
    padding: heightPercentageToDP(0.5),
  },
});
export default React.memo(ChatScreen);
