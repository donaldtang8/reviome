import { combineReducers } from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

import auth from './auth';
import categories from './categories';
import notifications from './notifications';
import posts from './posts';
import users from './users';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: auth,
  categories: categories,
  notifications: notifications,
  posts: posts,
  users: users,
});

export default persistReducer(persistConfig, rootReducer);
