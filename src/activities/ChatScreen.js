import React from 'react';
import {StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import BaseView from '../components/BaseView/BaseView';

const ChatScreen = () => {
  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: '😋 Yes',
              value: 'yes',
            },
            {
              title: '📷 Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: '😞 Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
      {
        _id: 2,
        text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'radio',
          values: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: 'Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
    ]);
  }, []);

  const onSend = React.useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);
  return (
    <BaseView>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </BaseView>
  );
};
const styles = StyleSheet.create({});
export default React.memo(ChatScreen);
