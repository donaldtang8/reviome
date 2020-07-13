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
  // reportOpen will toggle report form
  const [reportOpen, setReportOpen] = useState(false);
  // confirm state properties
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(false);

  // if reportOpen toggle changes, we will call the handler function to check whether to open/close the report popup
  useEffect(() => {
    handleReportPopup();
  }, [reportOpen]);

  // if confirmData toggle changes, check if confirmData has a value
  // useEffect(() => {
  //   console.log(confirmData);
  //   if (confirmData) {
  //     handleBlock();
  //   }
  // }, [confirmData]);

  // toggles reportOpen variable
  const reportOpenCallback = (open) => {
    setReportOpen(open);
  };

  // toggles confirmOpen variable
  const confirmOpenCallback = (open) => {
    setConfirmOpen(open);
  };

  // toggles confirmData variable - if selection in window has been made
  const confirmDataCallback = (data) => {
    // setConfirmData(data);
    if (data) {
      handleBlock();
    }
  };

  // Handle confirm popup
  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  // Handle report popup
  const handleReportPopup = () => {
    if (reportOpen) {
      const popup = document.querySelector('#popupReport');
      const popupContent = document.querySelector('#popupReport');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
    } else if (!reportOpen) {
      const popup = document.querySelector('#popupReport');
      const popupContent = document.querySelector('#popupReportContent');
      popup.style.opacity = '0';
      popup.style.visibility = 'hidden';
      // popupContent.opacity = "0";
      // popupContent.transform = "translate(0, 0) scale(0)";
    }
  };

  // Block user
  const handleBlock = () => {
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
          <div>@{user.uName}</div>
          <div>{user.followers} followers</div>
          {/* <div className="profile__header--followers">
            {user.followers} followers
          </div> */}
        </div>
        <div className="profile__header--info-bar">
          <div className="profile__header--links">
            {user.links && (
              <Fragment>
                {user.links.youtube && (
                  <a
                    href={user.links.youtube}
                    target="_blank"
                    className="btn__icon"
                  >
                    <svg className="btn__icon--svg">
                      <use xlinkHref={`${sprite}#icon-youtube`}></use>
                    </svg>
                  </a>
                )}
                {user.links.instagram && (
                  <a
                    href={user.links.instagram}
                    target="_blank"
                    className="btn__icon"
                  >
                    <svg className="btn__icon--svg">
                      <use xlinkHref={`${sprite}#icon-instagram`}></use>
                    </svg>
                  </a>
                )}
                {user.links.soundcloud && (
                  <a
                    href={user.links.soundcloud}
                    target="_blank"
                    className="btn__icon"
                  >
                    <svg className="btn__icon--svg">
                      <use xlinkHref={`${sprite}#icon-soundcloud`}></use>
                    </svg>
                  </a>
                )}
                {user.links.spotify && (
                  <a
                    href={user.links.spotify}
                    target="_blank"
                    className="btn__icon"
                  >
                    <svg className="btn__icon--svg">
                      <use xlinkHref={`${sprite}#icon-spotify`}></use>
                    </svg>
                  </a>
                )}
                {user.links.twitch && (
                  <a
                    href={user.links.twitch}
                    target="_blank"
                    className="btn__icon"
                  >
                    <svg className="btn__icon--svg">
                      <use xlinkHref={`${sprite}#icon-twitch`}></use>
                    </svg>
                  </a>
                )}
              </Fragment>
            )}
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
                    onClick={handleConfirmOpen}
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
                    onClick={handleConfirmOpen}
                  >
                    Block
                  </div>
                </Fragment>
              )}
              <div
                className="btn__action btn__action--active"
                onClick={() => setReportOpen(true)}
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
      </div>
      <ReportForm
        item={user}
        type="User"
        reportOpenCallback={reportOpenCallback}
      />
      <Confirm
        confirmOpen={confirmOpen}
        confirmOpenCallback={confirmOpenCallback}
        confirmDataCallback={confirmDataCallback}
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
