import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {COLORS} from '../../../config/Miscellaneous';
import Modal from 'react-native-modal';
import BackImage from '../../../assets/images/back.png';
import ViewsList from './ViewsList';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../config/Dimensions';

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
        <ViewsList ViewData={props.ViewsData} />
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({});
export default React.memo(StoryViewsActionSheet);
