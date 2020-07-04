import {
  FETCH_POSTS_START,
  FETCH_POSTS_END,
  GET_POSTS,
  GET_POST,
  CREATE_POST,
  DELETE_POST,
  LIKE_POST,
  UNLIKE_POST,
  SAVE_POST,
  UNSAVE_POST,
  CREATE_COMMENT,
  DELETE_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  BLOCK_USER,
  POST_ERROR,
  INCREMENT_POSTS_PAGE,
  RESET_POSTS_PAGE,
  RESET_POSTS,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  page: 1,
  nextPage: false,
  loading: false,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_POSTS:
      return {
        ...state,
        posts: [],
        post: null,
        page: 1,
        nextPage: false,
        loading: false,
        errors: [],
      };
    case FETCH_POSTS_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_POSTS_END:
      return {
        ...state,
        loading: false,
      };
    case GET_POSTS:
      return {
        ...state,
        posts: state.posts.concat(payload.posts),
        nextPage:
          payload.total === 0 || payload.results === payload.total
            ? false
            : true,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload.postId),
        post:
          state.post !== null && state.post._id === payload.postId
            ? null
            : state.post,
        loading: false,
      };
    case LIKE_POST:
    case UNLIKE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        post: { ...state.post, likes: payload.likes },
        loading: false,
      };
    case SAVE_POST:
    case UNSAVE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, saves: payload.saves } : post
        ),
        post: { ...state.post, saves: payload.saves },
        loading: false,
      };
    case CREATE_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId
            ? { ...post, comments: payload.comments }
            : post
        ),
        post: {
          ...state.post,
          comments: payload.comments,
        },
        loading: false,
      };
    case DELETE_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId
            ? {
                ...post,
                comments: payload.comments,
              }
            : post
        ),
        post: {
          ...state.post,
          comments: payload.comments,
        },
        loading: false,
      };
    case LIKE_COMMENT:
    case UNLIKE_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId
            ? {
                ...post,
                comments: post.comments.map((com) =>
                  com._id === payload.commentId
                    ? { ...com, likes: payload.likes }
                    : com
                ),
              }
            : post
        ),
      };
    // when a user blocks someone, we want to remove all posts belonging to 'someone'
    case BLOCK_USER:
      return {
        ...state,
        posts: state.posts.filter((post) => post.user._id !== payload.id),
        loading: false,
      };
    case INCREMENT_POSTS_PAGE:
      return {
        ...state,
        page: state.page + 1,
      };
    case RESET_POSTS_PAGE:
      return {
        ...state,
        page: 1,
      };
    case POST_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
