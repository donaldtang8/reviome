import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Moment from 'react-moment';

import {
  setOpen,
  setRead,
  deleteNotificationById,
} from '../../redux/actions/notifications';

import sprite from '../../assets/sprite.svg';

const NotificationDropdownItem = ({
  setRead,
  deleteNotificationById,
  notification,
}) => {
  return (
    <div
      className={
        !notification.opened
          ? 'notification__item notification__item--unopened'
          : 'notification__item notification__item--opened'
      }
    >
      <Link to={notification.link} className="notification__item--main">
        <div className="notification__item--top">
          <div className="notification__item--img">
            <img
              src={notification.user_from.photo}
              alt={notification.user_from.fullName}
            />
          </div>
          <div className="notification__item--body">
            <div className="notification__item--message">
              {notification.message}
            </div>
            <div className="notification__item--time">
              <Moment fromNow>{notification.createdAt}</Moment>
            </div>
          </div>
        </div>
        <div className="notification__item--bottom"></div>
      </Link>
      <div
        className="notification__item--action"
        onClick={() => deleteNotificationById(notification._id)}
      >
        <div className="btn__dropdownItemAction">
          <svg className="btn__dropdownItemAction--svg">
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
