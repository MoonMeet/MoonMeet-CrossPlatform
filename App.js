import React from "react";
import { StyleSheet, View } from "react-native";
import SplashScreen from "./components/SplashScreen";

const App = () => {
  return (
    <View style={styles.container}>
     <SplashScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
