import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import {useNavigation} from '@react-navigation/native';
const StoryScreen = () => {
    const navigation = useNavigation();
    return (
        <MiniBaseView>
         <View style={styles.container}>
          <View style={styles.toolbar}>
           <View style={styles.left_side}>
            <TouchableRipple
               rippleColor={COLORS.rippleColor}
               borderless={false}
               onPress={() => {
               navigation.goBack();
            }}>
            <Avatar.Icon
              icon={BackImage}
              size={37.5}
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
           </View>
            <View style={styles.mid_side}>
              <Image
                style={styles.top_profile_image}
                source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
                 }}/>
            <Text style={styles.toolbar_text}>Rayen Mark</Text>
           </View>
          </View>
         <ScrollView>
            <Image
            style={styles.storyImage}
            source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/moonmeet1920.appspot.com/o/avatars%2FIYguIbTuMbUT2Lb2SMOvuLA06e03.jpg?alt=media&token=d85e4729-eabb-475e-8dd6-33b4ec98b0ec',
            }}/>
         </ScrollView>
         </View>
         <View style={styles.footer}>
           {/*Footer to add left and right arrows*/}
         </View>
        </MiniBaseView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.primaryLight,
      maxWidth: '100%',
      aspectRatio: 1 * 1.4,
    },
    top_profile_image: {
        width:30,
        height:30,
        borderRadius:20,
        marginRight:3
    },
    under_header: {
      padding: '2%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    left_side: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
    },
    mid_side: {
      flex: 2,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 18,
      marginLeft: '2.5%',
      marginRight: '2.5%',
    },
    toolbar: {
      padding: '2%',
      flexDirection: 'row',
    },
    toolbar_text: {
      fontSize: 20,
      paddingLeft: '2%',
      paddingRight: '3%',
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
    under_header_text: {
      position: 'relative',
      fontSize: 24,
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '1%',
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
    storyImage: {
        width: '98%',
        height: 300,
        justifyContent: 'center',
        marginHorizontal: 4,
        marginTop: 75
      },
      footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
      }
  });

export default React.memo(StoryScreen);