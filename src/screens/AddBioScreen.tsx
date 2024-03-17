/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Moon, 2021-2024.
 */

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  ActivityIndicator,
  FAB,
  HelperText,
  TextInput,
} from 'react-native-paper';
import {COLORS} from '../config/Miscellaneous';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import MiniBaseView from '@components/MiniBaseView/MiniBaseView.tsx';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {heightPercentageToDP} from '../config/Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AddBioScreen = () => {
  const navigation = useNavigation();

  const [BioText, setBioText] = React.useState('');
  const [oldBioText, setOldBioText] = React.useState('');
  const onBioTextChange = (bioText: string) => setBioText(bioText);

  const [loaderVisible, setLoaderVisible] = React.useState(false);
  const [Loading, setLoading] = React.useState(true);

  /**
   * Checking if network is OK.
   */
  const fetchNetworkInfo = async () => {
    const networkState = await NetInfo.fetch();
    return networkState?.isConnected;
  };

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (!documentSnapshot?.data()?.bio) {
            setLoading(false);
          } else {
            setBioText(documentSnapshot?.data()?.bio);
            setOldBioText(documentSnapshot?.data()?.bio);
            setLoading(false);
          }
        }
      });
    return () => {};
  }, []);

  const hasMoreLength = () => {
    return BioText?.trim()?.length > 50;
  };

  function pushBio() {
    setLoaderVisible(true);
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        bio: BioText?.trim(),
      })
      .finally(() => {
        SuccessToast(
          'bottom',
          'Bio updated',
          'You have successfully changed your Bio.',
          true,
          3000,
        );
        setOldBioText(BioText?.trim());
        setLoaderVisible(false);
      })
      .catch(() => {
        ErrorToast(
          'bottom',
          'Failed to update bio',
          'An error occurred when updating your bio.',
          true,
          3000,
        );
        setLoaderVisible(false);
        if (navigation?.canGoBack()) {
          navigation?.goBack();
        }
      });
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
    <BaseView>
      <Spacer height={heightPercentageToDP(0.5)} />
      <View
        style={{
          paddingRight: '2%',
          paddingLeft: '2%',
        }}>
        <TextInput
          style={{
            width: '100%',
          }}
          mode="outlined"
          label="Bio"
          multiline={false}
          value={BioText}
          placeholder={'Type your new bio here.'}
          theme={{
            colors: {
              primary: COLORS.accentLight,
              onSurface: COLORS.black,
              background: COLORS.dimmed,
            },
          }}
          onChangeText={onBioTextChange}
        />
      </View>
      <HelperText type="info" visible={true}>
        You can add a few lines about yourself. Anyone who opens your profile
        will see this text.
      </HelperText>
      <HelperText type="error" visible={hasMoreLength()}>
        Bio text must be less or equal 50 characters.
      </HelperText>
      <FAB
        style={styles.fab}
        mode={'elevated'}
        size={'medium'}
        icon={({size, allowFontScaling}) => (
          <MaterialIcons
            name="chevron-right"
            color={COLORS.white}
            size={size}
            allowFontScaling={allowFontScaling}
          />
        )}
        animated={true}
        theme={{
          colors: {
            primaryContainer: COLORS.accentLight,
          },
        }}
        onPress={async () => {
          const isConnected = await fetchNetworkInfo();
          if (isConnected) {
            if (!hasMoreLength()) {
              if (BioText?.trim() === oldBioText?.trim()) {
                navigation?.goBack();
              } else {
                pushBio();
              }
            } else {
              ErrorToast(
                'bottom',
                'Invalid Bio',
                'Bio text must not be more than 70 characters',
                true,
                1500,
              );
            }
          } else {
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to update your bio.',
              true,
              1500,
            );
          }
        }}
      />
      <LoadingIndicator isVisible={loaderVisible} />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16 - 0.1 * 16,
    right: 0,
    bottom: 0,
  },
});

export default AddBioScreen;
