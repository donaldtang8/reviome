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
  REPORT_ERROR,
} from './../actions/types';

const initialState = {
  reports: [],
  report: null,
  page: 1,
  nextPage: false,
  loading: false,
  errors: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_REPORTS:
      return {
        reports: [],
        report: null,
        page: 1,
        nextPage: false,
        loading: false,
        errors: [],
      };
    case FETCH_REPORTS_START:
      return {
        ...state,
        loading: true,
      };
    case GET_REPORTS:
      return {
        ...state,
        reports: payload,
        loading: false,
      };
    case GET_REPORT:
      return {
        ...state,
        report: payload,
        loading: false,
      };
    case CREATE_REPORT:
      return {
        ...state,
        reports: [payload, ...state.reports],
        loading: false,
      };
    case UPDATE_REPORT:
      return {
        ...state,
        reports: state.reports.map((report) =>
          report._id === payload.id ? payload.report : report
        ),
        report: payload.report,
        loading: false,
      };
    case DELETE_REPORT:
      return {
        ...state,
        reports: state.reports.filter((post) => post._id !== payload),
        report:
          state.report !== null && state.report._id === payload
            ? null
            : state.report,
        loading: false,
      };
    case INCREMENT_REPORTS_PAGE:
      return {
        ...state,
        page: state.page + 1,
      };
    case RESET_REPORTS_PAGE:
      return {
        ...state,
        page: 1,
      };
    case REPORT_ERROR:
      return {
        ...state,
        errors: [payload, ...state.errors],
      };
    default:
      return state;
  }
}
