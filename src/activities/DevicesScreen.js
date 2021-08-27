import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {Avatar, TouchableRipple} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const DevicesScreen = () => {
  const navigation = useNavigation();

  const [masterData, setMasterData] = React.useState([]);

  useEffect(() => {
    const referenceKey = database().ref('/users').push();
    console.log(referenceKey.key);
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser.uid}/`)
      .on('value', snapshot => {
        setMasterData(snapshot?.val());
      });
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
    };
  }, []);

  return (
    <MiniBaseView>
      <View style={styles.toolbar}>
        <View style={styles.left_side}>
          <TouchableRipple
            rippleColor={COLORS.rippleColor}
            borderless={false}
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
          <Text style={styles.toolbar_text}>Devices</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
    </MiniBaseView>
  );
};
const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});
export default React.memo(DevicesScreen);
