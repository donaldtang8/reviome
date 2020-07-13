import axios from 'axios';
import {
  RESET_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_START,
  FETCH_NOTIFICATIONS_END,
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
 * @action    incrementNotificationsPage
 * @description Increment page
 **/
export const incrementNotificationsPage = () => async (dispatch) => {
  dispatch({
    type: INCREMENT_NOTIFICATIONS_PAGE,
  });
};

/**
 * @action    getNotifications
 * @description Retrieve all notifications for user
 **/
export const getNotifications = (page) => async (dispatch) => {
  try {
    // set notification state loading property to true
    dispatch({
      type: FETCH_NOTIFICATIONS_START,
    });
    // make api call
    const res = await axios.get(`/api/notifications/me`);
    // only dispatch action if there are results returned
    if (res.data.results > 0) {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: {
          notifications: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
          count: res.data.count,
        },
      });
      dispatch({
        type: INCREMENT_NOTIFICATIONS_PAGE,
      });
    }
    // set notification state loading property to false
    dispatch({
      type: FETCH_NOTIFICATIONS_END,
    });
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
    // set notification state loading property to true
    dispatch({
      type: FETCH_NOTIFICATIONS_START,
    });
    // make api call
    const res = await axios.get(`/api/notifications/${id}`);
    // dispatch action when server returns result
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
 * @description Accepts array of notifications and sets read property to true
 **/
export const setRead = ([...notifications]) => async (dispatch) => {
  try {
    // loop through array of notifications and for each notification, make an api call to update the read property of that notification to true
    if (notifications.length > 0) {
      notifications.map(async (notification) => {
        if (notification.read) return;
        // make api call
        const res = await axios.patch(
          `/api/notifications/${notification._id}/read`
        );
        // update notification
        dispatch({
          type: UPDATE_NOTIFICATION,
          payload: {
            id: notification._id,
            notification: res.data.data.doc,
          },
        });
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
