import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ActivityIndicator, Avatar, TouchableRipple} from 'react-native-paper';
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
import DevicesList from '../components/DevicesScreen/DevicesList';
import {isWeb, isWindows} from '../utils/device/DeviceInfo';

const DevicesScreen = () => {
  const navigation = useNavigation();

  const [masterData, setMasterData] = React.useState([]);

  const [Loading, setLoading] = React.useState(true);

  let newJwtKey = uuidv4();

  useEffect(() => {
    const onValueChange = database()
      .ref(`/devices/${auth()?.currentUser.uid}/`)
      .on('value', snapshot => {
        const devicesSnapshot = [];
        snapshot?.forEach(childSnapshot => {
          if (
            childSnapshot?.val().app_version &&
            childSnapshot?.val().manufacturer &&
            childSnapshot?.val().model &&
            childSnapshot?.val().product &&
            childSnapshot?.val().system_version &&
            childSnapshot?.val().system_name &&
            childSnapshot?.val().time
          ) {
            devicesSnapshot.push({
              app_version: childSnapshot?.val().app_version,
              manufacturer: childSnapshot?.val().manufacturer,
              model: childSnapshot?.val().model,
              product: childSnapshot?.val().product,
              system_version: childSnapshot?.val().system_version,
              system_name: childSnapshot?.val().system_name,
              time: childSnapshot?.val().time,
            });
          }
        });
        setMasterData(devicesSnapshot);
        setLoading(false);
      });
    return () => {
      database()
        .ref(`/devices/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
    };
  }, []);

  /**
   * Copied from LoginScreen.js, needed to resend current logged in device
   * after terminating all sessions from the user account.
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

  const resendCurrentDevice = async () => {
    if (!isWindows && !isWeb) {
      await database()
        .ref(`/devices/${auth()?.currentUser.uid}`)
        .remove()
        .finally(() => {
          const referenceKey = database()
            .ref(`/devices/${auth()?.currentUser.uid}`)
            .push().key;

          database()
            .ref(`/devices/${auth()?.currentUser.uid}/${referenceKey}`)
            .set({
              manufacturer: Manufacturer,
              system_name: systemName,
              system_version: systemVersion,
              product: Product,
              model: Model,
              app_version: appVersion,
              time: Date.now(),
            })
            .catch(error => {
              console.error(error);
            });
        });
    }
  };

  if (Loading) {
    return (
      <MiniBaseView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            animating={true}
            size={'large'}
            color={COLORS.accentLight}
          />
        </View>
      </MiniBaseView>
    );
  }

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
          <Text style={styles.underHeaderMediumText}>
            {Manufacturer + ' ' + Model}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={styles.underHeaderSmallText}>Online</Text>
        </View>
      </View>
      <View style={styles.terminateView}>
        <Text
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
            await resendCurrentDevice();
          }}
          style={styles.headingTerminate}>
          Terminate All Other Sessions
        </Text>
        <Text style={styles.subheadingTerminate}>
          Log out all devices except for this one.
        </Text>
      </View>
      <Spacer height={'3%'} />
      <Text style={styles.miniHeaderText}>Active sessions</Text>
      <DevicesList
        ListData={masterData}
        onPressTrigger={null}
        onLongPressTrigger={null}
      />
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
    paddingTop: '3%',
    textAlign: 'left',
    fontSize: 16,
    color: COLORS.black,
    opacity: 0.4,
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
  terminateView: {
    flexDirection: 'column',
  },
  headingTerminate: {
    fontSize: 18,
    paddingLeft: '3%',
    textAlign: 'left',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  subheadingTerminate: {
    fontSize: 14,
    paddingLeft: '3%',
    paddingTop: '2%',
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});
export default React.memo(DevicesScreen);
