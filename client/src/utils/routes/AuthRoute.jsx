import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import Spinner from './../../components/spinner/spinner';

const AuthRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  return !loading ? (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
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
