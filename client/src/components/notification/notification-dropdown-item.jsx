import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  setOpen,
  setRead,
  deleteNotificationById,
} from '../../redux/actions/notifications';

const NotificationDropdownItem = ({
  setOpen,
  setRead,
  deleteNotificationById,
  notification,
  history,
}) => {
  return (
    <Link
      to={notification.link}
      className={
        !notification.opened
          ? 'notification__item notification__item--unopened'
          : 'notification__item notification__item--opened'
      }
      onClick={() => setOpen(notification._id)}
    >
      <div className="notification__item--img">
        <img
          src={notification.user_from.photo}
          alt={notification.user_from.fullName}
        />
      </div>
      <div className="notification__item--message">{notification.message}</div>
      <div
        className="notification__item--action"
        onClick={() => deleteNotificationById(notification._id)}
      >
        X
      </div>
    </Link>
  );
};

NotificationDropdownItem.propTypes = {
  setOpen: PropTypes.func.isRequired,
  setRead: PropTypes.func.isRequired,
  deleteNotificationById: PropTypes.func.isRequired,
};

export default connect(null, { setOpen, setRead, deleteNotificationById })(
  withRouter(NotificationDropdownItem)
);
