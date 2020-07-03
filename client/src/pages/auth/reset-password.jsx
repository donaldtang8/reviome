import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { resetPassword } from './../../redux/actions/auth';

import Spinner from './../../components/spinner/spinner';

const ResetPassword = ({
  auth: { isAuthenticated, loading },
  resetPassword,
  match,
  history,
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, []);

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });

  const { password, passwordConfirm } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword(formData, match.params.token, history);
  };

  return (
    <div className="section__container auth__container">
      <div className="auth__container--form">
        {loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <form className="form__container" onSubmit={handleSubmit}>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirm New Password"
                value={passwordConfirm}
                onChange={handleChange}
                required
              />
              <input type="submit" value="Submit" />
            </form>
          </Fragment>
        )}
      </div>

      <Link to="/login">Back to login</Link>
    </div>
  );
};

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { resetPassword })(
  withRouter(ResetPassword)
);
