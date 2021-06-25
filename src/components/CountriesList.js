import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CountriesJson from "../assets/data/json/country-codes.json";
import { COLORS, FONTS } from "../config/miscellaneous";
import LoginScreen from "./LoginScreen";
import { IconButton } from "react-native-paper";

const MyList = CountriesJson;
const SearchImage = require('../assets/images/search.png')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: '3%',
    paddingBottom: '3%',
    backgroundColor: COLORS.primary,
  },
  top_bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  title_text: {
    color: COLORS.accent,
    fontFamily: FONTS.regular,
    fontSize: 24,
  },
  country_text: {
    color: COLORS.accent,
    fontFamily: FONTS.regular,
    fontSize: 20,
    textAlign: "left",
  },
  dial_text: {
    color: COLORS.darkGrey,
    fontFamily: FONTS.regular,
    fontSize: 20,
    textAlign: "right",
  },
});


export default class CountriesList extends Component {
  isSearchBarVisible: false;
  setSearchBarVisible: false;
  loginScreenVar = LoginScreen;
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{
        marginBottom: "5%",
      }}>
        <View style={styles.top_bar}>
          <Text style={styles.title_text}>
            Select your country
          </Text>
          <IconButton icon={SearchImage}
                      color={'#999999'}
                      size={24}
                      style={{ paddingBottom: '0%'}}
                      onPress={() => {

                      }}
          />
        </View>
        <FlatList showsVerticalScrollIndicator={false} data={MyList} renderItem={({ item }) =>
          <View style={styles.container}>
            <Text onPress={() => {
              this.loginScreenVar.UserSelectedCountry = item.dial_code;
              this.loginScreenVar.arguments.setModalVisible = false;
              console.log(this.loginScreenVar.arguments.setModalVisible = false)
            }}
                  style={styles.country_text}>
              {item.name}
            </Text>
            <Text style={styles.dial_text}>
              {item.dial_code}
            </Text>
          </View>
        }>
        </FlatList>
      </View>
    );
  }
};
