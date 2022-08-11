import React, {useRef} from 'react';
import BaseView from '../components/BaseView/BaseView';
import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {FAB, HelperText, TextInput, Chip, Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import ArrowForward from '../assets/images/arrow-forward.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {
  SuccessToast,
  ErrorToast,
} from '../components/ToastInitializer/ToastInitializer';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import PhotoCamera from '../assets/images/pick-photo.png';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedRef,
} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import RemoveIcon from '../assets/images/clear.png';
import getRandomString from '../utils/generators/getRandomString';

const ReportProblemScreen = () => {
  const AnimatedFAB = Animated.createAnimatedComponent(FAB);
  const AnimatedFABRef = useAnimatedRef();

  const navigation = useNavigation();

  const translateY = useSharedValue(0);

  const animateFab = () => {
    translateY.value = withDelay(
      30,
      withTiming(1500, {duration: 400}, isFinished => {
        if (isFinished) {
          translateY.value = withDelay(1500, withTiming(0, {duration: 400}));
        }
      }),
    );
  };

  const fabAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  }, []);

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });
  const [ReportText, setReportText] = React.useState('');

  const [loaderVisible, setLoaderVisible] = React.useState(false);

  const onReportTextChange = _reportText => setReportText(_reportText);
  const [UserPhoto, setUserPhoto] = React.useState(null);

  function pushReport(type) {
    setLoaderVisible(true);
    switch (type) {
      case 'text':
        {
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .collection('reports')
            .add({
              report_message: ReportText,
              time: Date.now(),
            })
            .finally(() => {
              SuccessToast(
                'bottom',
                'Report Delivered',
                'Thank you for reporting bugs to Moon Meet Team.',
                true,
                2000,
              );
              setLoaderVisible(false);
              navigation.goBack();
            })
            .catch(error => {
              ErrorToast(
                'bottom',
                'Reporting Failed',
                'An error occurred while sending your report.',
                true,
                2000,
              );
              setLoaderVisible(false);
              navigation?.goBack();
            });
        }
        break;
      case 'image':
        {
          let reportImageRef = `reports/image/${getRandomString(
            10,
          )}.${UserPhoto?.path?.substr(
            UserPhoto.path?.lastIndexOf('.') + 1,
            3,
          )}`;

          const storageRef = storage().ref(reportImageRef);

          /**
           * Uploading image to Firebase Storage
           * @type {FirebaseStorageTypes.Task}
           */

          const uploadImageTask = storageRef.putFile(UserPhoto?.path);

          /**
           * an async function to get {avatarUrl} and upload all user data.
           */
          uploadImageTask.then(async () => {
            const image = await storage().ref(reportImageRef).getDownloadURL();
            firestore()
              .collection('users')
              .doc(auth()?.currentUser?.uid)
              .collection('reports')
              .add({
                report_message: ReportText,
                image: image,
                time: Date.now(),
              })
              .finally(() => {
                SuccessToast(
                  'bottom',
                  'Report Delivered',
                  'Thank you for reporting bugs to Moon Meet Team.',
                  true,
                  2000,
                );
                setLoaderVisible(false);
                navigation.goBack();
              })
              .catch(error => {
                ErrorToast(
                  'bottom',
                  'Reporting Failed',
                  'An error occurred while sending your report.',
                  true,
                  2000,
                );
                setLoaderVisible(false);
                navigation?.goBack();
              });
          });
        }
        break;
      default:
        break;
    }
  }

  const hasMoreLength = () => {
    return ReportText.length > 240;
  };

  const hasLessLength = () => {
    return ReportText.length < 19;
  };

  return (
    <BaseView>
      <Spacer height={heightPercentageToDP(0.5)} />
      <Text style={styles.bugInfo}>
        We will need to help as soon as you describe the problem in the
        paragraphs bellow
      </Text>
      <View style={{paddingRight: '2%', paddingLeft: '2%'}}>
        <TextInput
          style={{
            width: '100%',
          }}
          mode="outlined"
          label="Report a problem"
          multiline={true}
          value={ReportText}
          placeholder={
            'Breifly explain what happened and what we need to do to reprrduce the problem.'
          }
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
          onChangeText={onReportTextChange}
        />
      </View>
      {hasMoreLength() ? (
        <HelperText type="error" visible={hasMoreLength()}>
          Report message must be less than 240 characters.
        </HelperText>
      ) : (
        <HelperText type="info" visible={hasLessLength()}>
          Report message must be longer than 20 characters.
        </HelperText>
      )}
      <View style={styles.attachView}>
        {UserPhoto ? (
          <>
            <Image
              source={{uri: UserPhoto?.path}}
              style={{
                marginTop: heightPercentageToDP(0.5),
                height: heightPercentageToDP(40),
                width: widthPercentageToDP(40),
                borderRadius: 8,
                resizeMode: 'cover',
                overflow: 'hidden',
              }}
            />
            <Pressable
              style={{
                position: 'relative',
                marginTop: heightPercentageToDP(-39.65),
                marginLeft: widthPercentageToDP(30.85),
              }}
              onPress={() => setUserPhoto(null)}>
              <Avatar.Icon
                size={30}
                icon={RemoveIcon}
                color={COLORS.black}
                style={{
                  overflow: 'hidden',
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            </Pressable>
          </>
        ) : (
          <Chip
            icon={PhotoCamera}
            mode={'outlined'}
            style={{width: widthPercentageToDP(30)}}
            selectedColor={COLORS.black}
            onPress={() => {
              ImagePicker.openPicker({
                width: 550,
                height: 650,
                cropping: false,
                mediaType: 'photo',
              })
                .then(image => {
                  setUserPhoto(image);
                })
                .catch(error => console.error(error));
            }}>
            Attach Photo
          </Chip>
        )}
      </View>
      <AnimatedFAB
        ref={ref => (AnimatedFABRef.current = ref)}
        style={[styles.fab, fabAnimation]}
        normal
        icon={ArrowForward}
        color={COLORS.primaryLight}
        animated={true}
        theme={{
          colors: {
            accent: COLORS.accentLight,
          },
        }}
        onPress={() => {
          if (isConnected) {
            if (!hasMoreLength() && !hasLessLength()) {
              pushReport(UserPhoto?.path ? 'image' : 'text');
            } else {
              animateFab();
              ErrorToast(
                'bottom',
                'Invalid report message',
                'Report message must be between 20 and 240 characters.',
                true,
                2000,
              );
            }
          } else {
            animateFab();
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to send bug reports.',
              true,
              2000,
            );
          }
        }}
      />
      <LoadingIndicator isVisible={loaderVisible} />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  bugInfo: {
    position: 'relative',
    fontSize: fontValue(16),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  attachView: {
    paddingTop: heightPercentageToDP(0.5),
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16 - 0.1 * 16,
    right: 0,
    bottom: 0,
  },
});

export default ReportProblemScreen;
