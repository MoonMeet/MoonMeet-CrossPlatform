/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React from 'react';

import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
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
import HomeStories from '../screens/HomeStoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import ReportProblem from '../screens/ReportProblemScreen';
import SetupScreen from '../screens/SetupScreen';
import SplashScreen from '../screens/SplashScreen';
import StoryScreen from '../screens/StoryScreen';
import ChatScreen from '../screens/ChatScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import {BottomNavigation} from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';

import {COLORS, FONTS} from './Miscellaneous';

import SetupPasscodeScreen from '../screens/SetupPasscodeScreen';
import VerifyPasscodeScreen from '../screens/VerifyPasscodeScreen';
import {fontValue} from './Dimensions';
import {MoonMeetDarkTheme} from './Theme/Theme';
import {ThemeContext} from './Theme/Context';
import DarkModeSettings from '../screens/DarkModeScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import {StyleSheet} from 'react-native';
import {Easing} from 'react-native-reanimated';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'chats',
      title: 'Chats',
      focusedIcon: 'chat',
      unfocusedIcon: 'chat-outline',
    },
    {
      key: 'people',
      title: 'People',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
    {
      key: 'stories',
      title: 'Stories',
      focusedIcon: 'book',
      unfocusedIcon: 'book-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    chats: HomeChats,
    people: HomePeople,
    stories: HomeStories,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationType={'shifting'}
      sceneAnimationEasing={Easing.ease}
      style={styles.navStyle}
      barStyle={{backgroundColor: COLORS.white}}
      activeColor={COLORS.accentLight}
      inactiveColor={COLORS.lightGrey}
    />
  );
}

const styles = StyleSheet.create({
  navStyle: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.redDarkError,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});

const StackNavigator = () => {
  const {isThemeDark} = React.useContext(ThemeContext);

  const routeNameRef = React.useRef();
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef?.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics()?.logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      theme={isThemeDark ? MoonMeetDarkTheme : DefaultTheme}>
      <Stack.Navigator>
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
            headerTitle: 'Me',
            headerTitleStyle: {
              fontFamily: FONTS.regular,
              fontSize: fontValue(20.5),
              color: isThemeDark ? COLORS.white : COLORS.black,
            },
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
            headerShown: true,
            headerTitle: 'Add story',
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
          options={{
            headerShown: true,
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
        />
        <Stack.Screen
          name={'chatSettings'}
          component={ChatSettingsScreen}
          options={{
            gestureEnabled: false,
            headerShown: true,
            headerTitle: 'Chat Settings',
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
          options={{
            headerTitle: '',
            headerBackTitleVisible: true,
            headerShadowVisible: false,
            headerTintColor: COLORS.black,
          }}
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
