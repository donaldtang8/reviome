import axios from 'axios';
import {
  RESET_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_START,
  GET_NOTIFICATIONS,
  GET_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  INCREMENT_NOTIFICATIONS_PAGE,
  NOTIFICATION_ERROR,
} from './types';

/**
 * @action    resetNotifications
 * @description Reset posts array in state
 **/
export const resetNotifications = () => async (dispatch) => {
  dispatch({
    type: RESET_NOTIFICATIONS,
  });
};

/**
 * @action    getNotifications
 * @description Retrieve all notifications for user
 **/
export const getNotifications = (page) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_NOTIFICATIONS_START,
    });
    const res = await axios.get(`/api/notifications/me`);
    if (res.data.results > 0) {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: {
          notifications: res.data.data.doc,
          total: res.data.total,
        },
      });
    }
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getNotification
 * @description Retrieve notification given id
 **/
export const getNotification = (id) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_NOTIFICATIONS_START,
    });
    const res = await axios.get(`/api/notifications/${id}`);
    dispatch({
      type: GET_NOTIFICATION,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    setOpen
 * @description Toggle notification open status
 **/
export const setOpen = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/notifications/${id}/open`);
    dispatch({
      type: UPDATE_NOTIFICATION,
      payload: { notificationId: id, notification: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    setRead
 * @description Toggle notification read status
 **/
export const setRead = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/notifications/${id}/read`);
    dispatch({
      type: UPDATE_NOTIFICATION,
      payload: { notificationId: id, notification: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    deleteNotificationById
 * @description Delete notification given id
 **/
export const deleteNotificationById = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/notifications/${id}`);
    dispatch({
      type: DELETE_NOTIFICATION,
      payload: { id },
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.message,
    });
  }
};
