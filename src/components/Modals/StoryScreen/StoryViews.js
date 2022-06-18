import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import Modal from 'react-native-modal';
import BackImage from '../../../assets/images/back.png';

interface StoryViewsInterface {
  hideModal: Function;
  isVisible: boolean;
  ViewsData: Array;
}

const StoryViews = (props: StoryViewsInterface) => {
  return (
    <Modal
      style={{
        margin: '3%',
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
        <Text style={styles.headerText}>Privacy Policy :</Text>
        <ViewList ViewsData={props.ViewsData} />
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({});
export default React.memo(StoryViews);
