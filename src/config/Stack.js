/**
 * Realised by Ahmed Sbai
 * https://github.com/sbaiahmed1
 * @format
 * @flow strict-local
 */

import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
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
import SettingsScreen from '../screens/HomeSettingsScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import ReportProblem from '../screens/ReportProblemScreen';
import SearchChatsScreen from '../screens/SearchChatsScreen';
import SetupScreen from '../screens/SetupScreen';
import SplashScreen from '../screens/SplashScreen';
import StoryScreen from '../screens/StoryScreen';
import ChatScreen from '../screens/ChatScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

import {Avatar} from 'react-native-paper';

import {COLORS} from './Miscellaneous';

import ChatIcon from '../assets/images/chat.png';
import SettingsIcon from '../assets/images/settings.png';
import PeopleIcon from '../assets/images/two_people.png';
import SetupPasscodeScreen from '../screens/SetupPasscodeScreen';
import VerifyPasscodeScreen from '../screens/VerifyPasscodeScreen';
import {heightPercentageToDP} from './Dimensions';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      shifting={true}
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
                margin: heightPercentageToDP(-1),
              }}
              theme={{colors: {primary: COLORS.transparent}}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color}) => (
            <Avatar.Icon
              icon={SettingsIcon}
              color={color}
              size={40}
              style={{
                margin: heightPercentageToDP(-1),
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
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'splash'} component={SplashScreen} />
        <Stack.Screen name={'onboarding'} component={IntroScreen} />
        <Stack.Screen name={'login'} component={LoginScreen} />
        <Stack.Screen name={'setup'} component={SetupScreen} />
        <Stack.Screen name={'home'} component={HomeScreen} />
        <Stack.Screen name={'searchChats'} component={SearchChatsScreen} />
        <Stack.Screen name={'bugreport'} component={ReportProblem} />
        <Stack.Screen name={'activeStatus'} component={ActiveStatusScreen} />
        <Stack.Screen
          name={'changeUsername'}
          component={ChangeUsernameScreen}
        />
        <Stack.Screen name={'addBio'} component={AddBioActivity} />
        <Stack.Screen name={'editProfile'} component={EditProfileScreen} />
        <Stack.Screen name={'devices'} component={DevicesScreen} />
        <Stack.Screen name={'discover'} component={DiscoverPeopleScreen} />
        <Stack.Screen name={'story'} component={StoryScreen} />
        <Stack.Screen name={'addStory'} component={AddStoryScreen} />
        <Stack.Screen name={'chat'} component={ChatScreen} />
        <Stack.Screen name={'passcodeSetup'} component={SetupPasscodeScreen} />
        <Stack.Screen
          name={'passcodeVerify'}
          component={VerifyPasscodeScreen}
        />
        <Stack.Screen name={'userProfile'} component={UserProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
