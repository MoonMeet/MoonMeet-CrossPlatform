import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import {ActivityIndicator} from 'react-native-paper';
import Spacer from '../components/Spacer/Spacer';
import UserList from '../components/DiscoverPeopleScreen/UserList';
import firestore from '@react-native-firebase/firestore';
import {fontValue, heightPercentageToDP} from '../config/Dimensions';

const DiscoverPeopleScreen = () => {
  const [Loading, setLoading] = React.useState(true);

  const [masterData, setMasterData] = React.useState([]);

  useEffect(() => {
    const discoverSubscribe = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const usersSnapshot = [];
        querySnapshot?.forEach(documentSnapshot => {
          if (
            documentSnapshot?.data()?.avatar &&
            documentSnapshot?.data()?.first_name &&
            documentSnapshot?.data()?.last_name &&
            documentSnapshot?.data()?.active_status &&
            documentSnapshot?.data()?.active_time
          ) {
            usersSnapshot.push(documentSnapshot?.data());
          }
        });
        setMasterData(usersSnapshot);
        setLoading(false);
      });
    return () => {
      discoverSubscribe();
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
      <Spacer height={heightPercentageToDP(0.5)} />
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
    fontSize: fontValue(16),
    paddingLeft: '2%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
});
export default DiscoverPeopleScreen;
