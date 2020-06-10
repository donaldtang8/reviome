import {
  RESET_CATEGORIES,
  FETCH_CATEGORIES_START,
  GET_CATEGORIES,
  GET_CATEGORY,
  SET_GENRE,
  CATEGORY_ERROR,
} from './../actions/types';

const initialState = {
  categories: [],
  category: null,
  genre: null,
  loading: false,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_CATEGORIES:
      return {
        ...state,
        categories: [],
        genre: null,
        loading: false,
        errors: [],
      };
    case FETCH_CATEGORIES_START:
      return {
        ...state,
        loading: true,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: payload,
        genre: null,
        loading: false,
      };
    case GET_CATEGORY:
      return {
        ...state,
        category: payload,
        loading: false,
      };
    case SET_GENRE:
      return {
        ...state,
        genre: payload,
      };
    case CATEGORY_ERROR:
      return {
        ...state,
        loading: false,
        errors: [payload, state.errors],
      };
    default:
      return state;
  }
}
