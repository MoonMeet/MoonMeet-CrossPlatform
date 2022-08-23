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
      marginVertical: 10 - 0.1 * 10,
    },
    inputAndMicrophone: {
      flexDirection: 'row',
      backgroundColor: COLORS.dimmed,
      flex: 3,
      marginRight: 10 - 0.1 * 10,
      paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      borderRadius: 30 - 0.1 * 30,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      backgroundColor: 'transparent',
      marginLeft: 12.5 - 0.1 * 12.5,
      color: COLORS.black,
      flex: 3,
      fontSize: fontValue(16),
      height: 55 - 0.1 * 55,
      alignSelf: 'center',
    },
    rightIconButtonStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15 - 0.1 * 15,
      marginLeft: 5 - 0.1 * 5,
      borderLeftWidth: 0,
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
      marginLeft: 15 - 0.1 * 15,
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
      borderRadius: 55 - 0.1 * 55,
      backgroundColor: COLORS.accentLight,
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
              android_ripple={{
                color: COLORS.controlHighlight,
                borderless: true,
                foreground: true,
                radius: 30 - 0.1 * 30,
              }}
              style={styles.emoticonButton}
              onPress={() => emojiSetter(true)}>
              <MaterialCommunityIcons
                name={emojiGetter ? 'close' : 'emoticon-outline'}
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
              android_ripple={{
                color: COLORS.controlHighlight,
                borderless: true,
                radius: 30 - 0.1 * 30,
              }}
              style={styles.rightIconButtonStyle}
              onPress={attachPressCallback}>
              <MaterialCommunityIcons
                name="paperclip"
                size={23}
                color={COLORS.darkGrey}
              />
            </Pressable>
            <Pressable
              hitSlop={10}
              android_ripple={{
                color: COLORS.controlHighlight,
                borderless: true,
                radius: 30 - 0.1 * 30,
              }}
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
            hitSlop={10}
            android_ripple={{
              color: COLORS.controlHighlight,
              borderless: true,
              radius: 30 - 0.1 * 30,
            }}
            style={styles.sendButton}
            onPress={() => {
              if (messageGetter?.trim()?.length > 0) {
                sendMessageCallback();
              } else {
                // Do nothing for now
              }
            }}>
            <MaterialCommunityIcons
              adjustsFontSizeToFit
              allowFontScaling
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
