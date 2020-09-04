import React from 'react';
import ReactDOM from 'react-dom';
// ROUTING
import { BrowserRouter } from 'react-router-dom';
// REDUX
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
// REDUX PERSIST
import { PersistGate } from 'redux-persist/integration/react';
// GTM
import TagManager from 'react-gtm-module';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const tagManagerArgs = {
  gtmId: 'GTM-T8V295T',
  dataLayerName: 'PageDataLayer',
};

TagManager.initialize(tagManagerArgs);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
