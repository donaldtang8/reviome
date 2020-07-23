import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  resetUsersState,
  getUserByUsername,
} from './../../redux/actions/users';

import ProfileHeader from './../../components/profile/profile-header';
import ProfileBody from './../../components/profile/profile-body';

const Profile = ({
  resetUsersState,
  getUserByUsername,
  users: { user, errors, loading },
  match,
}) => {
  useEffect(() => {
    resetUsersState();
  }, [resetUsersState]);

  useEffect(() => {
    getUserByUsername(match.params.user);
  }, [getUserByUsername, match.params.user]);

  return (
    <div className="profile__container">
      {user === null || loading ? (
        <div className="center padding-small">Profile not found</div>
      ) : (
        <Fragment>
          <ProfileHeader user={user} />
          <ProfileBody user={user} />
        </Fragment>
      )}
    </div>
  );
};

Profile.propTypes = {
  resetUsersState: PropTypes.func.isRequired,
  getUserByUsername: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { resetUsersState, getUserByUsername })(
  Profile
);
