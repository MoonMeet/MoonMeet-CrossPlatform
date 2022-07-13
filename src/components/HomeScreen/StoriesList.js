import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Avatar} from 'react-native-paper';
import AddIcon from '../../assets/images/add.png';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import {fontValue, heightPercentageToDP} from '../../config/Dimensions';
import {uniqBy} from 'lodash';

const StoriesList = ({ListData, myUID}) => {
  const navigation = useNavigation();

  const _listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading}>No stories available, yet.</Text>
        <Text style={styles.subheading}>
          there's no story available at the moment.
        </Text>
      </View>
    );
  };
  const _renderItem = ({item}) => (
    <Pressable
      onPress={() => {
        navigation?.navigate('story', {userUID: item?.uid, myUID: myUID});
      }}
      style={{
        height: 85,
        width: 70,
        backgroundColor: COLORS.primaryLight,
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Avatar.Image
          style={styles.userHaveStory}
          size={50}
          source={{uri: item?.image ? item?.image : item?.avatar}}
        />
      </View>
      <Text style={styles.nameAndLastname}>{item?.first_name}</Text>
      <Text style={styles.nameAndLastname}>{item?.last_name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation?.navigate('addStory')}
        style={styles.storyHolderLeft}>
        <Avatar.Icon
          icon={AddIcon}
          size={50}
          color={COLORS.black}
          style={styles.right_icon}
          theme={{
            colors: {
              primary: COLORS.rippleColor,
            },
          }}
        />
        <Text style={styles.storyText}>Add{'\n'}Story</Text>
      </Pressable>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingEnd: '13%',
          alignSelf: 'center',
          justifyContent: ListData?.length > 0 ? 'flex-start' : 'center',
          minWidth:
            Dimensions.get('window')?.width -
            (13 / 100) * Dimensions.get('window')?.width,
        }}
        removeClippedSubviews={true}
        initialNumToRender={10}
        ListEmptyComponent={_listEmptyComponent}
        data={uniqBy(ListData, 'uid')}
        renderItem={_renderItem}
        keyExtractor={item => item?.uid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: '2%',
  },
  addStory: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyHolderLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '17%',
  },
  storyText: {
    position: 'relative',
    fontSize: fontValue(13),
    padding: heightPercentageToDP(-0.5),
    textAlign: 'center',
    color: COLORS.black,
  },
  emptyView: {
    backgroundColor: COLORS.white,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  heading: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
    width: '100%',
  },
  subheading: {
    fontSize: 14,
    paddingTop: '1%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
    width: '100%',
  },
  nameAndLastname: {
    textAlign: 'center',
    color: COLORS.black,
    padding: heightPercentageToDP(-0.5),
    fontSize: fontValue(13),
  },
});

export default StoriesList;
