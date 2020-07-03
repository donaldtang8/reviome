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
    <div className="section__container auth__container">
      <div className="auth__container--form">
        {loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <form className="form__container" onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => handleChange(e)}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => handleChange(e)}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => handleChange(e)}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleChange(e)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => handleChange(e)}
                required
              />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Password Confirm"
                value={passwordConfirm}
                onChange={(e) => handleChange(e)}
                required
              />

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
