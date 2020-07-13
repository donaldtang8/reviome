import axios from 'axios';
import { setAlert } from './alert';

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
 * @action    getReportById
 * @description Retrieve a report document given ID
 **/
export const getReportById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_REPORTS_START,
    });
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
    dispatch(setAlert('Report successfully resolved', 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data.message, 'fail'));
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
      payload: { id, report: res.data.data.doc },
    });
    dispatch(setAlert('Report successfully resolved', 'success'));
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};

/**
 * @action      deleteReportById
 * @description Delete report
 **/
export const deleteReportById = (id, history) => async (dispatch) => {
  try {
    await axios.delete(`/api/reports/${id}`);
    dispatch({
      type: DELETE_REPORT,
      payload: id,
    });
    history.push('/reports');
    dispatch(setAlert('Report successfully deleted', 'success'));
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: err.message,
    });
  }
};
