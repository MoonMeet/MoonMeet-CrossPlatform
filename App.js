import React from 'react';
import StackNavigator from './src/config/Stack';
import {Provider} from 'react-redux';
import {store, persistor} from './src/state/store';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

const App = () => {
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
