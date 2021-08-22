import React from 'react';
import {View} from 'react-native';
import DataItemTitle from './DataItemTitle';
import DataItem from './DataItem';
import EditIcon from '../../assets/images/create.png';
import DarkModeIcon from '../../assets/images/dark_mode.png';
import {COLORS} from '../../config/Miscellaneous';
import DataItemCustom from './DataItemCustom';

const ScrollViewContainer = () => {
  return (
    <View>
      <DataItemTitle titleItem={'Miscellaneous'} />
      <DataItem
        rightIcon={DarkModeIcon}
        rightIconColor={COLORS.black}
        titleTextContainer={'Dark mode'}
        onPressTrigger={null}
      />
      <DataItemTitle titleItem={'Account'} />
      <DataItem
        rightIcon={EditIcon}
        rightIconColor={COLORS.purple}
        titleTextContainer={'Edit profile'}
        onPressTrigger={null}
      />
      <DataItemCustom
        rightIcon={EditIcon}
        rightIconColor={COLORS.purple}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleTextContainer={'I dunno'}
        titleColor={COLORS.black}
        enableDescription={true}
        descriptionColor={COLORS.black}
        descriptionText={'enable this to get something cool'}
      />
    </View>
  );
};

export default React.memo(ScrollViewContainer);
