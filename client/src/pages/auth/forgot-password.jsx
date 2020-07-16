import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { forgotPassword } from './../../redux/actions/auth';

import Spinner from './../../components/spinner/spinner';

const ForgotPassword = ({
  auth: { isAuthenticated, loading },
  forgotPassword,
  history,
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, []);
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(formData, history);
  };

  return (
    <div className="auth__container">
      <div className="auth__container--form">
        <div className="auth__container--logo">revio</div>
        {loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <form className="form__container" onSubmit={handleSubmit}>
              <input
                className="form__input"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleChange}
                required
              />
              <label className="form__label" htmlFor="email">
                Email
              </label>
              <input className="input__submit" type="submit" value="Submit" />
            </form>
            <Link to="/login">Back to login</Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { forgotPassword })(
  withRouter(ForgotPassword)
);
