import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification__container">
      <div className="notification__header">
        <img
          className="notification__header--img"
          src={notification.user_from.photo}
        />
        <div className="notification__header--name">
          {notification.user_from.fullName}
        </div>
      </div>
      <div className="notification__body">{notification.message}</div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default connect(null, {})(NotificationItem);
