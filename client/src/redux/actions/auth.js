import axios from 'axios';
import { setAlert } from './alert';
import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
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
    // set auth state loading property to true
    dispatch({
      type: AUTH_LOADING,
    });
    // make api call
    const res = await axios.post('/api/users/signup', body, config);
    // dispatch register success action and redirect
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.data.user,
    });
    history.push('/');
  } catch (err) {
    /* back end server-returned errors */
    // if there is an error, check for err response object
    if (err.response) {
      // check error statusCode
      // if error code starts with '4', display error
      if (err.response.status.toString().startsWith('4')) {
        dispatch(setAlert(err.response.data.message, 'fail'));
      }
      // else, display generic error
      else {
        dispatch(
          setAlert('Oh no! Something went wrong, please try again.', 'fail')
        );
      }
    } else {
      /* front end client errors */
      dispatch(
        setAlert('Oh no! Something went wrong, please try again.', 'fail')
      );
    }
    // dispatch auth error action type
    dispatch({
      type: AUTH_ERROR,
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
    // set auth state loading property to true
    dispatch({
      type: AUTH_LOADING,
    });
    // make api call
    const res = await axios.post('/api/users/login', body, config);
    // dispatch login success action and redirect
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.data.user,
    });
    history.push('/');
  } catch (err) {
    /* back end server-returned errors */
    // if there is an error, check for err response object
    if (err.response) {
      // check error statusCode
      // if error code starts with '4', display error
      if (err.response.status.toString().startsWith('4')) {
        dispatch(setAlert(err.response.data.message, 'fail'));
      }
      // else, display generic error
      else {
        dispatch(
          setAlert('Oh no! Something went wrong, please try again.', 'fail')
        );
      }
    } else {
      /* front end client errors */
      dispatch(
        setAlert('Oh no! Something went wrong, please try again.', 'fail')
      );
    }
    // dispatch auth error action type
    dispatch({
      type: AUTH_ERROR,
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
    console.log(err);
  }
};

/**
 * @action      updatePassword
 * @description Update password
 **/
export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    const body = JSON.stringify(passwordData);
    // set auth state loading property to true
    dispatch({
      type: AUTH_LOADING,
    });
    await axios.patch('/api/users/updatePassword', body, config);
    // dispatch success action
    dispatch({
      type: AUTH_SUCCESS,
    });
    dispatch(setAlert('Success!', 'success'));
  } catch (err) {
    /* back end server-returned errors */
    // if there is an error, check for err response object
    if (err.response) {
      // check error statusCode
      // if error code starts with '4', display error
      if (err.response.status.toString().startsWith('4')) {
        dispatch(setAlert(err.response.data.message, 'fail'));
      }
      // else, display generic error
      else {
        dispatch(
          setAlert('Oh no! Something went wrong, please try again.', 'fail')
        );
      }
    } else {
      /* front end client errors */
      dispatch(
        setAlert('Oh no! Something went wrong, please try again.', 'fail')
      );
    }
    // dispatch auth error action type
    dispatch({
      type: AUTH_ERROR,
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
    // set auth state loading property to true
    dispatch({
      type: AUTH_LOADING,
    });
    const res = await axios.post('/api/users/forgotPassword', body, config);
    // dispatch success action
    dispatch({
      type: AUTH_SUCCESS,
    });
    dispatch(setAlert(res.data.message, 'success'));
  } catch (err) {
    /* back end server-returned errors */
    // if there is an error, check for err response object
    if (err.response) {
      // check error statusCode
      // if error code starts with '4', display error
      if (err.response.status.toString().startsWith('4')) {
        dispatch(setAlert(err.response.data.message, 'fail'));
      }
      // else, display generic error
      else {
        dispatch(
          setAlert('Oh no! Something went wrong, please try again.', 'fail')
        );
      }
    } else {
      /* front end client errors */
      dispatch(
        setAlert('Oh no! Something went wrong, please try again.', 'fail')
      );
    }
    // dispatch auth error action type
    dispatch({
      type: AUTH_ERROR,
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
    // set auth state loading property to true
    dispatch({
      type: AUTH_LOADING,
    });
    await axios.patch(`/api/users/resetPassword/${token}`, body, config);
    // dispatch success action
    dispatch({
      type: AUTH_SUCCESS,
    });
    dispatch(setAlert('Success!', 'success'));
    history.push('/login');
  } catch (err) {
    /* back end server-returned errors */
    // if there is an error, check for err response object
    if (err.response) {
      // check error statusCode
      // if error code starts with '4', display error
      if (err.response.status.toString().startsWith('4')) {
        dispatch(setAlert(err.response.data.message, 'fail'));
      }
      // else, display generic error
      else {
        dispatch(
          setAlert('Oh no! Something went wrong, please try again.', 'fail')
        );
      }
    } else {
      /* front end client errors */
      dispatch(
        setAlert('Oh no! Something went wrong, please try again.', 'fail')
      );
    }
    // dispatch auth error action type
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
