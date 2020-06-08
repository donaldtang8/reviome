import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  setOpen,
  setRead,
  deleteNotificationById,
} from '../../redux/actions/notifications';

import sprite from '../../assets/sprite.svg';

const NotificationDropdownItem = ({
  setOpen,
  setRead,
  deleteNotificationById,
  notification,
  history,
}) => {
  return (
    <div
      className={
        !notification.opened
          ? 'notification__item notification__item--unopened'
          : 'notification__item notification__item--opened'
      }
    >
      <Link
        to={notification.link}
        className="notification__item--main"
        onClick={() => setOpen(notification._id)}
      >
        <div className="notification__item--top">
          <div className="notification__item--img">
            <img
              src={notification.user_from.photo}
              alt={notification.user_from.fullName}
            />
          </div>
          <div className="notification__item--message">
            {notification.message}
          </div>
        </div>
        <div className="notification__item--bottom">Time</div>
      </Link>
      <div
        className="notification__item--action"
        onClick={() => deleteNotificationById(notification._id)}
      >
        <div className="btn__dropdownAction">
          <svg className="btn__dropdownAction--svg">
            <use xlinkHref={`${sprite}#icon-cross`}></use>
          </svg>
        </div>
      </div>
    </div>
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
