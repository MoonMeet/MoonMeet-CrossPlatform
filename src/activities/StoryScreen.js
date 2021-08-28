import React from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {Avatar, TouchableRipple} from 'react-native-paper';
import ArrowIcon from '../assets/images/back.png';
import {useNavigation} from '@react-navigation/native';
import ClearImage from '../assets/images/clear.png';

const StoryScreen = () => {
  const navigation = useNavigation();

  return (
    <MiniBaseView>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            <Avatar.Image
              size={35}
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.toolbar_text}>Rayen Mark</Text>
            <Text style={styles.timeText}>5 Hours ago</Text>
          </View>
          <View style={styles.right_side}>
            <TouchableRipple
              rippleColor={COLORS.rippleColor}
              borderless={false}
              onPress={() => navigation.goBack()}>
              <Avatar.Icon
                icon={ClearImage}
                size={36.5}
                color={COLORS.black}
                style={{
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
          </View>
        </View>
        <View style={styles.imageWrapper}>
          <ImageBackground
            style={styles.storyImage}
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/moonmeet1920.appspot.com/o/avatars%2FIYguIbTuMbUT2Lb2SMOvuLA06e03.jpg?alt=media&token=d85e4729-eabb-475e-8dd6-33b4ec98b0ec',
            }}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footer_left}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={null}>
            <Avatar.Icon
              icon={ArrowIcon}
              size={36.5}
              color={COLORS.black}
              style={{
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
        </View>
        <View style={styles.footer_mid}>
          <Text style={styles.footer_text}>1 / 10</Text>
        </View>
        <View style={styles.footer_right}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
            onPress={null}>
            <Avatar.Icon
              icon={ArrowIcon}
              size={36.5}
              color={COLORS.black}
              style={{
                marginRight: '-1%',
                opacity: 0.4,
                transform: [{rotate: '180deg'}],
              }}
              theme={{
                colors: {
                  primary: COLORS.transparent,
                },
              }}
            />
          </TouchableRipple>
        </View>
      </View>
    </MiniBaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '2%',
    flexDirection: 'row',
  },
  mid_side: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: 16,
    marginLeft: '2.5%',
    marginRight: '2.5%',
  },
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
  },
  toolbar_text: {
    fontSize: 18,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  timeText: {
    fontSize: 14,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  imageHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  storyImage: {
    width: '99%',
    height: '80%',
    resizeMode: 'cover',
  },
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  right_icon: {
    paddingBottom: '0.2%',
    paddingRight: '0.2%',
    opacity: 0.4,
  },
  footer: {
    padding: '2%',
    flexDirection: 'row',
  },
  footer_left: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '1%',
    flexDirection: 'row',
  },
  footer_mid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer_right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: '1%',
  },
  footer_text: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(StoryScreen);
