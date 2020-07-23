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
  notifications: { notifications, page, loading },
}) => {
  useEffect(() => {
    resetNotifications();
    getNotifications(page);
  }, [resetNotifications, getNotifications]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="section__container">
      <div className="heading-1 center padding-small">Notifications</div>
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <NotificationItem key={notif._id} notification={notif} />
        ))
      ) : (
        <div className="center italic font-medium">
          You're all caught up! No more notifications!
        </div>
      )}
      {}
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
