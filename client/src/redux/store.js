import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';

import thunk from 'redux-thunk';
import rootReducer from './reducers';

let middlewares;
if (process.env.NODE_ENV === 'production') {
  middlewares = [];
} else {
  middlewares = [thunk];
}

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);

export default { store, persistStore };
