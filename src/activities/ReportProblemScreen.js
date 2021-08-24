import React, {useEffect} from 'react';
import BaseView from '../components/BaseView/BaseView';
import {StyleSheet, Text, View} from 'react-native';
import {
  Avatar,
  FAB,
  HelperText,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import ArrowForward from '../assets/images/arrow-forward.png';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {
  SuccessToast,
  ErrorToast,
} from '../components/ToastInitializer/ToastInitializer';

const ReportProblemScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });

  /**
   * Dummy NetInfoObserver
   */

  const addNetInfoObserver = () => {
    NetInfo.addEventListener(networkState => {
      console.info(networkState.details);
      console.info(networkState.type);
    });
  };

  const [ReportText, setReportText] = React.useState('');
  const [isFABLoading, setIsFABLoading] = React.useState(false);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const onReportTextChange = _reportText => setReportText(_reportText);

  function getUserData() {
    database()
      .ref(`/users/${auth().currentUser.uid}`)
      .on('value', snapshot => {
        if (snapshot?.val().first_name && snapshot?.val().last_name) {
          setFirstName(snapshot?.val().first_name);
          setLastName(snapshot?.val().last_name);
        }
      });
  }

  function pushReport() {
    setIsFABLoading(!isFABLoading);
    database()
      .ref(`/reports/${auth().currentUser.uid}`)
      .set({
        uid: auth().currentUser.uid,
        first_name: firstName,
        last_name: lastName,
        report_message: ReportText,
        time: Date.now(),
      })
      .then(() => {
        setIsFABLoading(!isFABLoading);
        SuccessToast(
          'bottom',
          'Report Delivered',
          'Thank you for reporting bugs to our server',
          true,
          4000,
        );
        navigation.goBack();
      })
      .catch(error => {
        ErrorToast(
          'bottom',
          'Reporting Failed',
          'An error occurred when sending your rapport',
          true,
          4000,
        );
        navigation.goBack();
        setIsFABLoading(!isFABLoading);
      });
  }

  const hasMoreLength = () => {
    return ReportText.length > 241;
  };

  const hasLessLength = () => {
    return ReportText.length < 20;
  };

  useEffect(() => {
    getUserData();
    addNetInfoObserver();
    return () => {};
  }, []);

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
      <Spacer height={'2.5%'} />
      <Text style={styles.bugInfo}>
        We will need to help as soon as you describe the problem in the
        paragraphs bellow
      </Text>
      <TextInput
        style={{
          width: '100%',
          paddingRight: '2%',
          paddingLeft: '2%',
          paddingTop: '1%',
        }}
        mode="outlined"
        label="Report a problem"
        multiline={true}
        value={ReportText}
        placeholder={'Here you can describe the problem in more detail'}
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
        onChangeText={onReportTextChange}
      />
      {hasMoreLength() ? (
        <HelperText type="error" visible={hasMoreLength()}>
          Report message must be less than 240 characters.
        </HelperText>
      ) : (
        <HelperText type="info" visible={hasLessLength()}>
          Report message must be longer than 20 characters.
        </HelperText>
      )}
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
            if (!hasMoreLength() && !hasLessLength()) {
              pushReport();
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
  bugInfo: {
    position: 'relative',
    fontSize: 16,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default React.memo(ReportProblemScreen);
