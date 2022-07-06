import React from 'react';
import StackNavigator from './src/config/Stack';
import {UIManager, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/state/store';
import {PersistGate} from 'redux-persist/integration/react';
import {NativeBaseProvider} from 'native-base';
import Toast from 'react-native-toast-message';
import {enableFreeze} from 'react-native-screens';

const App = () => {
  // Enabling the expremental freeze of react-native-screens
  enableFreeze(true);
  // TODO: add application animation
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NativeBaseProvider>
          <StackNavigator />
          <Toast />
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
