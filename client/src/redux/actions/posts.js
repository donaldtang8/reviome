import axios from 'axios';
import { logout } from './auth';
import {
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
  POST_ERROR,
  INCREMENT_POSTS_PAGE,
  RESET_POSTS,
  FETCH_POSTS_START,
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
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/feed?page=${page}`);
    // Dispatch get action to update posts
    dispatch({
      type: GET_POSTS,
      payload: {
        posts: res.data.data.doc,
        results: res.data.results,
        total: res.data.total,
      },
    });
    // Increment page count if there exists results and there are still more results to be fetched (results < total)
    if (res.data.results > 0 && res.data.results < res.data.total) {
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        dispatch(logout());
      }
    }
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getPostsByUser
 * @description Retrieve posts from user given id
 **/
export const getPostsByUser = (page, id) => async (dispatch) => {
  try {
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/user/${id}?page=${page}`);
    // Dispatch get action to update posts
    dispatch({
      type: GET_POSTS,
      payload: { posts: res.data.data.doc, total: res.data.data.total },
    });
    if (res.data.results > 0 && res.data.results < res.data.total) {
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        dispatch(logout());
      }
    }
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getPostById
 * @description Retrieve post given id
 **/
export const getPostById = (id) => async (dispatch) => {
  try {
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/${id}`);
    // Dispatch get action to update post
    dispatch({
      type: GET_POST,
      payload: res.data.data.doc,
    });
  } catch (err) {
    if (err.response.status === 401) {
      dispatch(logout());
    }
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getPostsByCategoryId
 * @description Retrieve posts based on category id
 **/
export const getPostsByCategoryId = (category) => async (dispatch) => {
  try {
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/category/id/${category}`);
    // Dispatch get action to update posts
    dispatch({
      type: GET_POSTS,
      payload: { posts: res.data.data.doc, total: res.data.data.total },
    });
    if (res.data.results > 0 && res.data.results < res.data.total) {
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getPostsByCategorySlug
 * @description Retrieve posts based on category slug
 **/
export const getPostsByCategorySlug = (page, category) => async (dispatch) => {
  try {
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(
      `/api/posts/category/slug/${category}?page=${page}`
    );
    // Dispatch get action to update posts
    dispatch({
      type: GET_POSTS,
      payload: { posts: res.data.data.doc, total: res.data.data.total },
    });
    if (res.data.results > 0 && res.data.results < res.data.total) {
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        dispatch(logout());
      }
    }
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    createPost
 * @description Retrieve posts based on category
 **/
export const createPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/posts', formData, config);
    dispatch({
      type: CREATE_POST,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    deletePostById
 * @description Delete post given postID
 **/
export const deletePostById = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    likePostById
 * @description Like post given post Id
 **/
export const likePostById = (postId) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/posts/${postId}/like`);
    dispatch({
      type: LIKE_POST,
      payload: { postId, likes: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    unlikePostById
 * @description Unlike post given post ID
 **/
export const unlikePostById = (postId) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/posts/${postId}/unlike`);
    dispatch({
      type: UNLIKE_POST,
      payload: { postId, likes: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    createComment
 * @description Create comment on post
 **/
export const createComment = (postId, formData) => async (dispatch) => {
  try {
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
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    deleteCommentById
 * @description Delete comment on post
 **/
export const deleteCommentById = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );
    dispatch({
      type: DELETE_COMMENT,
      payload: { postId, comments: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    likeCommentById
 * @description Like comment on post
 **/
export const likeCommentById = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.patch(
      `/api/posts/${postId}/comments/${commentId}/like`
    );
    dispatch({
      type: LIKE_COMMENT,
      payload: { postId, commentId, likes: res.data.data.likes },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    unlikeCommentById
 * @description unLike comment on post
 **/
export const unlikeCommentById = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.patch(
      `/api/posts/${postId}/comments/${commentId}/unlike`
    );
    dispatch({
      type: UNLIKE_COMMENT,
      payload: { postId, commentId, likes: res.data.data.likes },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getSavedPosts
 * @description Retrieve saved posts
 **/
export const getSavedPosts = (page) => async (dispatch) => {
  try {
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/saves?page=${page}`);
    // Dispatch get action to update posts
    dispatch({
      type: GET_POSTS,
      payload: { posts: res.data.data.doc, total: res.data.data.total },
    });
    if (res.data.results > 0 && res.data.results < res.data.total) {
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getSavedPostsByUser
 * @description Retrieve saved posts of user
 **/
export const getSavedPostsByUser = (page, id) => async (dispatch) => {
  try {
    // Dispatch fetch action to set loading
    dispatch({
      type: FETCH_POSTS_START,
    });
    const res = await axios.get(`/api/posts/user/${id}/saves?page=${page}`);
    // Dispatch get action to update posts
    dispatch({
      type: GET_POSTS,
      payload: { posts: res.data.data.doc, total: res.data.data.total },
    });
    if (res.data.results > 0 && res.data.results < res.data.total) {
      dispatch({
        type: INCREMENT_POSTS_PAGE,
      });
    }
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    savePostById
 * @description Save post
 **/
export const savePostById = (postId) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/posts/${postId}/save`);
    // server will return the list of saves, which we will update in reducer
    dispatch({
      type: SAVE_POST,
      payload: { postId, saves: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    unsavePostById
 * @description Unsave post
 **/
export const unsavePostById = (postId) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/posts/${postId}/unsave`);
    // server will return the list of saves, which we will update in reducer
    dispatch({
      type: UNSAVE_POST,
      payload: { postId, saves: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.message,
    });
  }
};
