import React from 'react';
import {Platform, Pressable, StyleSheet, TextInput, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fontValue} from '../../config/Dimensions';
import {COLORS} from '../../config/Miscellaneous';

const MyInputToolbar = ({
  messageGetter,
  messageSetter,
  emojiGetter,
  emojiSetter,
  sendMessageCallback,
  cameraPressCallback,
  attachPressCallback,
}) => {
  const height = useSharedValue(70);

  const heightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: height?.value,
    };
  });

  /**
   * Some styles are tested and not shiped, we will use them soon.
   */
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: COLORS.white,
    },
    replyContainer: {
      paddingHorizontal: 10,
      marginHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    title: {
      marginTop: 5,
      fontWeight: 'bold',
    },
    closeReply: {
      position: 'absolute',
      right: 10,
      top: 5,
    },
    reply: {
      marginTop: 5,
    },
    innerContainer: {
      paddingHorizontal: 10 - 0.1 * 10,
      marginHorizontal: 10 - 0.1 * 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 10,
    },
    inputAndMicrophone: {
      flexDirection: 'row',
      backgroundColor: COLORS.dimmed,
      flex: 3,
      marginRight: 8 - 0.1 * 8,
      paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      borderRadius: 30 - 0.1 * 30,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      backgroundColor: 'transparent',
      paddingLeft: 15 - 0.1 * 15,
      color: COLORS.controlHighlight,
      flex: 3,
      fontSize: fontValue(16),
      height: 55 - 0.1 * 55,
      alignSelf: 'center',
    },
    rightIconButtonStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 15 - 0.1 * 15,
      paddingLeft: 5 - 0.1 * 5,
      borderLeftWidth: 1,
      borderLeftColor: COLORS.dimmed, // #fff
    },
    swipeToCancelView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 30,
    },
    swipeText: {
      color: COLORS.description,
      fontSize: 15,
    },
    emoticonButton: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10,
    },
    recordingActive: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 10,
    },
    recordingTime: {
      color: COLORS.darkGrey,
      fontSize: 20,
      marginLeft: 5,
    },
    microphoneAndLock: {
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    lockView: {
      backgroundColor: '#eee',
      width: 60,
      alignItems: 'center',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      height: 130,
      paddingTop: 20,
    },
    sendButton: {
      backgroundColor: COLORS.accentLight,
      borderRadius: 50 - 0.1 * 50,
      height: 55 - 0.1 * 55,
      width: 55 - 0.1 * 55,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <>
      <Animated.View style={[styles.container, heightAnimatedStyle]}>
        <View style={styles.innerContainer}>
          <View style={styles.inputAndMicrophone}>
            <Pressable
              style={styles.emoticonButton}
              onPress={() => emojiSetter(true)}>
              <MaterialCommunityIcons
                name={false ? 'close' : 'emoticon-outline'} // must be emojiGetter ? 'close' : 'emoticon-outline' but due to library showup, i did false :°
                size={23}
                color={COLORS.darkGrey}
              />
            </Pressable>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder={'Aa'}
              style={styles.input}
              value={messageGetter}
              onChangeText={text => messageSetter(text)}
            />
            <Pressable
              style={styles.rightIconButtonStyle}
              onPress={attachPressCallback}>
              <MaterialCommunityIcons
                name="paperclip"
                size={23}
                color={COLORS.darkGrey}
              />
            </Pressable>
            <Pressable
              style={styles.rightIconButtonStyle}
              onPress={cameraPressCallback}>
              <MaterialCommunityIcons
                name="camera"
                size={23}
                color={COLORS.darkGrey}
              />
            </Pressable>
          </View>
          <Pressable
            style={styles.sendButton}
            onPress={() => {
              if (messageGetter?.trim()?.length > 0) {
                sendMessageCallback();
              } else {
                // Do nothing for now
              }
            }}>
            <MaterialCommunityIcons
              name={messageGetter?.trim()?.length ? 'send' : 'microphone'}
              size={23}
              color={COLORS.white}
            />
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
};

export default MyInputToolbar;
