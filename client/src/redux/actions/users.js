import axios from 'axios';
import { setAlert } from './alert';
import { logout } from './auth';
import {
  RESET_USERS_STATE,
  RESET_USERS,
  UPDATE_ME,
  GET_USERS,
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
 * @action    resetUsersState
 * @description Reset users state
 **/
export const resetUsersState = () => async (dispatch) => {
  dispatch({
    type: RESET_USERS_STATE,
  });
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
    // make api call
    const res = await axios.get('/api/users/me');
    dispatch({
      type: GET_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    updateMe
 * @description Update self user document
 **/
export const updateMe = (formData) => async (dispatch) => {
  try {
    // update photo to firebase and retrieve image URL to update user document
    if (formData.photo) {
      // upload to firebase
      let ref = await uploadImage(formData.photo.name, formData.photo);
      // retrieve image url
      let url = await getImageURL(ref);
      // add photo property in formData and attach url to it
      formData.photo = url;
    }
    // make api call
    const res = await axios.patch('/api/users/updateMe', formData, config);
    dispatch({
      type: UPDATE_ME,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action      deleteMe
 * @description Set self to inactive
 **/
export const deleteMe = () => async (dispatch) => {
  try {
    // make api call
    await axios.delete('/api/users');
    dispatch({
      type: LOGOUT,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    updateSocials
 * @description Update social links
 **/
export const updateSocials = (formData) => async (dispatch) => {
  try {
    //  make api call
    const res = await axios.patch('/api/users/updateSocials', formData, config);
    dispatch({
      type: UPDATE_ME,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
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
    // make api call
    const res = await axios.get(`/api/users/id/${id}`);
    dispatch({
      type: GET_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    getUserByUsername
 * @description Get user by username
 **/
export const getUserByUsername = (user) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.get(`/api/users/user/${user}`);
    dispatch({
      type: GET_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    console.log(err);
    console.log(err.response);
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    getUserFollowingList
 * @description Given the id of a user, retrieve the list of users that the user follows
 **/
export const getUserFollowingList = (id) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.get(`/api/users/following/${id}`);
    dispatch({
      type: GET_USERS,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    followUserById
 * @description Follow user by id
 **/
export const followUserById = (id) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/users/follow/${id}`);
    dispatch({
      type: FOLLOW_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    unfollowUserById
 * @description Unfollow user by id
 **/
export const unfollowUserById = (id) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/users/unfollow/${id}`);
    dispatch({
      type: UNFOLLOW_USER,
      payload: res.data.data.doc,
    });
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    blockUserById
 * @description Block user by id
 **/
export const blockUserById = (id) => async (dispatch) => {
  try {
    // make api call
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
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    unblockUserById
 * @description Unblock user by id
 **/
export const unblockUserById = (id) => async (dispatch) => {
  try {
    // make api call
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
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
    // dispatch post error action type
    dispatch({
      type: USER_ERROR,
    });
  }
};

/**
 * @action    banUserById
 * @description Ban user by id
 **/
export const banUserById = (id, formData) => async (dispatch) => {
  try {
    // make api call
    await axios.patch(`/api/users/ban/${id}`, formData, config);
    dispatch(setAlert('Account successfully banned', 'success'));
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
  }
};

/**
 * @action    unbanUserById
 * @description Unban user by id
 **/
export const unbanUserById = (id, formData) => async (dispatch) => {
  try {
    // make api call
    await axios.patch(`/api/users/unban/${id}`, formData, config);
    dispatch(setAlert('Account successfully unbanned', 'success'));
  } catch (err) {
    /* back end server-returned errors */
    if (err.response) {
      // if user is making unauthorized request or token expired, log out
      if (err.response.status === 401) {
        dispatch(logout());
      } else if (err.response.status.toString().startsWith('4')) {
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
  }
};
