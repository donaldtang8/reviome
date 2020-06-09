import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  followUserById,
  unfollowUserById,
  blockUserById,
  unblockUserById,
} from "./../../redux/actions/users";

import sprite from "../../assets/sprite.svg";

const ProfileHeader = ({
  auth,
  user,
  match,
  followUserById,
  unfollowUserById,
  blockUserById,
  unblockUserById,
}) => {
  return (
    <div className="profile__header">
      <div className="profile__header--pic">
        <img src={user.photo} alt={user.fullName} />
      </div>
      <div className="profile__header--bio">
        <div className="profile__header--info">
          <div className="profile__header--name">{user.fullName}</div>
          {/* <div className="profile__header--followers">
            {user.followers} followers
          </div> */}
        </div>
        {auth.user._id !== user._id ? (
          <div className="profile__header--actions">
            {/* We do not need to check if user of profile is blocking*/}
            {auth.user.block_to.some(
              (userBlocked) => userBlocked === user._id
            ) ? (
              <div
                className="btn__action btn__action--inactive"
                onClick={() => unblockUserById(user._id)}
              >
                Unblock
              </div>
            ) : auth.user.following.some(
                (userFollowed) => userFollowed._id === user._id
              ) ? (
              <Fragment>
                <div
                  className="btn__action btn__action--inactive"
                  onClick={() => unfollowUserById(user._id)}
                >
                  Unfollow
                </div>
                <div
                  className="btn__action btn__action--active"
                  onClick={() => blockUserById(user._id)}
                >
                  Block
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div
                  className="btn__action btn__action--active"
                  onClick={() => followUserById(user._id)}
                >
                  Follow
                </div>
                <div
                  className="btn__action btn__action--active"
                  onClick={() => blockUserById(user._id)}
                >
                  Block
                </div>
              </Fragment>
            )}
          </div>
        ) : (
          <div className="profile__header--actions">
            <Link to="/account" className="btn__icon">
              <svg className="btn__icon--svg">
                <use xlinkHref={`${sprite}#icon-cog`}></use>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  followUserById: PropTypes.func.isRequired,
  unfollowUserById: PropTypes.func.isRequired,
  blockUserById: PropTypes.func.isRequired,
  unblockUserById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  followUserById,
  unfollowUserById,
  blockUserById,
  unblockUserById,
})(ProfileHeader);
