import React from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import {Avatar, FAB, IconButton, TextInput} from 'react-native-paper';
import BaseView from '../components/base-view/base-view';

const SetupScreen = () => {
  /**
   * Importing `pick-photo, arrow-forward` from assets
   */

  const AddPhoto = require('../assets/images/pick-photo.png');

  const ArrowForward = require('../assets/images/arrow-forward.png');

  /**
   * TextInput stuffs (setter & getter)
   */

  const [firstName, setFirstName] = React.useState('');

  const [lastName, setLastName] = React.useState('');

  return (
    <BaseView>
      <View style={styles.top_bar}>
        <Text style={styles.top_text}>
          Enter your name and select a profile picture
        </Text>
      </View>
      <View style={styles.large_box}>
        <View
          style={{
            justifyContent: 'center',
            paddingLeft: '2.5%',
          }}>
          <Avatar.Icon
            size={55}
            color={COLORS.rippleColor}
            icon={AddPhoto}
            theme={{
              colors: {
                primary: COLORS.accentLight,
              },
            }}
          />
        </View>

        <View
          style={{
            height: '-1%',
            width: '3%',
          }}
        />

        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            padding: '1%',
          }}>
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label="First Name"
            value={firstName}
            multiline={false}
            theme={{
              colors: {
                text: COLORS.accentLight,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={_firstName => {
              setFirstName(_firstName);
            }}
          />
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label="Last Name"
            value={lastName}
            multiline={false}
            theme={{
              colors: {
                text: COLORS.accentLight,
                primary: COLORS.accentLight,
                backgroundColor: COLORS.rippleColor,
                placeholder: COLORS.darkGrey,
                underlineColor: '#566193',
                selectionColor: '#DADADA',
                outlineColor: '#566193',
              },
            }}
            onChangeText={_lastName => {
              setLastName(_lastName);
            }}
          />
        </View>
      </View>
      <Pressable style={styles.fab}>
        <View>
          <IconButton icon={ArrowForward} />
        </View>
      </Pressable>
      <FAB
        style={styles.fab}
        normal
        icon={ArrowForward}
        color={COLORS.primaryLight}
        theme={{
          colors: {
            accent: COLORS.accentLight,
          },
        }}
        onPress={() => console.log('Pressed')}
      />
    </BaseView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  top_bar: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'center',
  },
  top_text: {
    position: 'relative',
    fontSize: 28,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  large_box: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default SetupScreen;
