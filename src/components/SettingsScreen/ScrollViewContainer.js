/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useRef, useMemo, useCallback} from 'react';
import {Platform, BackHandler} from 'react-native';

import DataItemTitle from './DataItemTitle';
import DataItem from './DataItem';
import DataItemCustom from './DataItemCustom';

import EditIcon from '../../assets/images/create.png';
import DarkModeIcon from '../../assets/images/dark_mode.png';
import PassCodeIcon from '../../assets/images/pin.png';
import LogoutIcon from '../../assets/images/logout.png';
import PrivacyIcon from '../../assets/images/lock.png';
import NotificationsIcon from '../../assets/images/notifications.png';
import MessageIcon from '../../assets/images/chat.png';
import PriPoIcon from '../../assets/images/verified_shield.png';
import DevicesIcon from '../../assets/images/devices.png';
import UsernameIcon from '../../assets/images/email.png';
import ActiveStatusIcon from '../../assets/images/hdr.png';
import FAQIcon from '../../assets/images/quiz.png';
import ReportIcon from '../../assets/images/bug.png';

import {COLORS} from '../../config/Miscellaneous';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import PrivacyPolicy from '../Modals/PrivacyPolicy/PrivacyPolicy';
import FrequentlyAskedQuestions from '../Modals/FrequentlyAskedQuestions/FrequentlyAskedQuestions';

import Clipboard from '@react-native-clipboard/clipboard';
import {
  ErrorToast,
  InfoToast,
  SuccessToast,
} from '../ToastInitializer/ToastInitializer';
import {Button, Dialog, Divider, Paragraph, Portal} from 'react-native-paper';
import {ThemeContext} from '../../config/Theme/Context';
import {ThemeMMKV} from '../../config/MMKV/ThemeMMKV';
import {fontValue} from '../../config/Dimensions';
import notifee from '@notifee/react-native';

interface ScrollViewContainerInterface {
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
  avatar?: string | undefined;
  activeStatus?: string | undefined;
  activeTime?: any;
}

