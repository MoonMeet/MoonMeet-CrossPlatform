import React, { useEffect } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import CountriesJson from "../assets/data/json/country-codes.json";
import { COLORS, FONTS } from "../config/miscellaneous";
import { IconButton, Searchbar } from "react-native-paper";

const CountriesList = (props) => {

  useEffect(() => {
    setCountriesData();
    return () => {

    };
  }, []);

  const _countriesJson = CountriesJson;

  const [SearchBarVisible, setSearchBarVisible] = React.useState(false);

  const [isDataNotFound, setDataNotFound] = React.useState(false);

  const [SearchData, setSearchData] = React.useState("");
  const [FilteredData, setFilteredData] = React.useState([]);
  const [MasterData, setMasterData] = React.useState([]);

  const SearchImage = require("../assets/images/search.png");
  const ClearImage = require("../assets/images/clear.png");

  const setCountriesData = () => {
    setFilteredData(_countriesJson);
    setMasterData(_countriesJson);
  };

  const CloseModal = (bool, MyData) => {
    props.changeCountriesVisibility(bool);
    props.setModalData(MyData);
  };

  const SearchInData = (text) => {
    if (text) {
      const newData = MasterData.filter((item) => {
        const itemData = item.name ?
          item.name.toUpperCase()
          : "".toLowerCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearchData(text);
    } else {
      setDataNotFound(!isDataNotFound)
    }
  };

  const _renderItem = (item, index) => {
    return (
      <View style={styles.container}>
        <Pressable style={styles.container}
                   onPress={() => CloseModal(false, item.dial_code)}
                   android_ripple={"#193566"}>

          <Text style={styles.country_text}>
            {item.name}
          </Text>
          <Text style={styles.dial_text}>
            {item.dial_code}
          </Text>
        </Pressable>
      </View>
    );
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
                      setSearchBarVisible(!SearchBarVisible);
                    }}
        />
      </View>
      {SearchBarVisible ? (
        <Searchbar
          placeholder="Search"
          onChangeText={(text) => SearchInData(text)}
          value={SearchData}
          placeholder={"E.g Tunisia"}
          icon={SearchImage}
          selectionColor={COLORS.controlNormal}
          platform={Platform.OS}
          inputStyle={{
            color: COLORS.accent,
          }}
          clearIcon={ClearImage}
        />
      ) : null
      }
      <FlatList showsVerticalScrollIndicator={false}
                data={FilteredData}
                keyExtractor={(item) => item.dial_code}
                renderItem={({ item, index }) => _renderItem(item, index)}>
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
