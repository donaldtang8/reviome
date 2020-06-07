import axios from 'axios';
import { CREATE_COMMENT, DELETE_COMMENT, COMMENT_ERROR } from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @action    createComment
 * @description Create comment for post
 **/
export const createComment = (formData, page, postId) => async (dispatch) => {
  try {
    const res = await axios.post(
      `/api/posts/${postId}/comments`,
      formData,
      config
    );
    dispatch({
      type: CREATE_COMMENT,
      payload: { postId: postId, comment: res.data.data.doc },
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    deleteCommentById
 * @description Create comment for post
 **/
export const deleteCommentById = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
    dispatch({
      type: DELETE_COMMENT,
      payload: { commentId },
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: err.message,
    });
  }
};
