import axios from 'axios';

import {
  RESET_USERS,
  UPDATE_ME,
  GET_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  BLOCK_USER,
  UNBLOCK_USER,
  LOGOUT,
  AUTH_ERROR,
  USER_ERROR,
} from './types';

import { uploadImage, getImageURL } from './../../firebase/firebase.utils';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @action    resetUsers
 * @description Reset users
 **/
export const resetUsers = () => async (dispatch) => {
  dispatch({
    type: RESET_USERS,
  });
};

// ACCOUNT PAGE ACTIONS
/**
 * @action    getMe
 * @description Get self user document
 **/
export const getMe = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users/me');
    dispatch({
      type: GET_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    updateMe
 * @description Update self user document
 **/
export const updateMe = (formData) => async (dispatch) => {
  try {
    if (formData.photo) {
      // upload to firebase
      let ref = await uploadImage(formData.photo.name, formData.photo);
      // retrieve image url
      let url = await getImageURL(ref);
      // add photo property in formData and attach url to it
      formData.photo = url;
    }
    const res = await axios.patch('/api/users/updateMe', formData, config);
    dispatch({
      type: UPDATE_ME,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action      deleteMe
 * @description Set self to inactive
 **/
export const deleteMe = () => async (dispatch) => {
  try {
    await axios.delete('/api/users');
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

// PROFILE PAGE ACTIONS
/**
 * @action    getUserById
 * @description Get user by id
 **/
export const getUserById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/id/${id}`);
    dispatch({
      type: GET_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getUserByUsername
 * @description Get user by username
 **/
export const getUserByUsername = (user) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/user/${user}`);
    dispatch({
      type: GET_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    followUserById
 * @description Follow user by id
 **/
export const followUserById = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/users/follow/${id}`);
    dispatch({
      type: FOLLOW_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    unfollowUserById
 * @description Unfollow user by id
 **/
export const unfollowUserById = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/users/unfollow/${id}`);
    dispatch({
      type: UNFOLLOW_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    blockUserById
 * @description Block user by id
 **/
export const blockUserById = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/users/block/${id}`);
    dispatch({
      type: BLOCK_USER,
      payload: {
        following: res.data.data.selfFollowing,
        blocking: res.data.data.doc,
        id: id,
      },
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    unblockUserById
 * @description Unblock user by id
 **/
export const unblockUserById = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/users/unblock/${id}`);
    dispatch({
      type: UNBLOCK_USER,
      payload: {
        following: res.data.data.selfFollowing,
        blocking: res.data.data.doc,
        id: id,
      },
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.message,
    });
  }
};
