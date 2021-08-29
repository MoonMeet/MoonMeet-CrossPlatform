/**
 * Realised by Ahmed Sbai
 * https://github.com/sbaiahmed1
 * @format
 * @flow strict-local
 */

import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import IntroScreen from '../activities/IntroScreen';
import SplashScreen from '../activities/SplashScreen';
import LoginScreen from '../activities/LoginScreen';
import SetupScreen from '../activities/SetupScreen';
import HomeScreen from '../activities/HomeScreen';
import SettingsScreen from '../activities/SettingsScreen';
import SearchChatsScreen from '../activities/SearchChatsScreen';
import ReportProblem from '../activities/ReportProblemScreen';
import Toast from 'react-native-toast-message';
import ActiveStatusScreen from '../activities/ActiveStatusScreen';
import ChangeUsernameScreen from '../activities/ChangeUsernameScreen';
import AddBioActivity from '../activities/AddBioScreen';
import EditProfileScreen from '../activities/EditProfileScreen';
import DevicesScreen from '../activities/DevicesScreen';
import DiscoverPeopleScreen from '../activities/DiscoverPeopleScreen';
import StoryScreen from '../activities/StoryScreen';
import AddStoryScreen from '../activities/AddStoryScreen';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name={'settings'} component={SettingsScreen} />
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
      </Stack.Navigator>
      <Toast ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default React.memo(StackNavigator);
