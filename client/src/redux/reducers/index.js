import { combineReducers } from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

import alert from './alert';
import auth from './auth';
import categories from './categories';
import notifications from './notifications';
import posts from './posts';
import reports from './reports';
import users from './users';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'alerts',
    'auth',
    'categories',
    'notifications',
    'posts',
    'reports',
    'users',
  ],
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user'],
};

const rootReducer = combineReducers({
  alerts: alert,
  auth: persistReducer(authPersistConfig, auth),
  // auth: auth,
  categories: categories,
  notifications: notifications,
  posts: posts,
  reports: reports,
  users: users,
});

export default persistReducer(rootPersistConfig, rootReducer);
