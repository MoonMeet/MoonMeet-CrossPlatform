import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {Avatar, HelperText, Switch, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';

const ActiveStatusScreen = () => {
  const navigation = useNavigation();
  const [switchState, setSwitchState] = React.useState(false);
  return (
    <MiniBaseView>
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
          <Text style={styles.toolbar_text}>Active Status</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
      <View style={styles.switchRow}>
        <Text style={styles.activeText}>Show when you're active</Text>
        <View style={{flex: 1}}>
          <Switch
            value={switchState}
            color={COLORS.accentLight}
            onValueChange={() => setSwitchState(!switchState)}
          />
        </View>
      </View>
      <View style={styles.switchRow}>
        <HelperText type={'info'} visible={true}>
          Everyone can see you when you're active, recently active and currently
          in the same chat as them. To change this, turn off the setting on
          Active Status Settings, you'll also see when anyone are active or
          recently active.
        </HelperText>
      </View>
    </MiniBaseView>
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
    marginLeft: '2.5%',
    marginRight: '2.5%',
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
  switchRow: {
    padding: '2%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeText: {
    position: 'relative',
    fontSize: 16,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(ActiveStatusScreen);
