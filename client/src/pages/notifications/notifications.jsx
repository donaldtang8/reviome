import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getNotifications,
  resetNotifications,
} from './../../redux/actions/notifications';

import NotificationItem from './../../components/notification/notification-item';
import Spinner from './../../components/spinner/spinner';

const Notifications = ({
  getNotifications,
  resetNotifications,
  notifications: { notifications, loading },
}) => {
  useEffect(() => {
    resetNotifications();
    getNotifications();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="notifications__container">
      <div className="notifications__container--title">Notifications</div>
      {notifications.map((notif) => (
        <NotificationItem key={notif._id} notification={notif} />
      ))}
    </div>
  );
};

Notifications.propTypes = {
  getNotifications: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps, {
  getNotifications,
  resetNotifications,
})(Notifications);
