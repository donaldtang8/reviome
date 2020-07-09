import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  resetNotifications,
  getNotifications,
  setRead,
} from './../../redux/actions/notifications';

import Spinner from './../spinner/spinner';

import NotificationDropdownItem from './notification-dropdown-item';

import sprite from '../../assets/sprite.svg';

const NotificationDropdown = ({
  resetNotifications,
  getNotifications,
  setRead,
  notifications: { notifications, loading, count },
}) => {
  const [visible, setVisible] = useState(false);
  const [refs, setRefs] = useState({
    btnRef: React.createRef(),
    menuRef: React.createRef(),
  });

  const { btnRef, menuRef } = refs;

  useEffect(() => {
    // when we open up the notification dropdown, we want to set the 'read' property of all of the notifications in the dropdown to 'true' and update the count
    if (visible) {
      setRead([...notifications]);
      resetNotifications();
      getNotifications();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', hideDropdown);
    } else {
      document.removeEventListener('mousedown', hideDropdown);
    }
  }, [visible]);

  const setNotificationRead = () => {
    for (let i = 0; i < notifications.length; i++) {
      if (!notifications[i].read) {
        setRead(notifications[i]._id);
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!visible) {
      setVisible(true);
      setNotificationRead();
    } else {
      setVisible(false);
    }
  };

  const hideDropdown = (e) => {
    if (btnRef.current || menuRef.current) {
      if (
        btnRef.current.contains(e.target) ||
        menuRef.current.contains(e.target)
      ) {
        return;
      }
      setVisible(false);
    }
  };

  return (
    <div className={visible ? 'dropdown dropdown__menu--show' : 'dropdown'}>
      <div
        ref={btnRef}
        id="dropdown-btn"
        className="dropdown__btn"
        onClick={handleClick}
      >
        <div className="btn__icon">
          <svg className="btn__icon--svg">
            <use xlinkHref={`${sprite}#icon-bell1`}></use>
          </svg>
        </div>
        {!loading && count > 0 && (
          <div className="notification__item--bubble">{count}</div>
        )}
      </div>
      <div
        ref={menuRef}
        className="dropdown__menu notification__dropdown"
        tabIndex="-1"
        aria-labelledby="dropdown-btn"
        aria-hidden="true"
      >
        {loading ? (
          <Spinner />
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationDropdownItem key={notif._id} notification={notif} />
          ))
        ) : (
          <div className="notification__error">No notifications</div>
        )}
        {notifications.length > 0 && (
          <Fragment>
            <hr />
            <Link to="/notifications">
              <div className="notification__action">See All</div>
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

NotificationDropdown.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  resetNotifications: PropTypes.func.isRequired,
  setRead: PropTypes.func.isRequired,
  notifications: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps, {
  getNotifications,
  resetNotifications,
  setRead,
})(NotificationDropdown);
