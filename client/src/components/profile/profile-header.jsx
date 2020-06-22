import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  followUserById,
  unfollowUserById,
  blockUserById,
  unblockUserById,
} from './../../redux/actions/users';

import ReportForm from './../../components/report/report-form';
import Confirm from './../../components/confirm/confirm';

import sprite from '../../assets/sprite.svg';

const ProfileHeader = ({
  auth,
  user,
  match,
  followUserById,
  unfollowUserById,
  blockUserById,
  unblockUserById,
}) => {
  const [popupReportVisible, setPopupReportVisible] = useState(false);
  const [popupConfirmVisible, setPopupConfirmVisible] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);

  // Handle report popup
  const handleReportPopup = (e) => {
    if (!popupReportVisible) {
      setPopupReportVisible(true);
      const popup = document.querySelector('#popupReport');
      const popupContent = document.querySelector('#popupReport');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
    }
    // reset popup visibility state when dropdown is closed
    setPopupReportVisible(false);
  };

  // Handle confirm popup
  const handleConfirmPopup = (e) => {
    if (!popupConfirmVisible) {
      setPopupConfirmVisible(true);
      const popup = document.querySelector('#popupConfirm');
      const popupContent = document.querySelector('#popupConfirm');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
    }
    // reset popup visibility state when dropdown is closed
    setPopupConfirmVisible(false);
  };

  // Callback to return result from confirm popup
  const blockCallback = (confirmData) => {
    setConfirmBlock(confirmData);
  };

  // When we have received a response from the confirm popup, check response and call block function if confirmed
  useEffect(() => {
    if (confirmBlock) {
      handleBlock();
    }
    // reset confirm
    setConfirmBlock(false);
  }, [confirmBlock]);

  const handleBlock = (e) => {
    blockUserById(user._id);
  };

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
                  // onClick={() => blockUserById(user._id)}
                  onClick={handleConfirmPopup}
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
                  // onClick={() => blockUserById(user._id)}
                  onClick={handleConfirmPopup}
                >
                  Block
                </div>
              </Fragment>
            )}
            <div
              className="btn__action btn__action--active"
              onClick={handleReportPopup}
            >
              Report
            </div>
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
      <ReportForm item={user} type="User" />
      <Confirm
        parentCallback={blockCallback}
        message="Are you sure you want to do this?"
      />
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
