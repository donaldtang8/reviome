import {
  RESET_USERS_STATE,
  RESET_USERS,
  RESET_USER,
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
  const {
    type,
    payload
  } = action;

  switch (type) {
    case RESET_USERS_STATE:
      return {
        ...state,
        users: [],
          user: null,
          loading: false,
          errors: [],
      };
    case RESET_USERS:
      return {
        ...state,
        users: [],
          loading: false,
      };
    case RESET_USER:
      return {
        ...state,
        user: null,
          loading: false,
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
      return {
        ...state,
        loading: false,
          user: {
            ...state.user,
            followers: state.user.followers + 1
          },
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        loading: false,
          user: {
            ...state.user,
            followers: state.user.followers - 1
          },
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
    case USER_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}