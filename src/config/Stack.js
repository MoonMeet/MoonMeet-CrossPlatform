/**
 * Realised by Ahmed Sbai
 * https://github.com/sbaiahmed1
 * @format
 * @flow strict-local
 */

import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ActiveStatusScreen from '../screens/ActiveStatusScreen';
import AddBioActivity from '../screens/AddBioScreen';
import AddStoryScreen from '../screens/AddStoryScreen';
import ChangeUsernameScreen from '../screens/ChangeUsernameScreen';
import DevicesScreen from '../screens/DevicesScreen';
import DiscoverPeopleScreen from '../screens/DiscoverPeopleScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HomeChats from '../screens/HomeChatsScreen.js';
import HomePeople from '../screens/HomePeopleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import ReportProblem from '../screens/ReportProblemScreen';
import SetupScreen from '../screens/SetupScreen';
import SplashScreen from '../screens/SplashScreen';
import StoryScreen from '../screens/StoryScreen';
import ChatScreen from '../screens/ChatScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import {Avatar} from 'react-native-paper';

import {COLORS, FONTS} from './Miscellaneous';

import ChatIcon from '../assets/images/chat.png';
import PeopleIcon from '../assets/images/two_people.png';

import SetupPasscodeScreen from '../screens/SetupPasscodeScreen';
import VerifyPasscodeScreen from '../screens/VerifyPasscodeScreen';
import {fontValue, heightPercentageToDP} from './Dimensions';
import {MoonMeetDarkTheme, MoonMeetLightTheme} from './Theme/Theme';
import {useTheme} from 'react-native-paper';
import {ThemeContext} from './Theme/Context';
import DarkModeSettings from '../screens/DarkModeScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      shifting={false}
      initialRouteName={'Chats'}
      activeColor={COLORS.accentLight}
      inactiveColor={COLORS.darkGrey}
      barStyle={{backgroundColor: COLORS.primaryLight}}>
      <Tab.Screen
        name="Chats"
        component={HomeChats}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({color}) => (
            <Avatar.Icon
              icon={ChatIcon}
              color={color}
              size={36.5}
              style={{
                margin: heightPercentageToDP(-0.75),
              }}
              theme={{colors: {primary: COLORS.transparent}}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="People"
        component={HomePeople}
        options={{
          tabBarLabel: 'People',
          tabBarIcon: ({color}) => (
            <Avatar.Icon
              icon={PeopleIcon}
              color={color}
              size={42.5}
              style={{
                margin: heightPercentageToDP(-1.25),
              }}
              theme={{colors: {primary: COLORS.transparent}}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  const theme = useTheme();
  const {toggleTheme, isThemeDark} = React.useContext(ThemeContext);
  return (
    <NavigationContainer theme={isThemeDark ? MoonMeetDarkTheme : DefaultTheme}>
      <Stack.Navigator options={{headerShown: false}}>
        <Stack.Screen
          name={'splash'}
          component={SplashScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'onboarding'}
          component={IntroScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'login'}
          component={LoginScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={'setup'}
          component={SetupScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'home'}
          component={HomeScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'settings'}
          component={SettingsScreen}
          options={{
            headerTitle: 'Settings',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: isThemeDark ? COLORS.white : COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: isThemeDark ? COLORS.white : COLORS.black,
            headerStyle: {
              backgroundColor: isThemeDark
                ? COLORS.primaryDark
                : COLORS.primaryLight,
            },
          }}
        />
        <Stack.Screen
          name={'bugreport'}
          component={ReportProblem}
          options={{
            headerTitle: 'Report Technical Problem',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'activeStatus'}
          component={ActiveStatusScreen}
          options={{
            headerTitle: 'Active Status',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'changeUsername'}
          component={ChangeUsernameScreen}
          options={{
            headerTitle: 'Change Username',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'addBio'}
          component={AddBioActivity}
          options={{
            headerTitle: 'Add Bio',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'editProfile'}
          component={EditProfileScreen}
          options={{
            headerTitle: 'Edit Profile',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'devices'}
          component={DevicesScreen}
          options={{
            headerTitle: 'Devices',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'discover'}
          component={DiscoverPeopleScreen}
          options={{
            headerTitle: 'Discover People',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'story'}
          component={StoryScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'addStory'}
          component={AddStoryScreen}
          options={{
            headerShown: false,
            headerTitle: 'Add Story',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'chat'}
          component={ChatScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'passcodeSetup'}
          component={SetupPasscodeScreen}
          options={{
            headerTitle: '',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'passcodeVerify'}
          component={VerifyPasscodeScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'userProfile'}
          component={UserProfileScreen}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'darkMode'}
          component={DarkModeSettings}
          options={{
            headerTitle: 'Dark Mode',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: isThemeDark ? COLORS.white : COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: isThemeDark ? COLORS.white : COLORS.black,
          }}
        />
        <Stack.Screen
          name={'privacySecurity'}
          component={PrivacySecurityScreen}
          options={{
            headerTitle: 'Privacy and Security',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: isThemeDark ? COLORS.white : COLORS.black,
            },
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: isThemeDark ? COLORS.white : COLORS.black,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
