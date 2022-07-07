import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../config/Miscellaneous';

interface DataItemTitleInterface {
  titleItem: string;
}

const DataItemTitle = (props: DataItemTitleInterface) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.titleTextView}>{props.titleItem}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  titleView: {
    padding: '2%',
    flexDirection: 'row',
  },
  titleTextView: {
    fontSize: 18,
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
});
export default DataItemTitle;
