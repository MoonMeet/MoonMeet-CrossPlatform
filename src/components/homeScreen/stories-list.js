import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import AddImage from '../../assets/images/add.png';
import {COLORS} from '../../config/Miscellaneous';
import React from 'react';

const StoriesList = ({showStoriesOrOnline, _testStories}) => {
  return (
    <View style={styles.storyHolder}>
      <View style={styles.storyHolderLeft}>
        <Avatar.Icon
          icon={AddImage}
          size={50}
          color={COLORS.black}
          style={styles.right_icon}
          theme={{
            colors: {
              primary: COLORS.rippleColor,
            },
          }}
        />
        <Text style={styles.storyText}>
          {showStoriesOrOnline ? 'Discover people' : 'Post story'}
        </Text>
      </View>
      <View style={styles.activeStoriesRow}>
        {showStoriesOrOnline ? (
          <View style={styles.flatListHolder}>
            <FlatList data={null} renderItem={null} />
          </View>
        ) : (
          <View style={styles.flatListHolder}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingStart: '1%',
                paddingEnd: '12%',
              }}
              data={_testStories}
              renderItem={({item}) => (
                <Pressable
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
                      source={{uri: item.avatar}}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: COLORS.black,
                    }}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
              keyExtractor={item => item.name}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  storyHolder: {
    flexDirection: 'row',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  storyHolderLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '17%',
  },
});

export default StoriesList;
