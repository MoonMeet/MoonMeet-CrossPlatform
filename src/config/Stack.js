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

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'home'}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
