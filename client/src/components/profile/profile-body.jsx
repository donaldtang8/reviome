import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { resetUsers, getUserFollowingList } from './../../redux/actions/users';

import Feed from './../../pages/feed/feed';
import UserItem from './../../components/user/user-item';

import ProfilePostForm from './../../components/profile/profile-post-form';

import sprite from './../../assets/sprite.svg';

const ProfileBody = ({
  resetUsers,
  getUserFollowingList,
  auth,
  users: { users },
  user,
}) => {
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    if (tab === 'following') {
      resetUsers();
      getUserFollowingList(user._id);
    }
  }, [tab]);

  const handlePopup = (e) => {
    const popup = document.querySelector('#popupPost');
    const popupContent = document.querySelector('#popupPostContent');
    popup.style.opacity = '1';
    popup.style.visibility = 'visible';
    // popupContent.opacity = "1";
    // popupContent.transform = "translate(-50%, -50%) scale(1)";
  };

  return auth.user._id !== user._id &&
    auth.user.block_to.some((userBlocked) => userBlocked === user._id) ? (
    <div className="profile__body">Blocked User</div>
  ) : auth.user.block_from.some((userBlocked) => userBlocked === user._id) ? (
    <div className="profile__body">You are blocked from viewing this page</div>
  ) : (
    <div className="profile__body">
      <div className="profile__body--tabs">
        <div
          className={
            tab === 'posts' ? 'tabs tabs--active' : 'tabs tabs--inactive'
          }
          onClick={() => setTab('posts')}
        >
          <div className="tabs__icon">
            <svg>
              <use xlinkHref={`${sprite}#icon-documents`}></use>
            </svg>
          </div>
          <div className="tabs__text">Posts</div>
        </div>
        <div
          className={
            tab === 'community' ? 'tabs tabs--active' : 'tabs tabs--inactive'
          }
          onClick={() => setTab('community')}
        >
          <div className="tabs__icon">
            <svg>
              <use xlinkHref={`${sprite}#icon-home2`}></use>
            </svg>
          </div>
          <div className="tabs__text">Community</div>
        </div>
        <div
          className={
            tab === 'favorites' ? 'tabs tabs--active' : 'tabs tabs--inactive'
          }
          onClick={() => setTab('favorites')}
        >
          <div className="tabs__icon">
            <svg>
              <use xlinkHref={`${sprite}#icon-star`}></use>
            </svg>
          </div>
          <div className="tabs__text">Favorites</div>
        </div>
        <div
          className={
            tab === 'following' ? 'tabs tabs--active' : 'tabs tabs--inactive'
          }
          onClick={() => setTab('following')}
        >
          <div className="tabs__icon">
            <svg>
              <use xlinkHref={`${sprite}#icon-users`}></use>
            </svg>
          </div>
          <div className="tabs__text">Following</div>
        </div>
      </div>
      {tab === 'posts' && (
        <div className="tabs__view">
          <Feed pageType="profilePosts" userId={user._id} />
        </div>
      )}
      {tab === 'community' && (
        <div className="tabs__view">
          {auth.user._id === user._id && (
            <div className="posts__container--form">
              <img src={user.photo} alt={user.fullName} />
              <div className="input__btn" onClick={handlePopup}>
                Create a post
              </div>
              <ProfilePostForm />
            </div>
          )}
          <Feed pageType="community" userId={user._id} />
        </div>
      )}
      {tab === 'favorites' && (
        <div className="tabs__view">
          <Feed pageType="profileFavorites" userId={user._id} />
        </div>
      )}
      {tab === 'following' && (
        <div className="tabs__view">
          {users.length > 0 ? (
            users.map((user) => <UserItem key={user._id} user={user} />)
          ) : (
            <div className="center padding-small">No users followed!</div>
          )}
        </div>
      )}
    </div>
  );
};

ProfileBody.propTypes = {
  resetUsers: PropTypes.func.isRequired,
  getUserFollowingList: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.users,
});

export default connect(mapStateToProps, {
  resetUsers,
  getUserFollowingList,
})(ProfileBody);