const ScrollViewContainer = (props: ScrollViewContainerInterface) => {
  const privacyRef = useRef(null);
  const faqRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['80%', '100%'], []);

  const DevicesScreen = Platform.select({
    ios: () => (
      <DataItem
        leftIcon={DevicesIcon}
        leftIconColor={COLORS.amazingPurple}
        titleTextContainer={'Devices'}
        onPressTrigger={() => navigation?.navigate('devices')}
      />
    ),
    android: () => (
      <DataItem
        leftIcon={DevicesIcon}
        leftIconColor={COLORS.amazingPurple}
        titleTextContainer={'Devices'}
        onPressTrigger={() => navigation?.navigate('devices')}
      />
    ),
    default: () => undefined,
  });

  const handlePresentPrivacyModal = useCallback(() => {
    faqRef?.current?.forceClose();
    privacyRef?.current?.present();
  }, []);

  const handlePresentFaqModal = useCallback(() => {
    privacyRef?.current?.forceClose();
    faqRef?.current?.present();
  }, []);

  const navigation = useNavigation();

  const {isThemeDark} = React.useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation?.canGoBack()) {
          navigation?.goBack();
        }
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const [LogoutDialogVisivle, setLogoutDialogVisible] = React.useState(false);

  return (
    <>
      <Portal>
        <Dialog
          dismissable={true}
          visible={LogoutDialogVisivle}
          onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Icon size={30} icon={'account-alert'} />
          <Dialog.Title
            style={{
              textAlign: 'center',
              color: isThemeDark ? COLORS.white : COLORS.black,
              opacity: 0.9,
            }}>
            Logout
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph
              adjustsFontSizeToFit
              style={{
                fontSize: fontValue(14),
                color: isThemeDark ? COLORS.white : COLORS.black,
                opacity: isThemeDark ? 0.8 : 0.6,
                textAlign: 'center',
              }}>
              Are you sure you want to log out ?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={{alignSelf: 'center'}}>
            <Button
              uppercase={false}
              mode={'outlined'}
              textColor={
                isThemeDark ? COLORS.redDarkError : COLORS.redLightError
              }
              style={{margin: '0.5%'}}
              onPress={() => {
                try {
                  auth()
                    ?.signOut()
                    .then(() => {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 3,
                          routes: [
                            {name: 'login'},
                            {name: 'setup'},
                            {name: 'home'},
                          ],
                        }),
                      );
                      navigation?.navigate('login');
                    });
                } catch (e) {
                  if (__DEV__) {
                    console?.error(e);
                  }
                }
                setLogoutDialogVisible(false);
              }}>
              Log out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <DataItemTitle titleItem={'Miscellaneous'} />
      <DataItemCustom
        leftIcon={DarkModeIcon}
        leftIconColor={COLORS.black}
        titleTextContainer={'Dark mode'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={isThemeDark ? COLORS.white : COLORS.black}
        enableDescription={true}
        descriptionText={
          ThemeMMKV.getBoolean('isThemeDark') === true ? 'On' : 'Off'
        }
        descriptionColor={isThemeDark ? COLORS.white : COLORS.black}
        descriptionOpacity={0.4}
        onPressTrigger={() => {
          if (__DEV__) {
            navigation?.navigate('darkMode');
          } else {
            InfoToast(
              'bottom',
              'Feature will be available soon',
              'stay tuned for Moon Meet new updates.',
              true,
              2000,
            );
          }
        }}
        onLongPressTrigger={null}
      />
      <DataItemTitle titleItem={'Account'} />
      <DataItem
        leftIcon={EditIcon}
        leftIconColor={COLORS.purple}
        titleTextContainer={'Edit profile'}
        onPressTrigger={() => {
          navigation.navigate('editProfile');
        }}
      />
      <Divider />
      <DataItem
        leftIcon={PassCodeIcon}
        leftIconColor={COLORS.green}
        titleTextContainer={'Setup passcode'}
        onPressTrigger={() => {
          if (__DEV__) {
            navigation.navigate('passcodeSetup');
          } else {
            InfoToast(
              'bottom',
              'Feature will be available soon',
              'stay tuned for Moon Meet new updates.',
              true,
              2000,
            );
          }
        }}
      />
      <Divider />
      <DataItem
        leftIcon={PrivacyIcon}
        leftIconColor={COLORS.orange}
        titleTextContainer={'Privacy and Security'}
        onPressTrigger={() => {
          navigation?.navigate('privacySecurity');
        }}
      />
      <Divider />
      <DataItem
        leftIcon={LogoutIcon}
        leftIconColor={COLORS.redLightError}
        titleTextContainer={'Log out'}
        onPressTrigger={() => setLogoutDialogVisible(true)}
      />
      <Divider />
      <DataItemTitle titleItem={'Profile'} />
      <DataItemCustom
        leftIcon={ActiveStatusIcon}
        leftIconColor={COLORS.green}
        titleTextContainer={'Active Status'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={isThemeDark ? COLORS.white : COLORS.black}
        enableDescription={true}
        descriptionText={props?.activeStatus === 'recently' ? 'Off' : 'On'}
        descriptionColor={isThemeDark ? COLORS.white : COLORS.black}
        onPressTrigger={() => {
          navigation?.navigate('activeStatus');
        }}
        onLongPressTrigger={null}
      />
      <Divider />
      <DataItemCustom
        leftIcon={UsernameIcon}
        leftIconColor={COLORS.redDarkError}
        titleTextContainer={'Username'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={isThemeDark ? COLORS.white : COLORS.black}
        enableDescription={true}
        descriptionText={props?.username}
        descriptionColor={isThemeDark ? COLORS.white : COLORS.black}
        onPressTrigger={() => navigation?.navigate('changeUsername')}
        onLongPressTrigger={() => {
          try {
            Clipboard?.setString(props?.username);
            SuccessToast(
              'bottom',
              'Copied!',
              'Your username is copied successfully to Clipboard',
              true,
              3000,
            );
          } catch (e) {
            ErrorToast(
              'bottom',
              'Error Copying!',
              'An error occurred when copying your username',
              true,
              3000,
            );
          }
        }}
      />
      <Divider />
      <DataItemTitle titleItem={'Settings'} />
      <DataItem
        leftIcon={NotificationsIcon}
        leftIconColor={COLORS.yellowDarkWarning}
        titleTextContainer={'Notifications Settings'}
        onPressTrigger={async () => {
          await notifee.openNotificationSettings();
        }}
      />
      <Divider />
      <DataItem
        leftIcon={MessageIcon}
        leftIconColor={COLORS.blue_second}
        titleTextContainer={'Chat Settings'}
        onPressTrigger={() => {
          if (__DEV__) {
            navigation?.navigate('chatSettings');
          } else {
            InfoToast(
              'bottom',
              'Feature will be available soon',
              'stay tuned for Moon Meet new updates.',
              true,
              2000,
            );
          }
        }}
      />
      <Divider />
      <DevicesScreen />
      <Divider />
      <DataItemTitle titleItem={'Help'} />
      <DataItem
        leftIcon={PriPoIcon}
        leftIconColor={COLORS.maroon}
        titleTextContainer={'Privacy Policy'}
        onPressTrigger={() => {
          handlePresentPrivacyModal();
        }}
      />
      <Divider />
      <DataItem
        leftIcon={FAQIcon}
        leftIconColor={COLORS.pink}
        titleTextContainer={'Frequently asked questions'}
        onPressTrigger={() => handlePresentFaqModal()}
      />
      <Divider />
      <DataItem
        leftIcon={ReportIcon}
        leftIconColor={COLORS.accentLight}
        titleTextContainer={'Report technical problem'}
        onPressTrigger={() => {
          navigation?.navigate('bugreport');
        }}
      />
      <Divider />
      <PrivacyPolicy
        sheetRef={privacyRef}
        index={0}
        snapPoints={sheetSnapPoints}
      />
      <FrequentlyAskedQuestions
        sheetRef={faqRef}
        index={0}
        snapPoints={sheetSnapPoints}
      />
    </>
  );
};

export default ScrollViewContainer;
