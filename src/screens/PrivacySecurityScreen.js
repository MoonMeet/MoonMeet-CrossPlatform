import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import ViewItem from '../components/PrivacySecurityScreen/ViewItem';
import ViewItemTitle from '../components/PrivacySecurityScreen/ViewItemTitle';
import Spacer from '../components/Spacer/Spacer';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';

const PrivacySecurityScreen = () => {
  return (
    <BaseView>
      <Pressable style={{flex: 1}} onPress={() => {}}>
        <Spacer height={heightPercentageToDP(0.25)} />
        <ViewItemTitle titleItem="Privacy" />
        <ViewItem titleText={'Still in progress'} />
      </Pressable>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default PrivacySecurityScreen;
