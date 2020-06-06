import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_ERROR,
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @action    Register
 * @description Registers new user
 **/
export const register = (formData, history) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);
    const res = await axios.post('/api/users/signup', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.data.user,
    });
    // history.push('/');
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.message,
    });
  }
};

/**
 * @action    Login
 * @description Log in existing user
 **/
export const login = (formData, history) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);
    const res = await axios.post('/api/users/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.data.user,
    });
    // history.push('/');
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.message,
    });
  }
};

/**
 * @action      Logout
 * @description Log out existing user
 **/
export const logout = () => async (dispatch) => {
  try {
    await axios.get('/api/users/logout');
    dispatch({
      type: LOGOUT,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action      updatePassword
 * @description Update password
 **/
export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    const body = JSON.stringify(passwordData);
    await axios.patch('/api/users/updatePassword', body, config);
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action      forgotPassword
 * @description Creates forgot password request
 **/
export const forgotPassword = (formData, history) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);
    await axios.post('/api/users/forgotPassword', body, config);
    history.push('/login');
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action      resetPassword
 * @description Reset password with provided reset token
 **/
export const resetPassword = (passwordData, token, history) => async (
  dispatch
) => {
  try {
    const body = JSON.stringify(passwordData);
    await axios.patch(`/api/users/resetPassword/${token}`, body, config);
    history.push('/login');
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.message,
    });
  }
};
