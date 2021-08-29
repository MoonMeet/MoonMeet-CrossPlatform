import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BaseView from '../components/BaseView/BaseView';
import {
  ActivityIndicator,
  Avatar,
  FAB,
  HelperText,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import ArrowForward from '../assets/images/arrow-forward.png';
import {
  ErrorToast,
  SuccessToast,
} from '../components/ToastInitializer/ToastInitializer';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';

const AddBioScreen = () => {
  const navigation = useNavigation();

  const [BioText, setBioText] = React.useState('');
  const [oldBioText, setOldBioText] = React.useState('');
  const onBioTextChange = _bioText => setBioText(_bioText);

  const [isFABLoading, setIsFABLoading] = React.useState(false);

  const [Loading, setLoading] = React.useState(true);

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser.uid}`)
      .on('value', snapshot => {
        if (snapshot?.val().bio) {
          setBioText(snapshot?.val().bio);
          setOldBioText(snapshot?.val().bio);
        }
        setLoading(false);
      });
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
    };
  }, []);

  const hasMoreLength = () => {
    return BioText.length > 71;
  };

  function pushBio() {
    setIsFABLoading(!isFABLoading);
    database()
      .ref(`/users/${auth().currentUser.uid}`)
      .update({
        bio: BioText,
      })
      .then(() => {
        setIsFABLoading(!isFABLoading);
        SuccessToast(
          'bottom',
          'Bio updated',
          'You have successfully changed your Bio.',
          true,
          4000,
        );
        navigation.goBack();
      })
      .catch(error => {
        ErrorToast(
          'bottom',
          'Reporting Failed',
          'An error occurred when sending your report.',
          true,
          4000,
        );
        navigation.goBack();
        setIsFABLoading(!isFABLoading);
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
          <Text style={styles.toolbar_text}>Add Bio</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
      <TextInput
        style={{
          width: '100%',
          paddingRight: '2%',
          paddingLeft: '2%',
          paddingTop: '1%',
        }}
        mode="outlined"
        label="Add a bio"
        multiline={false}
        value={BioText}
        placeholder={'Type your new bio here.'}
        theme={{
          colors: {
            text: COLORS.black,
            primary: COLORS.accentLight,
            backgroundColor: COLORS.rippleColor,
            placeholder: COLORS.darkGrey,
            underlineColor: '#566193',
            selectionColor: '#DADADA',
            outlineColor: '#566193',
          },
        }}
        onChangeText={onBioTextChange}
      />
      <HelperText type="info" visible={true}>
        You can add a few lines about yourself. Anyone who opens your profile
        will see this text.
      </HelperText>
      <HelperText type="error" visible={hasMoreLength()}>
        Bio text must be less or equal 70 characters.
      </HelperText>
      <FAB
        style={styles.fab}
        normal
        icon={ArrowForward}
        color={COLORS.primaryLight}
        animated={true}
        loading={isFABLoading}
        theme={{
          colors: {
            accent: COLORS.accentLight,
          },
        }}
        onPress={() => {
          if (isConnected) {
            if (!hasMoreLength()) {
              if (BioText === oldBioText) {
                navigation.goBack();
              } else {
                pushBio();
              }
            } else {
              ErrorToast(
                'bottom',
                'Invalid report message',
                'Report message must be between 20 and 240 characters',
                true,
                4000,
              );
            }
          } else {
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to send bug reports',
              true,
              4000,
            );
          }
        }}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default React.memo(AddBioScreen);
