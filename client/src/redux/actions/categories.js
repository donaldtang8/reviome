import axios from 'axios';
import {
  GET_CATEGORIES,
  CATEGORY_ERROR,
  FETCH_CATEGORIES_START,
  SET_GENRE,
} from './types';

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
 * @action    getAllCategories
 * @description Retrieve all categories
 **/
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    const res = await axios.get('/api/categories');
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
 * @action    getTopCategories
 * @description Retrieves all top level categories
 **/
export const getTopCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
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
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    const res = await axios.get(`/api/categories/sub/id/${category}`);
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data.doc,
    });
  } catch (err) {}
};

/**
 * @action    getSubcategoriesBySlug
 * @description Retrieves all subcategories of a category given category slug
 **/
export const getSubcategoriesBySlug = (category) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_CATEGORIES_START,
    });
    const res = await axios.get(`/api/categories/sub/slug/${category}`);
    // Dispatch get action to update categories
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data.data.doc,
    });
  } catch (err) {}
};
