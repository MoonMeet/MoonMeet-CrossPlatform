/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {COLORS} from '../../../config/Miscellaneous';
import Modal from 'react-native-modal';
import BackImage from '../../../assets/images/back.png';
import ViewsList from './ViewsList';
import {heightPercentageToDP} from '../../../config/Dimensions';

interface StoryViewsInterface {
  hideModal: Function;
  isVisible: boolean;
  ViewsData: Array;
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
            color={'#999999'}
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
const styles = StyleSheet.create({});
export default StoryViewsActionSheet;
