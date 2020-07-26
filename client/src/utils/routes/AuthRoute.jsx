import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import Spinner from './../../components/spinner/spinner';
import Splash from './../../pages/splash/splash';

const AuthRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  return !loading ? (
    !isAuthenticated ? (
      <Splash />
    ) : (
      <Route {...rest} render={(props) => <Component {...props} />} />
    )
  ) : (
    <Spinner />
  );
};

AuthRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AuthRoute);
