import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';
import AddIcon from '../../assets/images/add.png';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';

const StoriesList = ({ListData}) => {
  const navigation = useNavigation();

  const _listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.heading}>No one active, yet.</Text>
        <Text style={styles.subheading}>
          there's no one active at the moment.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('addStory')}
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
        <Text style={styles.storyText}>Add Story</Text>
      </Pressable>
      <View style={styles.flatListHolder}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingEnd: '13%',
          }}
          disableVirtualization
          removeClippedSubviews={true}
          initialNumToRender={10}
          ListEmptyComponent={_listEmptyComponent}
          data={ListData}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                navigation.navigate('story');
              }}
              style={{
                padding: '2%',
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
                  source={{uri: item.image ? item.image : item.avatar}}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  color: COLORS.black,
                }}>
                {item.first_name}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: COLORS.black,
                }}>
                {item.last_name}
              </Text>
            </Pressable>
          )}
          keyExtractor={item => item.time}
        />
      </View>
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
    fontSize: 16,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '0.2%',
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  flatListHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyView: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignContent: 'center',
  },
  heading: {
    fontSize: 16,
    textAlign: 'left',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  subheading: {
    fontSize: 14,
    paddingTop: '1%',
    textAlign: 'left',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
});

export default React.memo(StoriesList);
