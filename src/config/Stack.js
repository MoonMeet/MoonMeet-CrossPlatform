/**
 * Realised by Ahmed Sbai
 * https://github.com/sbaiahmed1
 * @format
 * @flow strict-local
 */

import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import IntroScreen from '../activities/IntroScreen';
import SplashScreen from '../activities/SplashScreen';
import LoginScreen from '../activities/LoginScreen';
import SetupScreen from '../activities/SetupScreen';
import SettingsScreen from '../activities/HomeSettingsScreen';
import SearchChatsScreen from '../activities/SearchChatsScreen';
import ReportProblem from '../activities/ReportProblemScreen';
import ActiveStatusScreen from '../activities/ActiveStatusScreen';
import ChangeUsernameScreen from '../activities/ChangeUsernameScreen';
import AddBioActivity from '../activities/AddBioScreen';
import EditProfileScreen from '../activities/EditProfileScreen';
import DevicesScreen from '../activities/DevicesScreen';
import DiscoverPeopleScreen from '../activities/DiscoverPeopleScreen';
import StoryScreen from '../activities/StoryScreen';
import AddStoryScreen from '../activities/AddStoryScreen';
import HomeChats from '../activities/HomeChatsScreen.js';
import HomePeople from '../activities/HomePeopleScreen';

import {Avatar} from 'react-native-paper';

import {COLORS} from './Miscellaneous';

import ChatIcon from '../assets/images/chat.png';
import PeopleIcon from '../assets/images/two_people.png';
import SettingsIcon from '../assets/images/settings.png';
import ChatScreen from '../activities/ChatScreen';
import SetupPasscodeScreen from '../activities/SetupPasscodeScreen';
import VerifyPasscodeScreen from '../activities/VerifyPasscodeScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName={'Chats'}
      activeColor={COLORS.accentLight}
      inactiveColor={COLORS.darkGrey}
      barStyle={{backgroundColor: COLORS.white}}>
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
                margin: '-25%',
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
                margin: '-35%',
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
                margin: '-31%',
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default React.memo(StackNavigator);
