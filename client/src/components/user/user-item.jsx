import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { resetUsersState } from './../../redux/actions/users';

const UserItem = ({ resetUsersState, user }) => {
  return (
    <Link
      to={`/profile/${user.uName}`}
      className="user-item__container"
      onClick={() => resetUsersState()}
    >
      <img
        className="user-item__container--pic"
        src={user.photo}
        alt={user.fullName}
      />
      <div className="user-item__container--name">{user.fullName}</div>
    </Link>
  );
};

UserItem.propTypes = {
  resetUsersState: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(null, { resetUsersState })(UserItem);
