import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {COLORS} from '../Miscellaneous';

const MoonMeetDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    background: COLORS.black,
    primary: COLORS.primaryDark,
    accent: COLORS.accentDark,
    text: COLORS.white,
  },
  version: 3,
};

const MoonMeetLightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDarkTheme.colors,
    background: COLORS.primaryLight,
    primary: COLORS.redLightError,
    accent: COLORS.redLightError,
    surface: COLORS.accentDark,
    onSurface: COLORS.accentDark,
  },
  version: 3,
};

export {MoonMeetDarkTheme, MoonMeetLightTheme};
