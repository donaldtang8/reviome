import {
  RESET_USERS,
  GET_USERS,
  GET_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  BLOCK_USER,
  UNBLOCK_USER,
  USER_ERROR,
} from './../actions/types';

const initialState = {
  users: [],
  user: null,
  loading: false,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_USERS:
      return {
        ...state,
        users: [],
        user: null,
        loading: false,
        errors: [],
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case GET_USER:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...state,
        loading: false,
        user: { ...state.user, following: payload.blocking },
      };
    case USER_ERROR:
      return {
        ...state,
        loading: false,
        errors: [payload, ...state.errors],
      };
    default:
      return state;
  }
}
