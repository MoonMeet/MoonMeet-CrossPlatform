import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import AddImage from '../../assets/images/add.png';
import {COLORS, FONTS} from '../../config/Miscellaneous';
import React from 'react';

const StoriesList = ({CurrentSection, ListData}) => {
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
          {CurrentSection ? 'Discover people' : 'Post story'}
        </Text>
      </View>
      <View style={styles.activeStoriesRow}>
        {CurrentSection ? (
          <View style={styles.flatListHolder}>
            <FlatList data={null} renderItem={null} />
          </View>
        ) : (
          <View style={styles.flatListHolder}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingEnd: '13%',
              }}
              data={ListData}
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
  activeStoriesRow: {
    flexDirection: 'column',
  },
  userHaveStory: {
    borderWidth: /*1.5*/ 0,
    borderColor: COLORS.accentLight,
    overflow: 'hidden',
  },
});

export default React.memo(StoriesList);
