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
    background: COLORS.primaryDark,
    primary: COLORS.primaryDark,
    accent: COLORS.accentDark,
    text: COLORS.white,
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
  version: 3,
};

const MoonMeetLightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    background: COLORS.primaryLight,
    primary: COLORS.redLightError,
    accent: COLORS.redLightError,
    surface: COLORS.accentDark,
    onSurface: COLORS.accentDark,
    ...PaperDefaultTheme.colors,
    ...NavigationDarkTheme.colors,
  },
  version: 3,
};

export {MoonMeetDarkTheme, MoonMeetLightTheme};
