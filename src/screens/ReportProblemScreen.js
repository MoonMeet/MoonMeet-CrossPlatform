import React from 'react';
import BaseView from '../components/BaseView/BaseView';
import {StyleSheet, Text, View} from 'react-native';
import {FAB, HelperText, TextInput} from 'react-native-paper';
// import BackImage from '../assets/images/back.png';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import Spacer from '../components/Spacer/Spacer';
import ArrowForward from '../assets/images/arrow-forward.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {
  SuccessToast,
  ErrorToast,
} from '../components/ToastInitializer/ToastInitializer';
import LoadingIndicator from '../components/Modals/CustomLoader/LoadingIndicator';
import {heightPercentageToDP} from '../config/Dimensions';

const ReportProblemScreen = () => {
  const navigation = useNavigation();

  /**
   * Checking if network is OK before sending SMS or catching and SnackBar Exception.
   */
  let isConnected = NetInfo.fetch().then(networkState => {
    isConnected = networkState?.isConnected;
  });
  const [ReportText, setReportText] = React.useState('');

  const [loaderVisible, setLoaderVisible] = React.useState(false);

  const onReportTextChange = _reportText => setReportText(_reportText);

  function pushReport() {
    setLoaderVisible(true);
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .collection('reports')
      .add({
        report_message: ReportText,
        time: Date.now(),
      })
      .finally(() => {
        SuccessToast(
          'bottom',
          'Report Delivered',
          'Thank you for reporting bugs to Moon Meet Team.',
          true,
          3000,
        );
        setLoaderVisible(false);
        navigation.goBack();
      })
      .catch(error => {
        ErrorToast(
          'bottom',
          'Reporting Failed',
          'An error occurred while sending your report.',
          true,
          3000,
        );
        setLoaderVisible(false);
        navigation?.goBack();
      });
  }

  const hasMoreLength = () => {
    return ReportText.length > 240;
  };

  const hasLessLength = () => {
    return ReportText.length < 19;
  };

  return (
    <BaseView>
      {/**<View style={styles.toolbar}>
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
      </View>*/}
      <Spacer height={heightPercentageToDP(0.5)} />
      <Text style={styles.bugInfo}>
        We will need to help as soon as you describe the problem in the
        paragraphs bellow
      </Text>
      <View style={{paddingRight: '2%', paddingLeft: '2%'}}>
        <TextInput
          style={{
            width: '100%',
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
      </View>
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
                'Report message must be between 20 and 240 characters.',
                true,
                3000,
              );
            }
          } else {
            ErrorToast(
              'bottom',
              'Network unavailable',
              'Network connection is needed to send bug reports.',
              true,
              3000,
            );
          }
        }}
      />
      <LoadingIndicator isVisible={loaderVisible} />
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

export default ReportProblemScreen;
