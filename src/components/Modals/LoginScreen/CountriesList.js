/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {useCallback, useEffect, useMemo} from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import CountriesJson from '../../../assets/data/json/country-codes.json';
import {Divider, Searchbar} from 'react-native-paper';
import {COLORS, FONTS} from '../../../config/Miscellaneous';
import ClearImage from '../../../assets/images/clear.png';
import {unionBy, sortBy, filter} from 'lodash';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {FlatList} from 'react-native-gesture-handler';
import {fontValue, heightPercentageToDP} from '../../../config/Dimensions';

interface CountriesListInterface {
  sheetRef?: Ref | undefined;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | undefined;
  index?: number | undefined;
  sharedData: Function | undefined;
}

const CountriesList = (props: CountriesListInterface) => {
  const {animatedHandleHeight, handleContentLayout} =
    useBottomSheetDynamicSnapPoints(props.snapPoints);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer(props?.index),
      shadowColor: COLORS.black,
      padding: '3%',
    }),
    [],
  );

  const [SearchData, setSearchData] = React.useState('');

  const [FilteredData, setFilteredData] = React.useState([]);

  const [MasterData, setMasterData] = React.useState([]);

  /**
   * set FlatList Data.
   */
  const setCountriesData = () => {
    setFilteredData(CountriesJson);
    setMasterData(CountriesJson);
  };

  /**
   * Reset list to look like first launch .
   * @param {String} text
   * @constructor
   */
  const ResetListData = useCallback(text => {
    if (text?.length < 1) {
      setCountriesData();
      setSearchData('');
    }
  }, []);

  /**
   * Search in JSON Data.
   * @param {String} text
   * @constructor
   */

  const SearchInData = text => {
    if (text?.trim().length > 0) {
      const newData = filter(MasterData, item => {
        const itemData = item?.name
          ? item?.name?.toUpperCase()
          : ''.toLowerCase();
        const textData = text?.toUpperCase();
        return itemData?.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearchData(text);
    } else {
      setFilteredData(FilteredData);
      setSearchData('');
    }
  };

  useEffect(() => {
    ResetListData('');
    return () => {
      ResetListData('');
    };
  }, [ResetListData]);

  /**
   * Seperated Render Item for FlatList.
   * @param {function, NaN, String} item /* when converting anonymous function it shows {item} is function, but we can return both NaN and String.
   * @returns {JSX.Element}
   * @private
   */
  const renderItem = ({item}) => {
    return (
      <>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          style={styles.container}
          onPress={() => {
            props?.sharedData(item?.dial_code);
          }}>
          <Text style={styles.country_text}>{item?.name}</Text>
          <Text style={styles.dial_text}>{item?.dial_code}</Text>
        </Pressable>
        <Divider />
      </>
    );
  };
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text numberOfLines={1} style={styles.heading}>
          No countries found.
        </Text>
        <Text numberOfLines={1} style={styles.subheading}>
          Hmm, Try checking your country name again.
        </Text>
      </View>
    );
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={props?.sheetRef}
      index={props?.index}
      snapPoints={props?.snapPoints}
      handleIndicatorStyle={{backgroundColor: COLORS.darkGrey}}
      enablePanDownToClose={true}
      handleHeight={animatedHandleHeight}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      backdropComponent={renderBackdrop}
      onLayout={handleContentLayout}
      style={sheetStyle}>
      <BottomSheetView
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryLight,
          bottom: '0.25%',
        }}
        onLayout={handleContentLayout}>
        <View style={styles.top_bar}>
          <Text numberOfLines={1} style={styles.title_text}>
            Select your country
          </Text>
        </View>
        <Searchbar
          onChangeText={CharSequence => {
            SearchInData(CharSequence);
            ResetListData(CharSequence);
          }}
          value={SearchData}
          placeholder={'Search'}
          selectionColor={COLORS.controlNormal}
          style={{margin: '0.5%'}}
          iconColor={COLORS.darkGrey}
          inputStyle={{
            color: COLORS.black,
            fontFamily: FONTS.regular,
          }}
          clearIcon={ClearImage}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={unionBy(sortBy(FilteredData, [data => data?.name]), 'code')}
          removeClippedSubviews={true}
          keyExtractor={item => item?.id}
          contentContainerStyle={[
            {flexGrow: 1},
            FilteredData.length > 0 ? null : {justifyContent: 'center'},
          ]}
          disableVirtualization
          initialNumToRender={
            unionBy(sortBy(FilteredData, [data => data?.name]), 'code').length /
            2
          }
          ListEmptyComponent={listEmptyComponent}
          renderItem={renderItem}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: heightPercentageToDP(2.25),
    paddingBottom: heightPercentageToDP(2.25),
    backgroundColor: COLORS.primaryLight,
  },
  top_bar: {
    alignItems: 'center',
  },
  title_text: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: fontValue(24),
    paddingBottom: heightPercentageToDP(0.75),
  },
  country_text: {
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
    fontSize: fontValue(20),
    textAlign: 'left',
  },
  dial_text: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: fontValue(20),
    textAlign: 'right',
    opacity: 0.4,
  },
  sheetContainer: index => {
    return {
      backgroundColor: COLORS.white,
      borderTopStartRadius: index === 1 ? 0 : 25,
      borderTopEndRadius: index === 1 ? 0 : 25,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.75,
      shadowRadius: 16.0,
      elevation: 25,
    };
  },
  heading: {
    fontSize: fontValue(20),
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  subheading: {
    fontSize: fontValue(18),
    paddingTop: '1%',
    textAlign: 'center',
    color: COLORS.black,
    opacity: 0.4,
    fontFamily: FONTS.regular,
  },
  emptyView: {
    backgroundColor: COLORS.white,
  },
});

export default CountriesList;
