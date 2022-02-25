import React from 'react';
import StackNavigator from './src/config/Stack';
import {Provider} from 'react-redux';
import {store, persistor} from './src/state/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StackNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
