import axios from 'axios';
import {
  FETCH_CATEGORIES_START,
  GET_CATEGORIES,
  GET_CATEGORY,
  UPDATE_CATEGORY,
  FOLLOW_CATEGORY,
  UNFOLLOW_CATEGORY,
  SET_GENRE,
  CATEGORY_ERROR,
  RESET_CATEGORIES,
} from './types';
import { setAlert } from './alert';

import { uploadImage, getImageURL } from './../../firebase/firebase.utils';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @action    setGenre
 * @description Set genre to be used to retrieve posts
 **/
export const setGenre = (category) => (dispatch) => {
  dispatch({
    type: SET_GENRE,
    payload: category,
  });
};

/**
 * @action    resetCategories
 * @description Reset categories state
 **/
export const resetCategories = () => async (dispatch) => {
  dispatch({
    type: RESET_CATEGORIES,
  });
};

/**
 * @action    getAllCategories
 * @description Retrieve all categories
 **/
export const getAllCategories = () => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    // make api call
    const res = await axios.get('/api/categories');
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.message, 'fail'));
  }
};

/**
 * @action    getCategoryById
 * @description Retrieve category given category id
 **/
export const getCategoryById = (id) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    // make api call
    const res = await axios.get(`/api/categories/id/${id}`);
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORY,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getCategoryBySlug
 * @description Retrieve category given category slug
 **/
export const getCategoryBySlug = (category) => async (dispatch) => {
  try {
    let formData = {};
    formData.slug = category;
    const body = JSON.stringify(formData);
    // set state loading property to true
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    // make api call
    const res = await axios.post(`/api/categories/slug`, body, config);
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORY,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getTopCategories
 * @description Retrieves all top level categories
 **/
export const getTopCategories = () => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    // make api call
    const res = await axios.get('/api/categories/topCategories');
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getSubcategoriesById
 * @description Retrieves all subcategories of a category given category id
 **/
export const getSubcategoriesById = (category) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    // make api call
    const res = await axios.get(`/api/categories/sub/id/${category}`);
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getSubcategoriesBySlug
 * @description Retrieves all subcategories of a category given category slug
 **/
export const getSubcategoriesBySlug = (category) => async (dispatch) => {
  try {
    // set state loading property to true
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    // make api call
    const res = await axios.get(`/api/categories/sub/slug/${category}`);
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    createCategory
 * @description Create new category
 **/
export const createCategory = (formData) => async (dispatch) => {
  try {
    // update photo to firebase and retrieve image URL to update user document
    if (formData.photo) {
      // upload to firebase
      let ref = await uploadImage(
        formData.photoName,
        formData.photo,
        'categories'
      );
      // retrieve image url
      let url = await getImageURL(ref);
      // add photo property in formData and attach url to it
      formData.photo = url;
    }
    await axios.post('/api/categories', formData, config);
    dispatch(setAlert('Successfully created', 'success'));
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    updateCategoryById
 * @description Update category by ID
 **/
export const updateCategoryById = (id, formData) => async (dispatch) => {
  try {
    // update photo to firebase and retrieve image URL to update user document
    if (formData.photo) {
      // upload to firebase
      let ref = await uploadImage(
        formData.photoName,
        formData.photo,
        'categories'
      );
      // retrieve image url
      let url = await getImageURL(ref);
      // add photo property in formData and attach url to it
      formData.photo = url;
    }
    // make api call
    const res = await axios.patch(`/api/categories/id/${id}`, formData, config);
    dispatch({
      type: UPDATE_CATEGORY,
      payload: res.data.data.doc,
    });
    dispatch(setAlert('Successfully updated category', 'success'));
  } catch (err) {
    setAlert(err);
  }
};

/**
 * @action    followCategoryById
 * @description Follow category given ID
 **/
export const followCategoryById = (id) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/categories/follow/${id}`);
    dispatch({
      type: FOLLOW_CATEGORY,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    unfollowCategoryById
 * @description Unfollow category given ID
 **/
export const unfollowCategoryById = (id) => async (dispatch) => {
  try {
    // make api call
    const res = await axios.patch(`/api/categories/unfollow/${id}`);
    dispatch({
      type: UNFOLLOW_CATEGORY,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: err.message,
    });
  }
};
