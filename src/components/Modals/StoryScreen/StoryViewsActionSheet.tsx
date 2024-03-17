/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {Modal, SafeAreaView, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {COLORS} from 'config/Miscellaneous.ts';
import ViewsList from './ViewsList';
import {heightPercentageToDP} from 'config/Dimensions.ts';
import {BackImage} from 'index.d';

interface User {
  uid: string;
  first_name: string;
  last_name: string;
}

interface StoryViewsInterface {
  hideModal: Function;
  isVisible: boolean;
  ViewsData: Record<string, User>;
}

const StoryViewsActionSheet = (props: StoryViewsInterface) => {
  return (
    <Modal
      style={{
        margin: heightPercentageToDP(0.5),
      }}
      animationType={'slide'}
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.hideModal();
      }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryLight,
        }}>
        <View
          style={{
            alignItems: 'flex-start',
          }}>
          <IconButton
            icon={BackImage}
            iconColor={'#999999'}
            size={24}
            onPress={() => {
              props.hideModal();
            }}
          />
        </View>
        <ViewsList ViewsData={props.ViewsData} />
      </SafeAreaView>
    </Modal>
  );
};
export default StoryViewsActionSheet;
