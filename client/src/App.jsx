import React, { useEffect, lazy, Suspense } from 'react';
import {
  Redirect,
  withRouter,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';

// Actions to call on application load
import { getNotificationCount } from './redux/actions/notifications';

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
const Reports = lazy(() => import('./pages/admin/reports'));
const Report = lazy(() => import('./pages/admin/report'));
const Categories = lazy(() => import('./pages/admin/categories'));
const CategoryForm = lazy(() => import('./pages/admin/category-form'));
const CategoryItem = lazy(() => import('./pages/admin/category-item'));

const App = ({
  getNotificationCount,
  auth: { isAuthenticated, user },
  history,
}) => {
  // THEME - Automatically set to 'dark' by default
  useEffect(() => {
    localStorage.setItem('theme', 'dark');
  }, []);

  // Redirects  non-authenticated users to root URL if user attempts to visit authenticated page
  useEffect(() => {
    if (!isAuthenticated) {
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/forgot-password' &&
        !window.location.pathname.startsWith('/reset-password')
      ) {
        history.push('/');
      } else {
        history.push(window.location.pathname);
      }
    }
  }, [window.location.pathname]);

  // retrieve notifications when application is loaded so we can display notification count on page load
  useEffect(() => {
    if (isAuthenticated) {
      getNotificationCount(user._id);
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="body__container">
          <Header />
          <main className="main__container">
            <Alert />
            {isAuthenticated && <Sidebar />}
            <div
              className={
                !isAuthenticated
                  ? window.location.pathname === '/'
                    ? 'content__container splash__full'
                    : 'content__container'
                  : 'content__container'
              }
            >
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
                    <AdminRoute
                      exact
                      path="/manage/categories"
                      component={Categories}
                    />
                    <AdminRoute
                      exact
                      path="/manage/categories/create"
                      component={CategoryForm}
                    />
                    <AdminRoute
                      exact
                      path="/manage/category/:id"
                      component={CategoryItem}
                    />
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
          </main>
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  getNotificationCount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getNotificationCount })(
  withRouter(App)
);
