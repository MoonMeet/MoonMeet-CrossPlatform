/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import BaseView from '../components/BaseView/BaseView';
import {
  Image as ImageView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, Chip, FAB, HelperText, TextInput} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/Dimensions';
import storage from '@react-native-firebase/storage';
import {getRandomString} from '../utils/generators/getRandomString';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScreenWidth} from '../utils/device/DeviceInfo';
import {RemoveIcon} from 'index.d';
import ImagePicker, {Image} from 'react-native-image-crop-picker';

const ReportProblemScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected: Promise<boolean> = NetInfo.fetch().then(
    networkState => networkState?.isConnected ?? false,
  );
  const [ReportText, setReportText] = React.useState('');

  const [loaderVisible, setLoaderVisible] = React.useState(false);

  const onReportTextChange = (reportText: string) => setReportText(reportText);
  const [UserPhoto, setUserPhoto] = React.useState<Image | null>(null);

  function pushReport(type: string) {
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
                error.toString(),
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
          // TODO: substr to substring
          let reportImageRef = `reports/image/${getRandomString(
            10,
          )}.${UserPhoto?.path?.substring(
            UserPhoto.path?.lastIndexOf('.') + 1,
            3,
          )}`;

          const storageRef = storage().ref(reportImageRef);

          const uploadImageTask = storageRef.putFile(UserPhoto?.path as string);

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
                  error.toString(),
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
            'Briefly explain what happened and what we need to do to reproduce the problem.'
          }
          theme={{
            colors: {
              primary: COLORS.accentLight,
              onSurface: COLORS.black,
              background: COLORS.dimmed,
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
            <ImageView
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
            icon={'image-plus'}
            mode={'outlined'}
            style={{height: ScreenWidth / 10}}
            selectedColor={COLORS.black}
            theme={{
              colors: {
                primary: COLORS.darkGrey,
                surface: COLORS.white,
              },
            }}
            textStyle={{color: COLORS.darkGrey}}
            onPress={() => {
              ImagePicker.openPicker({
                width: 1024,
                height: 1024,
                cropping: false,
                mediaType: 'photo',
              })
                .then(image => {
                  setUserPhoto(image);
                })
                .catch(error => {
                  if (__DEV__) {
                    console.error(error);
                  }
                });
            }}>
            Attach Photo
          </Chip>
        )}
      </View>
      <FAB
        style={styles.fab}
        mode={'elevated'}
        size={'medium'}
        icon={({size, allowFontScaling}) => (
          <MaterialIcons
            name="chevron-right"
            color={COLORS.white}
            size={size}
            allowFontScaling={allowFontScaling}
          />
        )}
        animated={true}
        theme={{
          colors: {
            primaryContainer: COLORS.accentLight,
          },
        }}
        onPress={async () => {
          if (await isConnected) {
            if (!hasMoreLength() && !hasLessLength()) {
              pushReport(UserPhoto?.path ? 'image' : 'text');
            } else {
              ErrorToast(
                'bottom',
                'Invalid report message',
                'Report message must be between 20 and 240 characters.',
                true,
                2000,
              );
            }
          } else {
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
