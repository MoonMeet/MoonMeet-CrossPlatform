/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {reverse, sortBy} from 'lodash';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  getManufacturer,
  getModel,
  getProduct,
  getSystemName,
  getSystemVersion,
  getVersion,
} from 'react-native-device-info';
import {ActivityIndicator} from 'react-native-paper';
import {v4 as uuidv4} from 'uuid';
import DevicesList from '../components/DevicesScreen/DevicesList';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView.tsx';
import Spacer from '../components/Spacer/Spacer';
import {ErrorToast} from '../components/ToastInitializer/ToastInitializer';
import {heightPercentageToDP, widthPercentageToDP} from '../config/Dimensions';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {StorageInstance} from 'config/MMKV/StorageInstance.ts';
import {isWeb, isWindows} from '../utils/device/DeviceInfo';

const DevicesScreen = () => {
  const [masterData, setMasterData] = React.useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const [Loading, setLoading] = React.useState<boolean>(true);

  let newJwtKey = uuidv4();

  useEffect(() => {
    const deviceSubscribe = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .collection('devices')
      .onSnapshot(collectionSnapshot => {
        const devicesSnapshot: FirebaseFirestoreTypes.DocumentData[] = [];
        collectionSnapshot?.forEach(
          (childSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            if (
              childSnapshot?.data()?.app_version &&
              childSnapshot?.data()?.manufacturer &&
              childSnapshot?.data()?.model &&
              childSnapshot?.data()?.product &&
              childSnapshot?.data()?.system_version &&
              childSnapshot?.data()?.system_name &&
              childSnapshot?.data()?.time
            ) {
              devicesSnapshot.push(
                childSnapshot?.data() as FirebaseFirestoreTypes.DocumentData,
              );
            }
          },
        );
        setMasterData(
          reverse(sortBy(devicesSnapshot, [data => data?.time?.toDate()])),
        );
        setLoading(false);
      });
    return () => {
      deviceSubscribe();
    };
  }, []);

  /**
   * Copied from LoginScreen.tsx, needed to resend current logged in device
   * after terminating all sessions from the user account.
   */
  const [systemName, setSystemName] = React.useState<string>('');
  const [systemVersion, setSystemVersion] = React.useState<string>('');
  const [Manufacturer, setManufacturer] = React.useState<string>('');
  const [Product, setProduct] = React.useState<string>('');
  const [Model, setModel] = React.useState<string>('');
  const [appVersion, setAppVersion] = React.useState<string>('');

  React.useEffect(() => {
    setSystemName(getSystemName());
    setSystemVersion(getSystemVersion());
    setModel(getModel());
    setAppVersion(getVersion());

    getManufacturer().then(manufacturer => {
      setManufacturer(manufacturer);
    });

    getProduct().then(product => {
      setProduct(product);
    });
  }, []);

  async function resendCurrentDevice() {
    if (!isWindows && !isWeb) {
      const allDevicesRef = await firestore()
        .collection('users')
        .doc(auth()?.currentUser?.uid)
        .collection('devices')
        .get();
      const batchTask = firestore().batch();
      allDevicesRef?.forEach(documentSnapshot => {
        batchTask?.delete(documentSnapshot?.ref);
      });
      return batchTask?.commit()?.then(async () => {
        await firestore()
          .collection('users')
          .doc(auth()?.currentUser?.uid)
          .collection('devices')
          .add({
            manufacturer: Manufacturer,
            system_name: systemName,
            system_version: systemVersion,
            product: Product,
            model: Model,
            app_version: appVersion,
            time: firestore?.Timestamp?.fromDate(new Date()),
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
  }

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
      <Spacer height={heightPercentageToDP(0.75)} />
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
            let response = await NetInfo?.fetch();
            if (response?.isConnected) {
              try {
                StorageInstance.set('currentUserJwtKey', newJwtKey);
              } catch {
                if (__DEV__) {
                  console.error('failed updating JwtKey');
                }
              }
              firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .update({
                  jwtKey: newJwtKey,
                })
                .finally(async () => {
                  await resendCurrentDevice();
                })
                .catch(error => console.error(error));
            } else {
              ErrorToast(
                'bottom',
                'Network unavailable',
                'Network connection is needed to send bug reports.',
                true,
                2000,
              );
            }
          }}
          style={styles.headingTerminate}>
          Terminate All Other Sessions
        </Text>
        <Text style={styles.subheadingTerminate}>
          Log out all devices except for this one.
        </Text>
      </View>
      <Spacer height={heightPercentageToDP(1)} />
      <Text style={styles.miniHeaderText}>Active sessions</Text>
      <DevicesList
        ListData={masterData}
        onPressTrigger={() => {}}
        onLongPressTrigger={() => {}}
      />
    </MiniBaseView>
  );
};
const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    flexDirection: 'row',
  },
  miniHeaderText: {
    fontSize: 16,
    paddingLeft: widthPercentageToDP(3),
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
export default DevicesScreen;
