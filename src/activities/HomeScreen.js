import React, {useEffect} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BaseView from '../components/BaseView/BaseView';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Avatar, Searchbar, Surface} from 'react-native-paper';
import PersonImage from '../assets/images/person.png';
import CreateImage from '../assets/images/create.png';
import AddImage from '../assets/images/add.png';
import TestJson from '../assets/data/json/test/stories.json';
import SearchImage from '../assets/images/search.png';
import ClearImage from '../assets/images/clear.png';
import ChatsJson from '../assets/data/json/test/chats.json';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const _testStories = TestJson;

  const _testChats = ChatsJson;

  const [avatarURL, setAvatarURL] = React.useState('');

  const [SearchData, setSearchData] = React.useState('');

  const [FilteredData, setFilteredData] = React.useState([]);

  const [MasterData, setMasterData] = React.useState([]);

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
      fontFamily: FONTS.bold,
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
    userHaveStory: {
      borderWidth: /*1.5*/ 0,
      borderColor: COLORS.accentLight,
      overflow: 'hidden',
    },
  });

  return (
    <BaseView>
      <View style={styles.container}>
        <Surface style={styles.toolbar}>
          <View style={styles.left_side}>
            <Pressable
              onPress={() => {
                navigation.navigate('settings');
              }}>
              {avatarURL ? (
                <Avatar.Image
                  size={35}
                  source={avatarURL ? {uri: avatarURL} : null}
                  style={{
                    overflow: 'hidden',
                    marginBottom: '1%',
                    marginRight: '-1%',
                  }}
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
                    marginBottom: '0.2%',
                    marginRight: '0.2%',
                  }}
                  theme={{
                    colors: {
                      primary: COLORS.rippleColor,
                    },
                  }}
                />
              )}
            </Pressable>
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
        <View
          style={{
            padding: '2%',
          }}>
          <Searchbar
            onChangeText={null}
            value={SearchData}
            placeholder={'Search here'}
            icon={SearchImage}
            selectionColor={COLORS.controlNormal}
            platform={Platform.OS}
            style={{
              borderRadius: 150 / 2,
              borderWidth: 1,
              elevation: 0,
              borderColor: COLORS.rippleColor,
            }}
            inputStyle={{
              color: COLORS.accentLight,
            }}
            clearIcon={ClearImage}
          />
        </View>

        <View style={styles.above_stories}>
          <Pressable
            style={styles.pressContainerTop}
            onPress={() => {
              if (showStoriesOrOnline === true) {
                setActiveStateColor(COLORS.accentLight);
                setDisabledStateColor(COLORS.black);
                setShowStoriesOrOnline(false);
              }
            }}>
            <Text style={styles.mini_text_left}>Stories</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (showStoriesOrOnline === false) {
                setActiveStateColor(COLORS.black);
                setDisabledStateColor(COLORS.accentLight);
                setShowStoriesOrOnline(true);
              }
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
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingStart: '1%',
                    paddingEnd: '12%',
                  }}
                  data={_testStories}
                  renderItem={({item}) => (
                    <Pressable
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
                        <Avatar.Image
                          style={styles.userHaveStory}
                          size={50}
                          source={{uri: item.avatar}}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: COLORS.black,
                        }}>
                        {item.name}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={item => item.name}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          data={_testChats}
          contentContainerStyle={{
            paddingStart: '1%',
            paddingEnd: '2%',
          }}
          renderItem={({item}) => (
            <Pressable
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  padding: '2%',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Avatar.Image
                  style={styles.userHaveStory}
                  size={50}
                  source={{uri: item.avatar}}
                />
              </View>
              <View
                style={{
                  padding: '2%',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text>{item.name}</Text>
                <Text>{item.lastmessage}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Text>{item.time}</Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </BaseView>
  );
};
export default HomeScreen;
