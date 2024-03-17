/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2024.
 */

import React, {
  MutableRefObject,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Divider, Searchbar} from 'react-native-paper';
import {COLORS, FONTS} from 'config/Miscellaneous.ts';
import {filter, sortBy, unionBy} from 'lodash';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {FlatList} from 'react-native-gesture-handler';
import {fontValue, heightPercentageToDP} from 'config/Dimensions.ts';
import {ScreenHeight} from 'utils/device/DeviceInfo.ts';
import {ClearImage, CountriesJson} from '../../../index.d';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

interface CountriesListInterface {
  sheetRef?: Ref<BottomSheetModalMethods> | undefined;
  snapPoints?: (string | number)[];
  index?: number | undefined;
  sharedData: Function;
}

interface CountriesProps {
  name: string;
  dial_code: string;
  code: string;
}

type CountriesType = {
  name: string;
  dial_code: string;
  code: string;
};

const CountriesList = (props: CountriesListInterface) => {
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      shadowColor: COLORS.black,
    }),
    [],
  );

  /**
   * A mutable ref object holding a reference to a CountriesListInterface.
   *
   * @name propsRef
   * @type {MutableRefObject<CountriesListInterface>}
   * @description This mutable ref object is used to hold a reference to a CountriesListInterface.
   * The ref object can be updated to point to a new value, but it will remain persistent across renders.
   * It is initialized with the initial value of the `props` object.
   */
  const propsRef: MutableRefObject<CountriesListInterface> =
    useRef<CountriesListInterface>(props);

  const [SearchData, setSearchData] = React.useState('');

  const [FilteredData, setFilteredData] = React.useState<CountriesProps[]>([]);

  const [MasterData, setMasterData] = React.useState<CountriesProps[]>([]);

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
  const ResetListData = useCallback((text: string | any[]) => {
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

  const SearchInData = (text: string) => {
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
  const renderItem = useCallback(({item}: {item: CountriesType}) => {
    const {sharedData} = propsRef.current;
    return (
      <>
        <Pressable
          android_ripple={{color: COLORS.rippleColor}}
          style={styles.container}
          onPress={() => {
            sharedData(item?.dial_code);
          }}>
          <Text style={styles.country_text}>{item?.name}</Text>
          <Text style={styles.dial_text}>{item?.dial_code}</Text>
        </Pressable>
        <Divider />
      </>
    );
  }, []);
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
    (backProps: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...backProps}
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
      enableDynamicSizing={true}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      style={sheetStyle}>
      <BottomSheetView
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryLight,
          bottom: '0.25%',
          padding: '3%',
        }}>
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
          style={{margin: '0.5%', backgroundColor: COLORS.controlNormal}}
          inputStyle={{
            color: COLORS.black,
            fontFamily: FONTS.regular,
          }}
          maxLength={20}
          clearIcon={ClearImage}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={unionBy(sortBy(FilteredData, [data => data?.name]), 'code')}
          maxToRenderPerBatch={50}
          updateCellsBatchingPeriod={100}
          initialNumToRender={75}
          keyExtractor={item => item?.name}
          windowSize={ScreenHeight}
          contentContainerStyle={[
            {flexGrow: 1},
            FilteredData.length > 0 ? null : {justifyContent: 'center'},
          ]}
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
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    elevation: 25,
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
