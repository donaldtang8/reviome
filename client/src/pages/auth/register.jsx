import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { register } from './../../redux/actions/auth';

import Spinner from './../../components/spinner/spinner';

const Register = ({
  auth: { isAuthenticated, loading },
  register,
  history,
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const {
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConfirm,
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData, history);
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
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="form__label" htmlFor="firstName">
                First Name
              </label>
              <input
                className="form__input"
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="form__label" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="form__input"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="form__label" htmlFor="username">
                Username
              </label>
              <input
                className="form__input"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="form__label" htmlFor="email">
                Email
              </label>
              <input
                className="form__input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="form__label" htmlFor="password">
                Password
              </label>
              <input
                className="form__input"
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="form__label" htmlFor="passwordConfirm">
                Confirm Password
              </label>
              <input type="submit" value="Register" />
            </form>
            <Link to="/login">Have an account already?</Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { register })(withRouter(Register));
