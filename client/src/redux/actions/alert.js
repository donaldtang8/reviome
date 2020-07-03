import { RESET_ALERT, SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';

export const resetAlerts = () => (dispatch) => {
  dispatch({
    type: RESET_ALERT,
  });
};

export const setAlert = (msg, type, timeout = 5000) => (dispatch) => {
  // generate unique id for the alert
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, type, id },
  });
  // after 5 seconds, we will send a dispatch of type REMOVE_ALERT
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
