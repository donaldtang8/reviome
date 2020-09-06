import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// redux
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from './../../redux/actions/auth';
// components
import Spinner from './../../components/spinner/spinner';
// gtag
import TagManager from 'react-gtm-module';

const Login = ({
  auth: { isAuthenticated, loading, user },
  login,
  history,
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated, history]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  let tagManagerArgs = {
    dataLayer: {
      userId: null,
      event: 'login_user',
      page: 'login',
    },
    dataLayerName: 'PageDataLayer',
  };

  useEffect(() => {
    if (user != null) {
      tagManagerArgs.dataLayer.userId = user._id;
      TagManager.dataLayer(tagManagerArgs);
      history.push('/');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData, history);
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
