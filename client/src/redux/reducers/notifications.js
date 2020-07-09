import {
  RESET_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_START,
  FETCH_NOTIFICATIONS_END,
  GET_NOTIFICATIONS,
  GET_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  INCREMENT_NOTIFICATIONS_PAGE,
  RESET_NOTIFICATIONS_PAGE,
  NOTIFICATION_ERROR,
} from './../actions/types';

const initialState = {
  notifications: [],
  notification: null,
  loading: false,
  page: 1,
  nextPage: false,
  count: 0,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        notification: null,
        loading: false,
        page: 1,
        nextPage: false,
        count: 0,
        errors: [],
      };
    case FETCH_NOTIFICATIONS_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_NOTIFICATIONS_END:
      return {
        ...state,
        loading: false,
      };
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: state.notifications.concat(payload.notifications),
        count: payload.count,
        loading: false,
      };
    case GET_NOTIFICATION:
      return {
        ...state,
        notification: payload,
        loading: false,
      };
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification._id === payload.id ? payload.notification : notification
        ),
        loading: false,
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification._id !== payload.id
        ),
        loading: false,
      };
    case INCREMENT_NOTIFICATIONS_PAGE:
      return {
        ...state,
        page: state.page + 1,
      };
    case RESET_NOTIFICATIONS_PAGE:
      return {
        ...state,
        page: 1,
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        loading: false,
        errors: [payload, ...state.errors],
      };
    default:
      return state;
  }
}
