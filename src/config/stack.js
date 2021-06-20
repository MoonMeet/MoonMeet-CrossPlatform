/**
 * Realised by Ahmed Sbai
 * https://github.com/sbaiahmed1
 * @format
 * @flow strict-local
 */

import React from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import IntroScreen from "../components/IntroScreen";
import SplashScreen from "../components/SplashScreen";
import LoginScreen from "../components/LoginScreen";
import WelcomeScreen from "../components/WelcomeScreen";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"splash"} component={SplashScreen} />
        <Stack.Screen name={"onboarding"} component={IntroScreen} />
        <Stack.Screen name={"welcome"} component={WelcomeScreen} />
        <Stack.Screen name={"login"} component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
