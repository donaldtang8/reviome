import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div
        key={alert.id}
        className={`alert__container alert__container--${alert.type}`}
      >
        <div className="alert__container--message">{alert.msg}</div>
      </div>
    ))
  );
};

Alert.propTypes = {};

const mapStateToProps = (state) => ({
  alerts: state.alerts,
});

export default connect(mapStateToProps, {})(Alert);
