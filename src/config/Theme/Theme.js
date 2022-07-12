import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import merge from 'deepmerge';
import {COLORS} from '../Miscellaneous';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const MoonPaperDarkTheme = {
  ...CombinedDarkTheme,
  colors: {
    background: COLORS.black,
    primary: COLORS.primaryDark,
    accent: COLORS.accentDark,
    ...CombinedDarkTheme,
  },
  version: 3,
};

const MoonPaperLightTheme = {
  ...CombinedDefaultTheme,
  colors: {
    background: COLORS.primaryLight,
    primary: COLORS.redLightError,
    accent: COLORS.redLightError,
    surface: COLORS.accentDark,
    onSurface: COLORS.accentDark,
  },
  version: 3,
};

export {
  CombinedDefaultTheme,
  CombinedDarkTheme,
  MoonPaperLightTheme,
  MoonPaperDarkTheme,
};
