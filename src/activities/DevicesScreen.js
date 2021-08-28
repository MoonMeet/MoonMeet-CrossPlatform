import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {Avatar, TouchableRipple} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  getManufacturer,
  getModel,
  getProduct,
  getSystemName,
  getSystemVersion,
  getVersion,
} from 'react-native-device-info';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';

const DevicesScreen = () => {
  const navigation = useNavigation();

  const [masterData, setMasterData] = React.useState([]);

  let newJwtKey = uuidv4();

  useEffect(() => {
    const onValueChange = database()
      .ref(`/devices/${auth()?.currentUser.uid}/`)
      .on('value', snapshot => {
        setMasterData(snapshot?.val());
      });
    return () => {
      database()
        .ref(`/devices/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
    };
  }, []);

  /**
   * Used for getting Device Information.
   */

  const [systemName, setSystemName] = React.useState(getSystemName());
  const [systemVersion, setSystemVersion] = React.useState(getSystemVersion());
  const [Manufacturer, setManufacturer] = React.useState(
    getManufacturer().then(manufacturer => {
      setManufacturer(manufacturer);
    }),
  );
  const [Product, setProduct] = React.useState(
    getProduct().then(product => {
      setProduct(product);
    }),
  );
  const [Model, setModel] = React.useState(getModel());
  const [appVersion, setAppVersion] = React.useState(getVersion());

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
      <Text style={styles.miniHeaderText}>This device</Text>
      <View style={styles.under_header}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.underHeaderBigText}>
            {'Moon Meet' + ' ' + systemName + ' ' + appVersion}
          </Text>
          <Spacer height={'2%'} />
          <Text style={styles.underHeaderMediumText}>
            {Manufacturer + ' ' + Model}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text
            style={styles.underHeaderSmallText}
            onPress={async () => {
              await AsyncStorage.setItem('currentUserJwtKey', newJwtKey).then(
                () => {
                  database()
                    .ref(`/users/${auth().currentUser.uid}`)
                    .update({
                      jwtKey: newJwtKey,
                    })
                    .catch(error => console.log(error));
                },
              );
            }}>
            Online
          </Text>
        </View>
      </View>
    </MiniBaseView>
  );
};
const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    flexDirection: 'row',
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
  miniHeaderText: {
    fontSize: 16,
    paddingLeft: '3%',
    textAlign: 'left',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  underHeaderBigText: {
    paddingLeft: '1.5%',
    textAlign: 'left',
    fontSize: 18,
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  underHeaderMediumText: {
    paddingLeft: '3.5%',
    textAlign: 'left',
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  underHeaderSmallText: {
    fontSize: 14,
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
});
export default React.memo(DevicesScreen);
