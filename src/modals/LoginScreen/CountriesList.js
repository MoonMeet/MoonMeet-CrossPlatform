import React, { useEffect } from "react";
import { Platform, Pressable, Text, View, StyleSheet, FlatList } from "react-native";
import CountriesJson from "../../assets/data/json/country-codes.json";
import { ActivityIndicator, IconButton, Searchbar } from "react-native-paper";
import { COLORS, FONTS } from "../../config/Miscellaneous";

const CountriesList = (props) => {

  useEffect(() => {
    setCountriesData();
    const CountriesListTimerTask = setTimeout(() => {
      setDadaLoading(!DataLoading);
    }, 500);
    return () => {
      clearTimeout(CountriesListTimerTask);
    };
  }, []);

  const _countriesJson = CountriesJson;

  const [SearchBarVisible, setSearchBarVisible] = React.useState(false);


  const [SearchData, setSearchData] = React.useState("");

  const [FilteredData, setFilteredData] = React.useState([]);

  const [MasterData, setMasterData] = React.useState([]);

  const [DataLoading, setDadaLoading] = React.useState(true);


  const SearchImage = require("../../assets/images/search.png");

  const ClearImage = require("../../assets/images/clear.png");

  /**
   * set FlatList Data.
   */
  const setCountriesData = () => {
    setFilteredData(_countriesJson);
    setMasterData(_countriesJson);
  };

  /**
   * Reset list to look like first launch .
   * @param {String} text
   * @constructor
   */
  const ResetListData = (text) => {
    const textLength = text.length;
    if (textLength < 1) {
      setCountriesData();
      setSearchData("");
    }
  };

  /**
   *
   * @param {boolean} bool
   * @param {NaN,String} MyData /* Mixed NaN & String can be used.
   * @constructor
   */
  const CloseModal = (bool, MyData) => {
    props.changeCountriesVisibility(bool);
    props.setModalData(MyData);
  };

  /**
   * Search in JSON Data.
   * @param {String} text
   * @constructor
   */
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
      setFilteredData(FilteredData);
      setSearchData("");
    }
  };

  /**
   * Seperated Render Item for FlatList.
   * @param {function, NaN, String} item /* when converting anonymous function it shows {item} is function, but we can return both NaN and String.
   * @returns {JSX.Element}
   * @private
   */
  const _renderItem = (item) => {
    return (
      <View style={styles.container}>
        <Pressable style={styles.container}
                   onPress={() => CloseModal(false, item.dial_code)}>

          <Text style={styles.country_text}
                onPress={() => CloseModal(false, item.dial_code)}>
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
      flex: 1
    }}>
      {DataLoading ?
        (
          <View style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}>
            <ActivityIndicator size={"large"} animating={true} color={COLORS.accentLight} />
          </View>
        ) :
        <View>
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
              onChangeText={(CharSequence) => {
                SearchInData(CharSequence);
                ResetListData(CharSequence);
              }}
              value={SearchData}
              placeholder={"E.g Tunisia"}
              icon={SearchImage}
              selectionColor={COLORS.controlNormal}
              platform={Platform.OS}
              inputStyle={{
                color: COLORS.accentLight,
              }}
              clearIcon={ClearImage}
            />
          ) : null
          }
          <FlatList showsVerticalScrollIndicator={false}
                    data={FilteredData}
                    disableVirtualization
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item, index, section }) => _renderItem(item, index, section)}
                    stickySectionHeadersEnabled={true}>
          </FlatList>
        </View>
      }
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
    backgroundColor: COLORS.primaryLight,
  },
  top_bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title_text: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: 24,
  },
  country_text: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: 20,
    textAlign: "left",
  },
  dial_text: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: 20,
    textAlign: "right",
    opacity: 0.4,
  },
});

export default CountriesList;
