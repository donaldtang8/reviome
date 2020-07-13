import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';

// Actions to call on application load
import { getNotifications } from './redux/actions/notifications';

// Utility components
import Spinner from './components/spinner/spinner';
import AuthRoute from './utils/routes/AuthRoute';
import AdminRoute from './utils/routes/AdminRoute';
import ErrorBoundary from './pages/error/error-boundary';
import Alert from './components/alert/alert';

// Layout components
import Header from './components/header/header';
import Sidebar from './components/sidebar/sidebar';

// Pages
const Login = lazy(() => import('./pages/auth/login'));
const Register = lazy(() => import('./pages/auth/register'));
const ForgotPassword = lazy(() => import('./pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('./pages/auth/reset-password'));
const Error = lazy(() => import('./pages/error/error'));

const Explore = lazy(() => import('./pages/explore/explore'));
const Feed = lazy(() => import('./pages/feed/feed'));
const Post = lazy(() => import('./pages/post/post'));
const Account = lazy(() => import('./pages/account/account'));
const Profile = lazy(() => import('./pages/profile/profile'));
const Notifications = lazy(() => import('./pages/notifications/notifications'));

// Admin
const Reports = lazy(() => import('./pages/reports/reports'));
const Report = lazy(() => import('./pages/reports/report'));

const App = ({ getNotifications, auth: { isAuthenticated, user } }) => {
  // retrieve notifications when application is loaded so we can display notification count on page load
  useEffect(() => {
    getNotifications(1);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="body__container">
          <Header />
          <div className="main__container">
            <Alert />
            {isAuthenticated && <Sidebar />}
            <div className="content__container">
              <Suspense fallback={<Spinner />}>
                <ErrorBoundary>
                  <Switch>
                    <AuthRoute
                      exact
                      path="/"
                      component={() => <Feed pageType="feed" />}
                    />
                    <AuthRoute exact path="/post/:id" component={Post} />
                    <AuthRoute path="/explore" component={Explore} />
                    <AuthRoute
                      exact
                      path="/favorites"
                      component={() => <Feed pageType="favorites" />}
                    />
                    <AuthRoute exact path="/account" component={Account} />
                    <AuthRoute
                      exact
                      path="/profile/:user"
                      component={Profile}
                    />
                    <AuthRoute
                      exact
                      path="/notifications"
                      component={Notifications}
                    />
                    <AdminRoute exact path="/reports/:id" component={Report} />
                    <AdminRoute exact path="/reports" component={Reports} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route
                      exact
                      path="/forgot-password"
                      component={ForgotPassword}
                    />
                    <Route
                      path="/reset-password/:token"
                      component={ResetPassword}
                    />
                    <Route component={Error} />
                  </Switch>
                </ErrorBoundary>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getNotifications })(App);
