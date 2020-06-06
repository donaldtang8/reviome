import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import Spinner from './../../components/spinner/spinner';

const AdminRoute = ({
  component: Component,
  auth: { isAuthenticated, user, loading },
  ...rest
}) => {
  return !loading ? (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Redirect to="/login" />
        ) : user.role === 'admin' ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  ) : (
    <Spinner />
  );
};

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AdminRoute);
