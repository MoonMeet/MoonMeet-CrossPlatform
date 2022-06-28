import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import React from 'react';
import {FONTS, COLORS} from '../../config/Miscellaneous';
import {heightPercentageToDP} from '../../config/Dimensions';
import {transformTimeChats} from '../../utils/TimeHandler/TimeHandler';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const MessagesList = ({ListData}) => {
  const navigation = useNavigation();
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
            onPress={() => {
              navigation.navigate('chat', {item: item?.last_message_uid});
            }}
            style={{
              flexDirection: 'row',
              padding: '2%',
            }}>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Avatar.Image
                style={styles.userHaveStory}
                size={52.5}
                source={{
                  uri: item?.last_message_avatar
                    ? item?.last_message_avatar
                    : null,
                }}
              />
            </View>
            <View
              style={{
                padding: '2%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.heading}>
                {item?.last_message_first_name +
                  ' ' +
                  item?.last_message_last_name}
              </Text>
              <Text style={styles.subheading}>
                {auth()?.currentUser?.uid === item?.last_message_uid
                  ? item?.last_message_text
                  : 'You: ' + item?.last_message_text}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Text style={styles.subheading}>
                {transformTimeChats(item?.last_message_time)}
              </Text>
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
  heading: {
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  subheading: {
    fontSize: 14,
    paddingTop: '1%',
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(MessagesList);
