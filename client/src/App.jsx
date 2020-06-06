import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';

// Utility components
import Spinner from './components/spinner/spinner';

// Layout components

// Pages
const Login = lazy(() => import('./pages/auth/login'));

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="body__container">
          <div className="main__container">
            <div className="content__container">
              <Suspense fallback={<Spinner />}>
                <Switch>
                  <Route exact path="/" component={Login} />
                </Switch>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
