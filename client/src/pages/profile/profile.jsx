import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUserByUsername } from './../../redux/actions/users';

import ProfileHeader from './../../components/profile/profile-header';
import ProfileBody from './../../components/profile/profile-body';

const Profile = ({
  getUserByUsername,
  users: { user, errors, loading },
  match,
}) => {
  useEffect(() => {
    getUserByUsername(match.params.user);
  }, [getUserByUsername, match.params.user]);

  return (
    <div className="section__container profile__container">
      {user === null || loading ? (
        <div>Profile not found</div>
      ) : errors.length > 0 ? (
        <div> Something went wrong </div>
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
  getUserByUsername: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { getUserByUsername })(Profile);
