import React from 'react';
import StackNavigator from './src/config/Stack';
import {UIManager, Platform} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import Toast from 'react-native-toast-message';
import {enableFreeze} from 'react-native-screens';
import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  // Enabling the experimental freeze of react-native-screens
  enableFreeze(true);
  // TODO: add application animation
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  return (
    <PaperProvider>
      <NativeBaseProvider>
        <StackNavigator />
        <Toast />
      </NativeBaseProvider>
    </PaperProvider>
  );
};

export default App;
