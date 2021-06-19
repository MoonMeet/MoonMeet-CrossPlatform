import React from "react";
import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import PagerView from 'react-native-pager-view';

const IntroScreen = () => {
  return (
    <PagerView style={styles.PagerView} initialPage={0}>
      <View key="1">
        <Text>First page</Text>
      </View>
      <View key="2">
        <Text>Second page</Text>
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  PagerView: {
   flex: 1 ,
  },
});

export default IntroScreen;
