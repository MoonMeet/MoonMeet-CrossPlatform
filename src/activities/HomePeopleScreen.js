import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {COLORS, FONTS} from '../config/Miscellaneous';
import MiniBaseView from '../components/MiniBaseView/MiniBaseView';
import PersonImage from '../assets/images/person.png';
import CreateImage from '../assets/images/create.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatGrid} from 'react-native-super-grid';

const HomePeopleScreen = () => {
  const navigation = useNavigation();

  const [Loading, setLoading] = React.useState(true);

  const [avatarURL, setAvatarURL] = React.useState('');

  const [masterData, setMasterData] = React.useState([]);

  async function checkJwtKey(currentJwtKey: string) {
    AsyncStorage.getItem('currentUserJwtKey').then(_asyncJwt => {
      if (_asyncJwt !== currentJwtKey) {
        auth()
          ?.signOut()
          .then(() => {
            AsyncStorage.removeItem('currentUserJwtKey');
            navigation.navigate('login');
          });
      }
    });
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const [items, setItems] = React.useState([
    {name: 'TURQUOISE', code: '#1abc9c'},
    {name: 'EMERALD', code: '#2ecc71'},
    {name: 'PETER RIVER', code: '#3498db'},
    {name: 'AMETHYST', code: '#9b59b6'},
    {name: 'WET ASPHALT', code: '#34495e'},
    {name: 'GREEN SEA', code: '#16a085'},
    {name: 'NEPHRITIS', code: '#27ae60'},
    {name: 'BELIZE HOLE', code: '#2980b9'},
    {name: 'WISTERIA', code: '#8e44ad'},
    {name: 'MIDNIGHT BLUE', code: '#2c3e50'},
    {name: 'SUN FLOWER', code: '#f1c40f'},
    {name: 'CARROT', code: '#e67e22'},
    {name: 'ALIZARIN', code: '#e74c3c'},
    {name: 'CLOUDS', code: '#ecf0f1'},
    {name: 'CONCRETE', code: '#95a5a6'},
    {name: 'ORANGE', code: '#f39c12'},
    {name: 'PUMPKIN', code: '#d35400'},
    {name: 'POMEGRANATE', code: '#c0392b'},
    {name: 'SILVER', code: '#bdc3c7'},
    {name: 'ASBESTOS', code: '#7f8c8d'},
  ]);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/users/${auth()?.currentUser?.uid}`)
      .on('value', async snapshot => {
        if (snapshot?.val().avatar && snapshot?.val().jwtKey) {
          setAvatarURL(snapshot?.val().avatar);
          await checkJwtKey(snapshot?.val().jwtKey);
          setLoading(false);
        }
      });
    const secondOnValueChange = database()
      .ref('/stories/')
      .on('value', snapshot => {
        const storiesSnapshot = [];
        snapshot?.forEach(childSnapshot => {
          childSnapshot?.forEach(threeYearsOldSnapshot => {
            if (
              threeYearsOldSnapshot?.val().avatar &&
              threeYearsOldSnapshot?.val().first_name &&
              threeYearsOldSnapshot?.val().last_name &&
              threeYearsOldSnapshot?.val().sid &&
              threeYearsOldSnapshot?.val().uid
            ) {
              storiesSnapshot.push({
                avatar: threeYearsOldSnapshot?.val().avatar,
                first_name: threeYearsOldSnapshot?.val().first_name,
                last_name: threeYearsOldSnapshot?.val().last_name,
                sid: threeYearsOldSnapshot?.val().sid,
                uid: threeYearsOldSnapshot?.val().uid,
                text: threeYearsOldSnapshot?.val().text,
                image: threeYearsOldSnapshot.val().image,
              });
            }
            setMasterData(storiesSnapshot);
          });
        });
      });
    return () => {
      database()
        .ref(`/users/${auth()?.currentUser.uid}`)
        .off('value', onValueChange);
      database().ref('/stories/').off('value', secondOnValueChange);
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
  } else {
    return (
      <MiniBaseView>
        <View style={styles.toolbar}>
          <View style={styles.left_side}>
            {avatarURL ? (
              <Avatar.Image
                size={40}
                source={avatarURL ? {uri: avatarURL} : null}
                style={{
                  overflow: 'hidden',
                  marginRight: '-1%',
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            ) : (
              <Avatar.Icon
                icon={PersonImage}
                size={40}
                color={COLORS.black}
                style={{
                  overflow: 'hidden',
                  marginRight: '-1%',
                  opacity: 0.4,
                }}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            )}
          </View>
          <View style={styles.mid_side}>
            <Text style={styles.top_text}>People</Text>
          </View>
          <View style={styles.right_side}>
            <Pressable onPress={() => navigation.navigate('discover')}>
              <Avatar.Icon
                icon={CreateImage}
                size={37.5}
                color={COLORS.black}
                style={styles.right_icon}
                theme={{
                  colors: {
                    primary: COLORS.rippleColor,
                  },
                }}
              />
            </Pressable>
          </View>
        </View>
        <FlatGrid
          itemDimension={225}
          data={items}
          style={styles.gridView}
          staticDimension={Dimensions.get('window').width}
          // fixed
          spacing={10}
          renderItem={({item}) => (
            <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCode}>{item.code}</Text>
            </View>
          )}
        />
      </MiniBaseView>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    padding: '2%',
    flexDirection: 'row',
    elevation: 0,
  },
  top_text: {
    position: 'relative',
    fontSize: 22,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
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
  right_side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  right_icon: {
    resizeMode: 'contain',
    overflow: 'hidden',
    paddingBottom: '0.2%',
    paddingRight: '0.2%',
    opacity: 0.4,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});
export default React.memo(HomePeopleScreen);
