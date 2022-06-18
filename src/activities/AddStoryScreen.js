import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {
  ActivityIndicator,
  Avatar,
  HelperText,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {heightPercentageToDP, widthPercentageToDP} from '../config/Dimensions';
import BackImage from '../assets/images/back.png';
import CameraImage from '../assets/images/photo-camera.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import DoneImage from '../assets/images/done.png';
import PickImage from '../assets/images/pick-photo.png';
import ImagePickerActionSheet from '../components/ImagePickerActionSheet/ImagePickerActionSheet';
import {openCamera, openImagePicker} from '../config/Image-Picker-Config';
import BaseView from '../components/BaseView/BaseView';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import storage from '@react-native-firebase/storage';
import getRandomString from '../utils/StringGenerator/StringGenerator';
import {paddingRight} from 'styled-system';

const AddStoryScreen = () => {
  const navigation = useNavigation();

  const [userSelection, setUserSelection] = React.useState('');

  const [hideMainScreen, setHideMainScreen] = React.useState(false);

  const [StoryTextInput, setStoryTextInput] = React.useState('');

  const onStoryTextInputChange = _storyText => setStoryTextInput(_storyText);

  const [imageVisible, setImageVisible] = React.useState(false);

  const [inputEnabledForImage, setInputEnabledForImage] = React.useState(false);

  const [SecondStoryTextInput, setSecondStoryTextInput] = React.useState('');

  const onSecondStoryTextInputChange = _secondStoryText =>
    setSecondStoryTextInput(_secondStoryText);

  const secondTextInputHasLessLength = () => {
    return StoryTextInput.length < 1;
  };

  const textInputHasLessLength = () => {
    return StoryTextInput.length < 1;
  };

  const [Firstname, setFirstname] = React.useState('');
  const [Lastname, setLastname] = React.useState('');
  const [avatarURL, setAvatarURL] = React.useState('');

  const [Loading, setLoading] = React.useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (hideMainScreen && userSelection) {
          setHideMainScreen(false);
          setUserSelection('');
          if (imageVisible) {
            setUserPhoto(null);
            setImageVisible(false);
          }
          if (StoryTextInput) {
            setStoryTextInput('');
          }
          if (inputEnabledForImage) {
            setInputEnabledForImage(false);
          }
          if (SecondStoryTextInput) {
            setSecondStoryTextInput('');
          }
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [
      SecondStoryTextInput,
      StoryTextInput,
      hideMainScreen,
      imageVisible,
      inputEnabledForImage,
      userSelection,
    ]),
  );

  function pushTextStory() {
    if (StoryTextInput.length < 1) {
      ErrorToast(
        'bottom',
        'Error sharing story',
        'If this is a text story, then it has to contain some text!',
        true,
        4000,
      );
    } else if (StoryTextInput.length > 241) {
      ErrorToast(
        'bottom',
        'Error sharing story',
        'Your text must not be longer than 240 characters',
        true,
        4000,
      );
    } else {
      setLoading(!Loading);
      const referenceKey = database()
        .ref(`/stories/${auth()?.currentUser.uid}/`)
        .push().key;

      database()
        .ref(`/stories/${auth()?.currentUser.uid}/${referenceKey}`)
        .set({
          first_name: Firstname,
          last_name: Lastname,
          avatar: avatarURL,
          time: Date.now(),
          sid: referenceKey,
          uid: auth().currentUser.uid,
          text: StoryTextInput,
        })
        .finally(() => {
          setLoading(!Loading);
          SuccessToast(
            'bottom',
            'Story shared',
            'Your story has been shared successfully.',
          );
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        });
    }
  }

  function pushImageStory() {
    if (UserPhoto) {
      setLoading(!Loading);
      let _userStoryRef = `stories/${getRandomString(
        28,
      )}.${UserPhoto.path?.substr(UserPhoto.path?.lastIndexOf('.') + 1, 3)}`;

      const storageRef = storage().ref(_userStoryRef);

      const uploadImageTask = storageRef.putFile(UserPhoto?.path);

      /**
       * Add observer to image uploading.
       */

      uploadImageTask.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot?.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`,
        );
      });

      /**
       * an async function to get {avatarUrl} and upload all user data.
       */

      uploadImageTask.then(async () => {
        const storyImageURL = await storage()
          .ref(_userStoryRef)
          .getDownloadURL();
        pushImageData(storyImageURL);
      });

      function pushImageData(storyImageURL) {
        const referenceKey = database()
          .ref(`/stories/${auth().currentUser.uid}/`)
          .push().key;

        database()
          .ref(`/stories/${auth().currentUser.uid}/${referenceKey}`)
          .set({
            first_name: Firstname,
            last_name: Lastname,
            avatar: avatarURL,
            time: Date.now(),
            sid: referenceKey,
            image: storyImageURL,
            uid: auth().currentUser.uid,
            text: SecondStoryTextInput ? SecondStoryTextInput : '',
          })
          .finally(() => {
            setLoading(!Loading);
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
            SuccessToast(
              'bottom',
              'Story shared',
              'Your story has been shared successfully.',
              true,
              4000,
            );
          });
      }
    } else {
      ErrorToast(
        'bottom',
        'Error sharing story',
        'If this is a image story, then it has to contain an image!',
        true,
        4000,
      );
    }
  }

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth().currentUser.uid}`)
      .once('value', snapshot => {
        if (
          snapshot?.val().first_name &&
          snapshot?.val().last_name &&
          snapshot?.val().avatar
        ) {
          setFirstname(snapshot?.val().first_name);
          setLastname(snapshot?.val().last_name);
          setAvatarURL(snapshot?.val().avatar);
          setLoading(false);
        }
      });
    return () => {};
  }, []);

  const [PickerActionSheet, setPickerActionSheet] = React.useState(false);

  const [UserPhoto, setUserPhoto] = React.useState(null);

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
  } else if (!hideMainScreen) {
    return (
      <MiniBaseView>
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
            <Text style={styles.toolbar_text}>Add Story</Text>
          </View>
        </View>
        <Spacer height={'2%'} />
        <View style={styles.userChoice}>
          <Pressable
            android_ripple={{color: COLORS.rippleColor, borderless: false}}
            style={styles.storyChoiceView}
            onPress={() => {
              setHideMainScreen(true);
              setUserSelection('image');
            }}>
            <Avatar.Icon
              icon={CameraImage}
              size={37.5}
              color={COLORS.accentLight}
              style={{
                overflow: 'hidden',
                marginRight: '1.5%',
              }}
              theme={{
                colors: {
                  primary: COLORS.transparent,
                },
              }}
            />
            <Text style={styles.userChoiceSubheadingText}>Image</Text>
          </Pressable>
          <Spacer height={'5%'} />
          <Pressable
            android_ripple={{color: COLORS.rippleColor, borderless: false}}
            style={styles.storyChoiceView}
            onPress={() => {
              setHideMainScreen(true);
              setUserSelection('text');
            }}>
            <Text style={styles.userChoiceHeadingText}>Aa</Text>
            <Text style={styles.userChoiceSubheadingText}>Text</Text>
          </Pressable>
        </View>
      </MiniBaseView>
    );
  } else if (userSelection === 'text') {
    return (
      <BaseView>
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
            <Text style={styles.toolbar_text}>Text Story</Text>
          </View>
          {userSelection && hideMainScreen ? (
            <View style={styles.right_side}>
              <TouchableRipple
                rippleColor={COLORS.rippleColor}
                borderless={false}
                onPress={() => {
                  pushTextStory();
                }}>
                <Avatar.Icon
                  icon={DoneImage}
                  size={36.5}
                  color={COLORS.black}
                  style={{
                    marginRight: '-1%',
                    opacity: 0.4,
                    overflow: 'hidden',
                  }}
                  theme={{
                    colors: {
                      primary: COLORS.transparent,
                    },
                  }}
                />
              </TouchableRipple>
            </View>
          ) : null}
        </View>
        <Spacer height={heightPercentageToDP(1)} />
        <View style={styles.textInputFlexedView}>
          <TextInput
            style={{
              width: '100%',
              paddingRight: '2%',
              paddingLeft: '2%',
            }}
            mode="outlined"
            label="What's on your mind?"
            multiline={true}
            maxLength={240}
            right={<TextInput.Affix text={`${StoryTextInput.length}/240`} />}
            value={StoryTextInput}
            theme={{
              colors: {
                text: COLORS.black,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={onStoryTextInputChange}
          />
          {textInputHasLessLength() ? (
            <HelperText type="info" visible={textInputHasLessLength()}>
              Story Text must be longer longer than 1 characters.
            </HelperText>
          ) : null}
        </View>
      </BaseView>
    );
  } else if (userSelection === 'image') {
    return (
      <BaseView>
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
            <Text style={styles.toolbar_text}>Image Story</Text>
          </View>

          {userSelection && hideMainScreen ? (
            <View style={styles.right_side}>
              <TouchableRipple
                rippleColor={COLORS.rippleColor}
                borderless={false}
                onPress={() => {
                  setInputEnabledForImage(!inputEnabledForImage);
                }}>
                <Text style={styles.enableText}>Aa</Text>
              </TouchableRipple>
              <TouchableRipple
                rippleColor={COLORS.rippleColor}
                borderless={false}
                onPress={() => {
                  pushImageStory();
                }}>
                <Avatar.Icon
                  icon={DoneImage}
                  size={36.5}
                  color={COLORS.black}
                  style={{
                    marginRight: '-1%',
                    opacity: 0.4,
                    overflow: 'hidden',
                  }}
                  theme={{
                    colors: {
                      primary: COLORS.transparent,
                    },
                  }}
                />
              </TouchableRipple>
            </View>
          ) : null}
        </View>
        <Spacer height={'2%'} />
        <Pressable
          onPress={() => setPickerActionSheet(true)}
          style={styles.imageInputFlexedView}>
          {UserPhoto ? (
            <Image
              style={{
                height: '80%',
                width: '99%',
                resizeMode: 'cover',
              }}
              source={{uri: UserPhoto?.path}}
            />
          ) : null}
          {!UserPhoto ? (
            <Image
              style={{
                height: 50,
                width: 50,
                tintColor: COLORS.darkGrey,
              }}
              source={PickImage}
            />
          ) : null}
        </Pressable>
        {inputEnabledForImage ? (
          <TextInput
            style={{
              width: '95%',
              alignSelf: 'center',
              paddingRight: '2%',
              paddingLeft: '2%',
            }}
            mode="outlined"
            label="What's on your mind?"
            multiline={true}
            maxLength={240}
            right={
              <TextInput.Affix text={`${SecondStoryTextInput.length}/240`} />
            }
            value={SecondStoryTextInput}
            theme={{
              colors: {
                text: COLORS.black,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={onSecondStoryTextInputChange}
          />
        ) : null}
        {secondTextInputHasLessLength() && inputEnabledForImage ? (
          <HelperText type="info" visible={textInputHasLessLength()}>
            Story Text must be longer longer than 1 characters.
          </HelperText>
        ) : null}
        <ImagePickerActionSheet
          hideModal={() => {
            setPickerActionSheet(false);
          }}
          onCameraPress={() => {
            openCamera()
              .then(async image => {
                await setUserPhoto(image);
                setImageVisible(true);
              })
              .catch(e => {
                console.log(e.toString());
              });
          }}
          onFilePicker={() => {
            openImagePicker()
              .then(async image => {
                console.log(image);
                await setUserPhoto(image);
                setImageVisible(true);
              })
              .catch(e => {
                console.log(e.toString());
              });
          }}
          isVisible={PickerActionSheet}
        />
      </BaseView>
    );
  }
};
const styles = StyleSheet.create({
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
    fontSize: 22,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  userChoice: {
    flexDirection: 'column',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingRight: '3%',
    paddingLeft: '3%',
  },
  storyChoiceView: {
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: COLORS.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
    height: '45%',
  },
  userChoiceHeadingText: {
    fontSize: 20,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    opacity: 1,
    fontFamily: FONTS.regular,
  },
  userChoiceSubheadingText: {
    fontSize: 18,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  textInputFlexedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: widthPercentageToDP(1),
    paddingRight: widthPercentageToDP(1),
  },
  imageInputFlexedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  enableText: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.accentLight,
    opacity: 1,
    fontFamily: FONTS.regular,
  },
});
export default React.memo(AddStoryScreen);
