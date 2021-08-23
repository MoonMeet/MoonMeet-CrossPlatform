import React from 'react';
import BaseView from '../components/BaseView/BaseView';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';

const ReportProblem = () => {
  const navigation = useNavigation();
  return (
    <BaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            borderless={false}
            rippleColor={COLORS.rippleColor}
            onPress={() => {
              navigation.goBack();
            }}>
            <Avatar.Icon
              icon={BackImage}
              size={37.5}
              color={COLORS.black}
              style={{
                overflow: 'hidden',
                marginRight: '-1%',
                opacity: 0.4,
              }}
              theme={{
                colors: {
                  primary: COLORS.transparent,
                },
              }}
            />
          </TouchableRipple>
        </View>
        <View style={styles.mid_side}>
          <Text style={styles.toolbar_text}>What happened ?</Text>
        </View>
      </View>
    </BaseView>
  );
};
const styles = StyleSheet.create({
  left_side: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mid_side: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
  },
  toolbar_text: {
    fontSize: 22,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});
export default React.memo(ReportProblem);
