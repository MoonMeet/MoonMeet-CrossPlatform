import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';
import {AuthReducer} from './reducers';
import AsyncStorage from '@react-native-community/async-storage';

const rootReducer = combineReducers({
  authentication: AuthReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'MM',
  storage: AsyncStorage,
  whitelist: ['authentication'],
  stateReconciler: autoMergeLevel2,
};
const pReducer = persistReducer(persistConfig, rootReducer);

// FIXME composeWithDevTools could be removed in prod mode
// could be useful to keep it : https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f
// DevTools is enabled and redux-thunk is added automatically when using configureStore :
// https://github.com/reduxjs/redux-toolkit/blob/master/docs/usage/usage-guide.md#simplifying-store-setup-with-configurestore
export const store = createStore(pReducer, {}, compose(applyMiddleware(thunk)));

export const persistor = persistStore(store);
