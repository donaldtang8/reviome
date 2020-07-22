import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

import { getReports } from './../../redux/actions/reports';

import Spinner from './../../components/spinner/spinner';

const Reports = ({ getReports, reports: { reports, loading } }) => {
  useEffect(() => {
    getReports();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="reports__container large__container ">
      <div className="table__header">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>User From</th>
              <th>User To</th>
              <th>Status</th>
              <th>Message</th>
              <th>Report Type</th>
              <th>Item Type</th>
              <th>Created At</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table__body">
        <table cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id}>
                  <td>
                    <Link
                      to={`/profile/${report.user_from.uName}`}
                      target={'_blank'}
                    >
                      {report.user_from.uName}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/profile/${report.user_to.uName}`}
                      target={'_blank'}
                    >
                      {report.user_to.uName}
                    </Link>
                  </td>
                  <td>{report.status}</td>
                  <td>{report.message}</td>
                  <td>{report.report_type}</td>
                  <td>{report.item_type}</td>
                  <td>
                    <Moment format="MM/DD/YYYY HH:mm">
                      {report.createdAt}
                    </Moment>
                  </td>
                  <td>{report.action}</td>
                  <td>
                    <Link to={`/reports/${report._id}`} target={'_blank'}>
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="center padding-small">No Reports</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Reports.propType = {
  getReports: PropTypes.func.isRequired,
  reports: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reports: state.reports,
});

export default connect(mapStateToProps, { getReports })(Reports);
