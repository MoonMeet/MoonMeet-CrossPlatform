import React from 'react';
import {View} from 'react-native';
import DataItemTitle from './DataItemTitle';
import DataItem from './DataItem';

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
import DataItemCustom from './DataItemCustom';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ScrollViewContainer = () => {
  const navigation = useNavigation();
  return (
    <View>
      <DataItemTitle titleItem={'Miscellaneous'} />
      <DataItemCustom
        leftIcon={DarkModeIcon}
        leftIconColor={COLORS.black}
        titleTextContainer={'Dark mode'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={COLORS.black}
        enableDescription={true}
        descriptionText={'System'}
        descriptionColor={COLORS.black}
        onPressTrigger={null}
      />
      <DataItemTitle titleItem={'Account'} />
      <DataItem
        leftIcon={EditIcon}
        leftIconColor={COLORS.purple}
        titleTextContainer={'Edit profile'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={PassCodeIcon}
        leftIconColor={COLORS.green}
        titleTextContainer={'Setup passcode'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={PrivacyIcon}
        leftIconColor={COLORS.orange}
        titleTextContainer={'Privacy and Security'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={LogoutIcon}
        leftIconColor={COLORS.redLightError}
        titleTextContainer={'Log out'}
        onPressTrigger={() => {
          try {
            auth()
              ?.signOut()
              .then(() => {
                navigation.navigate('login');
              });
          } catch (e) {
            console.log(e);
          }
        }}
      />
      <DataItemTitle titleItem={'Profile'} />
      <DataItemCustom
        leftIcon={ActiveStatusIcon}
        leftIconColor={COLORS.green}
        titleTextContainer={'Active Status'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={COLORS.black}
        enableDescription={true}
        descriptionText={'Online now'}
        descriptionColor={COLORS.black}
        onPressTrigger={null}
      />
      <DataItemCustom
        leftIcon={UsernameIcon}
        leftIconColor={COLORS.redDarkError}
        titleTextContainer={'Username'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={COLORS.black}
        enableDescription={true}
        descriptionText={'MoonMeet.me/JohnnyK1920'}
        descriptionColor={COLORS.black}
        onPressTrigger={null}
      />
      <DataItemTitle titleItem={'Settings'} />
      <DataItem
        leftIcon={NotificationsIcon}
        leftIconColor={COLORS.yellowDarkWarning}
        titleTextContainer={'Notifications Settings'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={MessageIcon}
        leftIconColor={COLORS.blue_second}
        titleTextContainer={'Chat Settings'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={DevicesIcon}
        leftIconColor={COLORS.amazingPurple}
        titleTextContainer={'Chat Settings'}
        onPressTrigger={null}
      />
      <DataItemTitle titleItem={'Help'} />
      <DataItem
        leftIcon={PriPoIcon}
        leftIconColor={COLORS.maroon}
        titleTextContainer={'Privacy and Policy'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={FAQIcon}
        leftIconColor={COLORS.pink}
        titleTextContainer={'Frequently asked questions'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={ReportIcon}
        leftIconColor={COLORS.accentLight}
        titleTextContainer={'Report technical problem'}
        onPressTrigger={null}
      />
    </View>
  );
};

export default React.memo(ScrollViewContainer);
