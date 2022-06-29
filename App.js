import React from 'react';
import StackNavigator from './src/config/Stack';
import {UIManager, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/state/store';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

const App = () => {
  // TODO: add application animation
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StackNavigator />
        <Toast />
      </PersistGate>
    </Provider>
  );
};

export default App;
