import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GET_ME,
  UPDATE_ME,
  FOLLOW_USER,
  UNFOLLOW_USER,
  BLOCK_USER,
  UNBLOCK_USER,
  FOLLOW_CATEGORY,
  UNFOLLOW_CATEGORY,
  AUTH_ERROR,
} from './../actions/types';

const initialState = {
  isAuthenticated: null,
  loading: false,
  user: null,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // Authentication related actions
    case GET_ME:
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        errors: [...state.errors, payload],
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    // User related actions
    case UPDATE_ME:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...state,
        user: { ...state.user, following: payload },
        loading: false,
      };
    case BLOCK_USER:
    case UNBLOCK_USER:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          following: payload.following,
          block_to: payload.blocking,
        },
      };
    case FOLLOW_CATEGORY:
    case UNFOLLOW_CATEGORY:
      return {
        ...state,
        user: {
          ...state.user,
          categories_following: payload,
        },
      };
    case AUTH_ERROR:
      return state;
    default:
      return state;
  }
}
