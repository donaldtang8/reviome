import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

import {
  getReportById,
  deleteReportById,
  resolveReport,
} from '../../redux/actions/reports';
import { banUserById } from '../../redux/actions/users';

import Spinner from '../../components/spinner/spinner';

const Reports = ({
  getReportById,
  deleteReportById,
  resolveReport,
  banUserById,
  reports: { report, loading },
  match,
  history,
}) => {
  useEffect(() => {
    getReportById(match.params.id);
  }, [getReportById, match.params.id]);

  const [timeData, setTimeData] = useState({
    days: 0,
    hours: 0,
  });

  const [reportData, setReportData] = useState({
    status: 'closed',
    action: '',
    statusMessage: '',
  });

  const { days, hours } = timeData;

  const { statusMessage } = reportData;

  const handleTimeChange = (e) => {
    setTimeData({ ...timeData, [e.target.name]: e.target.value });
  };

  const handleReportChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    banUserById(report.user_to._id, timeData);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    resolveReport(report._id, reportData);
  };

  return loading ? (
    <Spinner />
  ) : !report ? (
    <div>No report found</div>
  ) : (
    <div className="report__container large__container">
      <div className="table__header">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table__body">
        <table cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            <tr>
              <td>User From</td>
              <td>
                <Link
                  to={`/profile/${report.user_from.uName}`}
                  target={'_blank'}
                >
                  {report.user_from.uName}
                </Link>
              </td>
            </tr>
            <tr>
              <td>User To</td>
              <td>
                <Link to={`/profile/${report.user_to.uName}`} target={'_blank'}>
                  {report.user_to.uName}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{report.status}</td>
            </tr>
            <tr>
              <td>Report Type</td>
              <td>{report.report_type}</td>
            </tr>
            <tr>
              <td>Item Type</td>
              <td>{report.item_type}</td>
            </tr>
            <tr>
              <td>Message</td>
              <td>{report.message}</td>
            </tr>
            <tr>
              <td>Link</td>
              <td>
                {report.link &&
                  (report.link === 'user' ? (
                    <Link
                      to={report.link}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      Open
                    </Link>
                  ) : (
                    <a
                      href={report.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </a>
                  ))}
              </td>
            </tr>
            <tr>
              <td>Content</td>
              <td>{report.content && report.content}</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>
                <Moment format="MM/DD/YYYY HH:mm">{report.createdAt}</Moment>
              </td>
            </tr>
            <tr>
              <td>Action</td>
              <td>{report.action}</td>
            </tr>
            <tr>
              <td>Staff Comments</td>
              <td>{report.statusMessage}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="report__action">
        <form className="form__container" onSubmit={handleReportSubmit}>
          <div className="heading-2 padding-small">Resolve Report</div>
          <label htmlFor="status">Status</label>
          <select
            className="input__select"
            id="status"
            name="status"
            onChange={handleReportChange}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Choose a status
            </option>
            <option value="open">Open</option>
            <option value="review">Review</option>
            <option value="closed">Closed</option>
          </select>
          <label htmlFor="action">Action</label>
          <select
            className="input__select"
            id="action"
            name="action"
            onChange={handleReportChange}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Choose an action
            </option>
            <option value="none">None</option>
            <option value="remove">Remove Item</option>
            <option value="temp_ban">Temporary Ban</option>
            <option value="perm_ban">Permanent Ban</option>
          </select>
          <textarea
            type="text"
            name="statusMessage"
            placeholder="Message"
            value={statusMessage}
            onChange={handleReportChange}
            resize="none"
          />
          <input
            className="input__submit"
            type="submit"
            value="Resolve Report"
          />
        </form>

        <form className="form__container" onSubmit={handleTimeSubmit}>
          <div className="heading-2 padding-small">Ban Account</div>
          {report.user_to.banExpires && (
            <div className="heading-3 padding-small">
              *This account is already banned until{' '}
              <Moment format="MM/DD/YYYY HH:mm">
                {report.user_to.banExpires}
              </Moment>
            </div>
          )}
          <label htmlFor="days">Day(s)</label>
          <input
            className="input__"
            type="number"
            name="days"
            placeholder="Day(s)"
            value={days}
            onChange={handleTimeChange}
            min="0"
            step="1"
            required
          />
          <label htmlFor="hours">Hour(s)</label>
          <input
            type="number"
            name="hours"
            placeholder="Hour(s)"
            value={hours}
            onChange={handleTimeChange}
            min="0"
            step="1"
            required
          />
          <input className="input__submit" type="submit" value="Ban Account" />
        </form>
        <div
          className="input__submit report__container--delete"
          onClick={() => deleteReportById(report._id, history)}
        >
          Delete Report
        </div>
      </div>
    </div>
  );
};

Reports.propType = {
  getReportById: PropTypes.func.isRequired,
  deleteReportById: PropTypes.func.isRequired,
  resolveReport: PropTypes.func.isRequired,
  banUserById: PropTypes.func.isRequired,
  reports: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reports: state.reports,
});

export default connect(mapStateToProps, {
  getReportById,
  deleteReportById,
  resolveReport,
  banUserById,
})(withRouter(Reports));
