import axios from 'axios';

import {
  RESET_REPORTS,
  FETCH_REPORTS_START,
  GET_REPORTS,
  GET_REPORT,
  CREATE_REPORT,
  UPDATE_REPORT,
  DELETE_REPORT,
  INCREMENT_REPORTS_PAGE,
  RESET_REPORTS_PAGE,
  SET_REPORT_LIMIT,
  REPORT_ERROR,
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @action    resetReports
 * @description Reset reports
 **/
export const resetReports = () => async (dispatch) => {
  dispatch({
    type: RESET_REPORTS,
  });
};

/**
 * @action    getReports
 * @description Retrieve all report documents
 **/
export const getReports = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/reports');
    dispatch({
      type: GET_REPORTS,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    getReport
 * @description Retrieve a report document given ID
 **/
export const getReport = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/reports/${id}`);
    dispatch({
      type: GET_REPORT,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    createReport
 * @description Create a new report
 **/
export const createReport = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/reports', formData, config);
    dispatch({
      type: CREATE_REPORT,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action    resolveReport
 * @description Resolve an open report
 **/
export const resolveReport = (id, formData) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/reports/${id}`, formData, config);
    dispatch({
      type: UPDATE_REPORT,
      payload: res.data.data.doc,
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action      deleteReport
 * @description Delete report
 **/
export const deleteReport = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/reports/${id}`);
    dispatch({
      type: DELETE_REPORT,
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};
