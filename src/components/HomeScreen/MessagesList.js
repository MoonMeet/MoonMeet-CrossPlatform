import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import React from 'react';
import {FONTS, COLORS} from '../../config/Miscellaneous';
import {fontValue, heightPercentageToDP} from '../../config/Dimensions';
import {transformTimeChats} from '../../utils/TimeHandler/TimeHandler';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const MessagesList = ({ListData}) => {
  const navigation = useNavigation();
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading('center')}>No one active, yet.</Text>
        <Text style={styles.subheading('center')}>
          there's no one active at the moment.
        </Text>
      </View>
    );
  };
  return (
    <FlatList
      style={{flex: 1}}
      data={ListData}
      ListEmptyComponent={listEmptyComponent}
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
          android_ripple={COLORS.rippleColor}
          onPress={() => {
            navigation.navigate('chat', {item: item?.to_uid});
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
                uri: item?.to_avatar ? item?.to_avatar : null,
              }}
            />
          </View>
          <View
            style={{
              padding: '2%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.heading('left')}>
              {item?.to_first_name + ' ' + item?.to_last_name}
            </Text>
            <Text style={styles.subheading('left', true)}>
              {item?.to_message_uid !== item?.to_message_uid
                ? item?.to_message_text
                : 'You: ' + item?.to_message_text}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.subheading('right', false)}>
              {moment(item?.time).calendar()}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  userHaveStory: {
    borderWidth: /*1.5*/ 0,
    borderColor: COLORS.accentLight,
    overflow: 'hidden',
  },
  heading: align => {
    return {
      fontSize: 16,
      textAlign: align,
      color: COLORS.black,
      fontFamily: FONTS.regular,
    };
  },
  subheading: (align, isMessage) => {
    return {
      fontSize: isMessage ? fontValue(14) : fontValue(12),
      paddingTop: '1%',
      textAlign: align,
      color: COLORS.black,
      opacity: 0.4,
      fontFamily: FONTS.regular,
    };
  },
  emptyView: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    alignContent: 'center',
  },
});

export default React.memo(MessagesList);
