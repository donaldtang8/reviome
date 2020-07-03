import axios from 'axios';
import { setAlert } from './alert';
import { logout } from './auth';
import {
  RESET_POSTS,
  FETCH_POSTS_START,
  FETCH_POSTS_END,
  GET_POSTS,
  GET_POST,
  CREATE_POST,
  DELETE_POST,
  LIKE_POST,
  UNLIKE_POST,
  CREATE_COMMENT,
  DELETE_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  SAVE_POST,
  UNSAVE_POST,
  INCREMENT_POSTS_PAGE,
  POST_ERROR,
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @action    resetPosts
 * @description Reset posts array in state
 **/
export const resetPosts = () => async (dispatch) => {
  dispatch({
    type: RESET_POSTS,
  });
};

/**
 * @action    getFeed
 * @description Retrieve posts for user's feed
 **/
export const getFeed = (page) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    // make api call
    const res = await axios.get(`/api/posts/feed?page=${page}`);
    // dispatch action to update posts if results are returned
    if (res.data.results > 0) {
      // Dispatch get action to update posts
      dispatch({
        type: GET_POSTS,
        payload: {
          posts: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
        },
      });
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
    // set state loading property to false
    dispatch({
      type: FETCH_POSTS_END,
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    getPostsByUser
 * @description Retrieve posts from user given id
 **/
export const getPostsByUser = (page, id) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    // make api call
    const res = await axios.get(`/api/posts/user/${id}?page=${page}`);
    // dispatch action to update posts if results are returned
    if (res.data.results > 0) {
      dispatch({
        type: GET_POSTS,
        payload: {
          posts: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
        },
      });
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
    // set state loading property to false
    dispatch({
      type: FETCH_POSTS_END,
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    getPostById
 * @description Retrieve post given id
 **/
export const getPostById = (id) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/${id}`);
    // dispatch action to update post if results are returned
    dispatch({
      type: GET_POST,
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    getPostsByCategoryId
 * @description Retrieve posts based on category id
 **/
export const getPostsByCategoryId = (page, category) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    // make api call
    const res = await axios.get(
      `/api/posts/category/id/${category}?page=${page}`
    );
    // dispatch action to update posts if results are returned
    if (res.data.results > 0) {
      dispatch({
        type: GET_POSTS,
        payload: {
          posts: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
        },
      });
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    getPostsByCategorySlug
 * @description Retrieve posts based on category slug
 **/
export const getPostsByCategorySlug = (page, category) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    // make api call
    const res = await axios.get(
      `/api/posts/category/slug/${category}?page=${page}`
    );
    // dispatch action to update posts if results are returned
    if (res.data.results > 0) {
      dispatch({
        type: GET_POSTS,
        payload: {
          posts: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
        },
      });
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    getSavedPosts
 * @description Retrieve saved posts
 **/
export const getSavedPosts = (page) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    // make api call
    const res = await axios.get(`/api/posts/saves?page=${page}`);
    // Dispatch get action to update posts
    if (res.data.results > 0) {
      dispatch({
        type: GET_POSTS,
        payload: {
          posts: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
        },
      });
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
    // set state loading property to false
    dispatch({
      type: FETCH_POSTS_END,
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    getSavedPostsByUser
 * @description Retrieve saved posts of user
 **/
export const getSavedPostsByUser = (page, id) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_POSTS_START,
    });
    // make api call
    const res = await axios.get(`/api/posts/user/${id}/saves?page=${page}`);
    // Dispatch get action to update posts
    if (res.data.results > 0) {
      dispatch({
        type: GET_POSTS,
        payload: {
          posts: res.data.data.doc,
          results: res.data.results,
          total: res.data.total,
        },
      });
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
    // set state loading property to false
    dispatch({
      type: FETCH_POSTS_END,
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    createPost
 * @description Retrieve posts based on category
 **/
export const createPost = (formData) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.post('/api/posts', formData, config);
    // dispatch action and update posts
    dispatch({
      type: CREATE_POST,
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    deletePostById
 * @description Delete post given postID
 **/
export const deletePostById = (postId, categoryId) => async (dispatch) => {
  try {
    // make api call
    await axios.delete(`/api/posts/${postId}`);
    // dispatch action and update posts
    dispatch({
      type: DELETE_POST,
      payload: { postId, categoryId },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    likePostById
 * @description Like post given post Id
 **/
export const likePostById = (postId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/posts/${postId}/like`);
    dispatch({
      type: LIKE_POST,
      payload: { postId, likes: res.data.data.doc },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    unlikePostById
 * @description Unlike post given post ID
 **/
export const unlikePostById = (postId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/posts/${postId}/unlike`);
    dispatch({
      type: UNLIKE_POST,
      payload: { postId, likes: res.data.data.doc },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    createComment
 * @description Create comment on post
 **/
export const createComment = (postId, formData) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.post(
      `/api/posts/${postId}/comments`,
      formData,
      config
    );
    dispatch({
      type: CREATE_COMMENT,
      payload: { postId: postId, comments: res.data.data.doc },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    deleteCommentById
 * @description Delete comment on post
 **/
export const deleteCommentById = (postId, commentId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );
    dispatch({
      type: DELETE_COMMENT,
      payload: { postId, comments: res.data.data.doc },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    likeCommentById
 * @description Like comment on post
 **/
export const likeCommentById = (postId, commentId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(
      `/api/posts/${postId}/comments/${commentId}/like`
    );
    dispatch({
      type: LIKE_COMMENT,
      payload: { postId, commentId, likes: res.data.data.likes },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    unlikeCommentById
 * @description unLike comment on post
 **/
export const unlikeCommentById = (postId, commentId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(
      `/api/posts/${postId}/comments/${commentId}/unlike`
    );
    dispatch({
      type: UNLIKE_COMMENT,
      payload: { postId, commentId, likes: res.data.data.likes },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    savePostById
 * @description Save post
 **/
export const savePostById = (postId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/posts/${postId}/save`);
    // server will return the list of saves, which we will update in reducer
    dispatch({
      type: SAVE_POST,
      payload: { postId, saves: res.data.data.doc },
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
      type: POST_ERROR,
    });
  }
};

/**
 * @action    unsavePostById
 * @description Unsave post
 **/
export const unsavePostById = (postId) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/posts/${postId}/unsave`);
    // server will return the list of saves, which we will update in reducer
    dispatch({
      type: UNSAVE_POST,
      payload: { postId, saves: res.data.data.doc },
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
      type: POST_ERROR,
    });
  }
};
