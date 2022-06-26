import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Pressable,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ActivityIndicator, Avatar, TouchableRipple} from 'react-native-paper';
import ArrowIcon from '../assets/images/back.png';
import {useNavigation, useRoute} from '@react-navigation/native';
import BackImage from '../assets/images/back.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {transformTimeForStories} from '../utils/TimeHandler/TimeHandler';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import DotsImage from '../assets/images/dots.png';
import EyeImage from '../assets/images/eye.png';
import StoryActionSheet from '../components/Modals/StoryScreen/StoryActionSheet';
import StoryViewsActionSheet from '../components/Modals/StoryScreen/StoryViewsActionSheet';
import Clipboard from '@react-native-clipboard/clipboard';

const StoryScreen = () => {
  const navigation = useNavigation();
  const userStoryUID = useRoute()?.params?.userUID;
  const myUID = useRoute()?.params?.myUID;

  const storiesRef = useRef(null);

  const [storyFirstName, setStoryFirstName] = React.useState('');
  const [storyLastName, setStoryLastName] = React.useState('');
  const [storyAvatar, setStoryAvatar] = React.useState('');
  const [storyId, setStoryId] = React.useState('');
  const [storyTime, setStoryTime] = React.useState('');
  const [storyText, setStoryText] = React.useState('');
  const [storyUID, setStoryUID] = React.useState('');
  const [allCurrentUserStories, setAllCurrentUserStories] = React.useState({});
  const [current, setCurrent] = React.useState({});
  const [viewsData, setViewsData] = React.useState([]);

  const [Loading, setLoading] = React.useState(true);
  const [ActionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [storyViewsVisible, setStoryViewsVisible] = React.useState(false);

  async function deleteCurrentStory(sid) {
    return await database().ref(`/stories/${userStoryUID}/${sid}`).remove();
  }

  /**
   * View Ability config for Stories FlatList.
   * @type {React.MutableRefObject<(function({changed: *}): void)|*>}
   */
  const onViewableItemsChanged = useRef(({changed}) => {
    setCurrent(changed?.[0]?.index);
  });
  const viewAbilityConfig = useRef({viewAreaCoveragePercentThreshold: 100});

  useEffect(() => {
    const firestoreSubscribe = firestore()
      .collection('users')
      .doc(userStoryUID)
      .onSnapshot(documentSnapshot => {
        setStoryAvatar(documentSnapshot?.data()?.avatar);
        setStoryFirstName(documentSnapshot?.data()?.first_name);
        setStoryLastName(documentSnapshot?.data()?.last_name);
        setStoryUID(documentSnapshot?.data()?.uid);
        firestore()
          .collection('users')
          .doc(userStoryUID)
          .collection('stories')
          .onSnapshot(collectionSnapshot => {
            collectionSnapshot?.forEach(subDocumentSnapshot => {
              setStoryId(subDocumentSnapshot?.data()?.sid);
              setStoryTime(subDocumentSnapshot?.data()?.time);
              setStoryText(subDocumentSnapshot?.data()?.text);
              const storyData = [];
              storyData.push(subDocumentSnapshot?.data());
              setAllCurrentUserStories(storyData);
              console.log(allCurrentUserStories);
              setLoading(false);
            });
          });
      });
    /**
     database()
      .ref(`/stories/${userStoryUID}/`)
      .once('value', snapshot => {
        setAllCurrentUserStories(snapshot.val());
        snapshot?.forEach(childSnapshot => {
          if (
            childSnapshot.val()?.first_name &&
            childSnapshot.val()?.last_name &&
            childSnapshot.val()?.sid &&
            childSnapshot.val()?.time &&
            childSnapshot.val()?.uid &&
            childSnapshot.val()?.avatar &&
            (childSnapshot.val()?.text || childSnapshot.val()?.image)
          ) {
            setStoryAvatar(childSnapshot.val()?.avatar);
            setStoryFirstName(childSnapshot.val()?.first_name);
            setStoryLastName(childSnapshot.val()?.last_name);
            setStoryId(childSnapshot.val()?.sid);
            setStoryImage(childSnapshot.val()?.image);
            setStoryTime(childSnapshot.val()?.time);
            setStoryText(childSnapshot.val()?.text);
            setStoryUID(childSnapshot.val().uid);
            if (storyTime != null) {
              const calender = Date.now();
              if (calender - childSnapshot.val()?.time > 86400000) {
                // TODO: Story Views Implementation.
                deleteCurrentStory(storyId);
              } else {
                // TODO: Some Logic to implement.
              }
            }
          }
          setLoading(false);
          if (auth()?.currentUser.uid != storyUID) {
            database()
              .ref(`/storyviews/${storyId}`)
              .once('value', snapshot => {
                setViewsData(snapshot?.val());
              })
              .finally(() => {
                console.log(viewsData);
              });
          }
          if (!Loading) {
            if (auth()?.currentUser.uid !== storyUID) {
              database().ref(`storyviews/${storyId}/${myUID}`).set({
                uid: myUID,
                sid: storyId,
              });
            }
          }
        });
      });
     */

    return () => {
      firestoreSubscribe();
    };
  }, [current]);

  if (Loading) {
    return (
      <MiniBaseView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            animating={true}
            size={'large'}
            color={COLORS.accentLight}
          />
        </View>
      </MiniBaseView>
    );
  } else {
    return (
      <MiniBaseView>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <View style={styles.left_side}>
              <TouchableRipple
                rippleColor={COLORS.rippleColor}
                borderless={false}
                onPress={() => navigation.goBack()}>
                <Avatar.Icon
                  icon={BackImage}
                  size={37.5}
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
            <View style={styles.mid_side}>
              <Avatar.Image
                size={40}
                source={{
                  uri: storyAvatar,
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  fontSize: fontValue(16),
                }}>
                <Text style={styles.toolbar_text}>
                  {storyFirstName + ' ' + storyLastName}
                </Text>
                <Text style={styles.timeText}>
                  {transformTimeForStories(storyTime)}
                </Text>
              </View>
            </View>
            {!storyText !== null || auth?.currentUser.uid !== userStoryUID ? (
              <View style={styles.right_side}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                  }}
                  onPress={() => {
                    setStoryViewsVisible(!storyViewsVisible);
                  }}>
                  <Avatar.Icon
                    icon={EyeImage}
                    size={37.5}
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
                  <Text style={styles.viewsNumber}>
                    {viewsData?.length > 0
                      ? Object?.values(viewsData)?.length
                      : '0'}
                  </Text>
                  <View style={{width: widthPercentageToDP(2.5)}} />
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                    onPress={() => setActionSheetVisible(!ActionSheetVisible)}>
                    <Avatar.Icon
                      icon={DotsImage}
                      size={37.5}
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
                  </Pressable>
                </Pressable>
              </View>
            ) : null}
          </View>
          <FlatList
            ref={storiesRef}
            pagingEnabled
            horizontal
            viewabilityConfig={viewAbilityConfig.current}
            onViewableItemsChanged={onViewableItemsChanged.current}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <ActivityIndicator
                size={'large'}
                color={COLORS.accentLight}
                animating={true}
              />
            }
            data={Object.values(allCurrentUserStories)}
            renderItem={({item}) => {
              return (
                <View style={styles.imageWrapper}>
                  <ImageBackground
                    style={styles.storyImage}
                    source={{
                      uri: item?.image,
                    }}
                  />
                  {item?.text ? (
                    <View style={styles.bandView}>
                      <Text style={styles.bandText}>{item?.text}</Text>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.footer_left}>
            <TouchableRipple
              rippleColor={COLORS.rippleColor}
              borderless={false}
              onPress={() => {
                if (current > 0) {
                  storiesRef?.current?.scrollToIndex({
                    index: current - 1,
                  });
                }
              }}>
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
            <Text style={styles.footer_text}>
              {current + 1} / {Object?.values?.(allCurrentUserStories)?.length}
            </Text>
          </View>
          <View style={styles.footer_right}>
            <TouchableRipple
              rippleColor={COLORS.rippleColor}
              borderless={false}
              onPress={() => {
                if (
                  current <
                  Object?.values?.(allCurrentUserStories)?.length - 1
                ) {
                  storiesRef?.current?.scrollToIndex({
                    index: current + 1,
                  });
                }
              }}>
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
        <StoryViewsActionSheet
          hideModal={() => {
            setStoryViewsVisible(!storyViewsVisible);
          }}
          isVisible={storyViewsVisible}
          ViewsData={viewsData}
        />
        <StoryActionSheet
          hideModal={() => {
            setActionSheetVisible(!ActionSheetVisible);
          }}
          onCopySelected={() => {
            Clipboard.setString(storyText);
          }}
          onDeleteSelected={() => {
            deleteCurrentStory(storyId).finally(() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            });
          }}
          currentStoryUID={storyUID}
          isVisible={ActionSheetVisible}
        />
      </MiniBaseView>
    );
  }
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
    flexDirection: 'row',
  },
  mid_side: {
    flexDirection: 'row',
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

    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  timeText: {
    fontSize: 14,
    paddingLeft: '2%',
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
  },
  storyImage: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(70),
    resizeMode: 'cover',
  },
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
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
  bandView: {
    width: '100%',
    padding: heightPercentageToDP(1),
    backgroundColor: '#757575',
    opacity: 0.75,
    position: 'absolute',
    bottom: heightPercentageToDP(20),
  },
  bandText: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: FONTS.regular,
  },
  viewsNumber: {
    fontSize: fontValue(15),
    opacity: 0.4,
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(StoryScreen);
