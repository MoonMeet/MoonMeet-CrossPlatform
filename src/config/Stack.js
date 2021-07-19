/**
 * Realised by Ahmed Sbai
 * https://github.com/sbaiahmed1
 * @format
 * @flow strict-local
 */

import React from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import IntroScreen from "../activities/IntroScreen";
import SplashScreen from "../activities/SplashScreen";
import LoginScreen from "../activities/LoginScreen";
import LoginHelp from "../activities/LoginHelp";
import SetupScreen from "../activities/SetupScreen";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"splash"} component={SplashScreen} />
        <Stack.Screen name={"onboarding"} component={IntroScreen} />
        <Stack.Screen name={"login"} component={LoginScreen} />
        <Stack.Screen name={"login_help"} component={LoginHelp} />
        <Stack.Screen name={"setup"} component={SetupScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
