import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getNotifications,
  resetNotifications,
} from './../../redux/actions/notifications';

import Spinner from './../spinner/spinner';

import NotificationDropdownItem from './notification-dropdown-item';

const NotificationDropdown = ({
  getNotifications,
  resetNotifications,
  notifications: { notifications, loading, page, nextPage, errors },
}) => {
  const [visible, setVisible] = useState(false);
  const [refs, setRefs] = useState({
    btnRef: React.createRef(),
    menuRef: React.createRef(),
  });

  const { btnRef, menuRef } = refs;

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', hideDropdown);
    } else {
      document.removeEventListener('mousedown', hideDropdown);
    }
  }, [visible]);

  const handleClick = (e) => {
    e.preventDefault();
    if (!visible) {
      setVisible(true);
      getNotifications(page);
    } else {
      setVisible(false);
    }
  };

  const hideDropdown = (e) => {
    if (
      btnRef.current.contains(e.target) ||
      menuRef.current.contains(e.target)
    ) {
      return;
    }
    setVisible(false);
    // RESET NOTIFICATIONS
    resetNotifications();
  };

  return (
    <div className={visible ? 'dropdown dropdown__menu--show' : 'dropdown'}>
      <div
        ref={btnRef}
        id="dropdown-btn"
        className="dropdown__btn"
        onClick={handleClick}
      >
        Notifs
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
          <div className="notification__item--error">No notifications</div>
        )}
        {nextPage && (
          <Link to="/notifications" className="notification__action">
            See All
          </Link>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps, {
  getNotifications,
  resetNotifications,
})(NotificationDropdown);
