import React from 'react';
import Modal from 'react-native-modal';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import {IconButton} from 'react-native-paper';
import BackImage from '../../../assets/images/back.png';

interface FAQInterface {
  isVisible: boolean;
  hideModal: Function;
}
const FrequentlyAskedQuestions = (props: FAQInterface) => {
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
        <Text style={styles.headerText}>Frequently Asked Questions :</Text>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subText}>Q&A 1: What is Moon Meet?</Text>
          <Text style={styles.subText}>
            Moon Meet is an instant messaging application that gives you a good
            access to connect with friends, Make relationships, Share Stories...
          </Text>
          <Text style={styles.subText}>Q&A 2: Who it is for ?</Text>
          <Text style={styles.subText}>
            Moon Meet is allowed for everyone who wanna chat and make new
            Relationships and new Friends.
          </Text>
          <Text style={styles.subText}>Q&A 3: Why Moon Meet?</Text>
          <Text style={styles.subText}>
            Of course it's your choice to use our application and our special
            platform.
          </Text>
          <Text style={styles.subText}>Q&A: How i can get Moon Meet ?</Text>
          <Text style={styles.subText}>
            You can get Moon Meet by downloading the app from Play Store or
            AppStore.
          </Text>
          <Text style={styles.subText}>
            Q&A 5: does Moon Meet has end-to-end Encryption ?
          </Text>
          <Text style={styles.subText}>
            In future, Yes, we are working on a full end-to-end Encryption.
          </Text>
          <Text style={styles.subText}>
            Q&A 6: Is my information changeable ?
          </Text>
          <Text style={styles.subText}>
            Sure, You can change your information at any time.
          </Text>
          <Text style={styles.subText}>Q&A 7: Can i delete my account ?</Text>
          <Text style={styles.subText}>
            Yes, You can delete your Moon Meet account at anytime.
          </Text>
          <Text style={styles.subText}>Q&A 8: Who can see me online ?</Text>
          <Text style={styles.subText}>
            By default, your active status is visible to everyone. You can hide your online status from the settings anytime
          </Text>
          <Text style={styles.subText}>Q&A 9: Who is Behind Moon Meet ?</Text>
          <Text style={styles.subText}>
            Behind Moon Meet, There is Rayen Sbai (CO, Founder) and We don't
            forget our GitHub Contributors.
          </Text>
          <Text style={styles.subText}>Q&A 10: Can i report a problem ?</Text>
          <Text style={styles.subText}>
            Sure, Reporting bugs or problems is the duty of everyone on our
            platform.
          </Text>
          <Text style={styles.subText}>
            Q&A 11: Can i help improve this Platform ?
          </Text>
          <Text style={styles.subText}>
            Yes, If you have some good ideas you can share it with us and be one
            of the contributors.
          </Text>
          <Text style={styles.subText}>Q&A 12 : Who can see my profile ? </Text>
          <Text style={styles.subText}>
            Everyone on the platform can see your profile, but he cannot see
            your phone number or your online status if you disable them in
            Settings
          </Text>
          <Text style={styles.subText}>
            Q&A 13: Which information can Moon Meet gather about me ?
          </Text>
          <Text style={styles.subText}>
            Moon Meet collects public information about you like First Name,
            Last Name, Birth Date, Username, Bio, in shortly, the information
            that you enter while and after doing the registration.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  headerText: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: 20,
    padding: 8,
    textAlign: 'left',
  },
  subText: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: 18,
    padding: 8,
    opacity: 0.6,
    textAlign: 'left',
  },
  lastUpdate: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: 18,
    padding: 8,
    opacity: 0.4,
    textAlign: 'left',
  },
});

export default React.memo(FrequentlyAskedQuestions);
