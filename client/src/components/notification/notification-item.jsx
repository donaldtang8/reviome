import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

import { deleteNotificationById } from './../../redux/actions/notifications';

import sprite from '../../assets/sprite.svg';

const NotificationItem = ({ deleteNotificationById, notification }) => {
  return (
    <div className="notification__container">
      <Link
        to={`/profile/${notification.user_from.uName}`}
        className="notification__header"
      >
        <img
          className="notification__header--img"
          src={notification.user_from.photo}
          alt={notification.user_from.fullName}
        />
        <div className="notification__header--name">
          {notification.user_from.fullName}
        </div>
      </Link>
      <div className="notification__body">
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
        <div className="notification__body--message">
          {notification.message}
        </div>
        <Moment fromNow className="font-small">
          {notification.createdAt}
        </Moment>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  deleteNotificationById: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};

export default connect(null, { deleteNotificationById })(NotificationItem);
