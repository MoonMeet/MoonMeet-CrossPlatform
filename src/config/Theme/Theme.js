import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme as PaperMD3DarkTheme,
  MD3LightTheme as PaperMD3LightTheme,
} from 'react-native-paper';
import {COLORS} from '../Miscellaneous';

const MoonMeetDarkTheme = {
  ...PaperMD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperMD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
  version: 3,
};

const MoonMeetLightTheme = {
  ...PaperMD3LightTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperMD3LightTheme.colors,
    ...NavigationDarkTheme.colors,
  },
  version: 3,
};

export {MoonMeetDarkTheme, MoonMeetLightTheme};
