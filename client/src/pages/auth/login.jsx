import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from './../../redux/actions/auth';

import Spinner from './../../components/spinner/spinner';

const Login = ({ auth: { isAuthenticated, loading }, login, history }) => {
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData, history);
  };

  return (
    <div className="section__container auth__container">
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
              <input className="input__submit" type="submit" value="Login" />
            </form>
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">No Account?</Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login })(withRouter(Login));
