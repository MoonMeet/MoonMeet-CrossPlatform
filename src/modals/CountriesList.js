import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import CountriesJson from "../assets/data/json/country-codes.json";
import { COLORS, FONTS } from "../config/miscellaneous";
import { IconButton, Searchbar } from "react-native-paper";

const CountriesList = (props) => {

  const [SearchBarVisible, setSearchBarVisible] = React.useState(false);

  const MyList = CountriesJson;
  const SearchImage = require("../assets/images/search.png");
  const ClearImage = require("../assets/images/clear.png");

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const CloseModal = (bool, MyData) => {
    props.changeCountriesVisibility(bool);
    props.setModalData(MyData);
  };

  return (
    <View style={{
      marginBottom: "5%",
    }}>
      <View style={styles.top_bar}>
        <Text style={styles.title_text}>
          Select your country
        </Text>
        <IconButton icon={SearchImage}
                    color={"#999999"}
                    size={24}
                    style={{ paddingBottom: "0%" }}
                    onPress={() => {
                    }}
        />
      </View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        placeholder={'E.g Tunisia'}
        icon={SearchImage}
        selectionColor={COLORS.controlNormal}
        platform={Platform.OS}
        inputStyle={{
          color: COLORS.accent
        }}
        clearIcon={ClearImage}
      />
      <FlatList showsVerticalScrollIndicator={false} data={MyList} keyExtractor={(item) => item.dial_code} renderItem={({ item }) =>
        <View style={styles.container}>
          <Text onPress={() => CloseModal(false, item.dial_code)
          }
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "3%",
    paddingBottom: "3%",
    backgroundColor: COLORS.primary,
  },
  top_bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

export default CountriesList;
