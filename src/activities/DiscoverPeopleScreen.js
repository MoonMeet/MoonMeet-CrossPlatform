import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ActivityIndicator, Avatar, TouchableRipple} from 'react-native-paper';
import BackImage from '../assets/images/back.png';
import Spacer from '../components/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import UserList from '../components/DiscoverPeopleScreen/UserList';
import database from '@react-native-firebase/database';

const DiscoverPeopleScreen = () => {
  const navigation = useNavigation();

  const [Loading, setLoading] = React.useState(true);

  const [masterData, setMasterData] = React.useState([]);

  useEffect(() => {
    const onValueChange = database()
      .ref('/users/')
      .on('value', snapshot => {
        const usersSnapshot = [];
        snapshot?.forEach(childSnapshot => {
          if (
            childSnapshot?.val().avatar &&
            childSnapshot?.val().first_name &&
            childSnapshot?.val().last_name &&
            childSnapshot?.val().active_status &&
            childSnapshot?.val().active_time
          ) {
            usersSnapshot.push({
              avatar: childSnapshot?.val().avatar,
              first_name: childSnapshot?.val().first_name,
              last_name: childSnapshot?.val().last_name,
              active_status: childSnapshot?.val().active_status,
              active_time: childSnapshot?.val().active_time,
            });
          }
        });
        setMasterData(usersSnapshot);
        setLoading(false);
      });
    return () => {
      database().ref('/users/').off('value', onValueChange);
    };
  }, []);
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
          <Text style={styles.toolbar_text}>Discover People</Text>
        </View>
      </View>
      <Spacer height={'1%'} />
      <UserList ListData={masterData} onLongPressTrigger={null} />
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
});
export default React.memo(DiscoverPeopleScreen);
