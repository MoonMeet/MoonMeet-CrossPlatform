import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BaseView from '../components/BaseView/BaseView';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Avatar, Surface} from 'react-native-paper';
import PersonImage from '../assets/images/person.png';
import CreateImage from '../assets/images/create.png';
import AddImage from '../assets/images/add.png';
import TestJson from '../assets/data/json/test/stories.json';

const HomeScreen = () => {
  const _testj = TestJson;
  const [avatarURL, setAvatarURL] = React.useState('');
  const [activeStateColor, setActiveStateColor] = React.useState(
    COLORS.accentLight,
  );
  const [disabledStateColor, setDisabledStateColor] = React.useState(
    COLORS.black,
  );

  const [showStoriesOrOnline, setShowStoriesOrOnline] = React.useState(false);

  useEffect(() => {
    fetchAvatar();
    return () => {};
  }, []);

  const fetchAvatar = () => {
    database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', snapshot => {
        if (snapshot?.val().avatar) {
          setAvatarURL(snapshot?.val().avatar);
        }
      });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.primaryLight,
    },
    toolbar: {
      padding: '2%',
      flexDirection: 'row',
      elevation: 3,
    },
    top_text: {
      position: 'relative',
      fontSize: 26,
      paddingLeft: '3%',
      paddingRight: '3%',
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
    left_side: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    mid_side: {
      flex: 2,
      backgroundColor: 'white',
      flexDirection: 'row',
      fontSize: 18,
      marginLeft: 10,
      marginRight: 10,
    },
    right_side: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    right_icon: {
      resizeMode: 'contain',
      overflow: 'hidden',
      paddingBottom: '0.2%',
      paddingRight: '0.2%',
    },
    above_stories: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    pressContainerTop: {
      position: 'relative',
      paddingTop: '2%',
      paddingBottom: '2%',
      paddingLeft: '3%',
      paddingRight: '2.5%',
    },
    pressContainerTopRight: {
      position: 'relative',
      paddingTop: '2%',
      paddingBottom: '2%',
      paddingLeft: '1.5%',
    },
    mini_text_left: {
      fontSize: 16,
      textAlign: 'center',
      color: activeStateColor,
      opacity: activeStateColor === COLORS.accentLight ? 1 : 0.4,
      fontFamily: FONTS.regular,
    },
    mini_text_right: {
      fontSize: 16,
      textAlign: 'center',
      color: disabledStateColor,
      opacity: disabledStateColor === COLORS.accentLight ? 1 : 0.4,
      fontFamily: FONTS.regular,
    },
    storyHolder: {
      flex: 1,
      flexDirection: 'row',
      paddingTop: '2%',
      paddingBottom: '2%',
      paddingLeft: '3%',
      paddingRight: '3%',
    },
    storyHolderLeft: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '17%',
    },
    storyText: {
      position: 'relative',
      fontSize: 15,
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '0.2%',
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
    flatListHolder: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    activeStoriesRow: {
      flexDirection: 'column',
    },
  });

  return (
    <BaseView>
      <View style={styles.container}>
        <Surface style={styles.toolbar}>
          <View style={styles.left_side}>
            {avatarURL ? (
              <Avatar.Image
                size={35}
                source={avatarURL ? {uri: avatarURL} : null}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            ) : (
              <Avatar.Icon
                icon={PersonImage}
                size={35}
                color={COLORS.accentLight}
                style={{
                  overflow: 'hidden',
                  paddingBottom: '0.2%',
                  paddingRight: '0.2%',
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            )}
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.top_text}>Chats</Text>
          </View>
          <View style={styles.right_side}>
            <Avatar.Icon
              icon={CreateImage}
              size={35}
              color={COLORS.black}
              style={styles.right_icon}
              theme={{
                colors: {
                  primary: COLORS.rippleColor,
                },
              }}
            />
          </View>
        </Surface>
        <View style={styles.above_stories}>
          <Pressable
            style={styles.pressContainerTop}
            onPress={() => {
              setActiveStateColor(COLORS.accentLight);
              setDisabledStateColor(COLORS.black);
              setShowStoriesOrOnline(!showStoriesOrOnline);
            }}>
            <Text style={styles.mini_text_left}>Stories</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveStateColor(COLORS.black);
              setDisabledStateColor(COLORS.accentLight);
              setShowStoriesOrOnline(!showStoriesOrOnline);
            }}
            style={styles.pressContainerTopRight}>
            <Text style={styles.mini_text_right}>Online</Text>
          </Pressable>
        </View>
        <View style={styles.storyHolder}>
          <View style={styles.storyHolderLeft}>
            <Avatar.Icon
              icon={AddImage}
              size={50}
              color={COLORS.black}
              style={styles.right_icon}
              theme={{
                colors: {
                  primary: COLORS.rippleColor,
                },
              }}
            />
            <Text style={styles.storyText}>
              {showStoriesOrOnline ? 'Discover people' : 'Post story'}
            </Text>
          </View>
          <View style={styles.activeStoriesRow}>
            {showStoriesOrOnline ? (
              <View style={styles.flatListHolder}>
                <FlatList data={null} renderItem={null} />
              </View>
            ) : (
              <View style={styles.flatListHolder}>
                <FlatList
                  showsHorizontalScrollIndicator={true}
                  horizontal
                  scrollEnabled
                  data={_testj}
                  renderItem={({item}) => (
                    <View
                      style={{
                        padding: '2%',
                        height: 85,
                        width: 70,
                        backgroundColor: COLORS.primaryLight,
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Avatar.Image size={45} source={{uri: item.avatar}} />
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: COLORS.black,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                  keyExtractor={item => item.name}
                />
              </View>
            )}
          </View>
          <FlatList data={null} renderItem={null} />
        </View>
      </View>
    </BaseView>
  );
};
export default HomeScreen;
