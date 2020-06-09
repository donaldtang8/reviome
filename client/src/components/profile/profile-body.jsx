import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Feed from "./../../pages/feed/feed";

const ProfileBody = ({ auth, user }) => {
  const [tab, setTab] = useState("posts");

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
            tab === "posts" ? "tabs tabs--active" : "tabs tabs--inactive"
          }
          onClick={() => setTab("posts")}
        >
          Posts
        </div>
        <div
          className={
            tab === "favorites" ? "tabs tabs--active" : "tabs tabs--inactive"
          }
          onClick={() => setTab("favorites")}
        >
          Favorites
        </div>
        <div
          className={
            tab === "following" ? "tabs tabs--active" : "tabs tabs--inactive"
          }
          onClick={() => setTab("following")}
        >
          Following
        </div>
      </div>
      {tab === "posts" && (
        <div className="tabs__view">
          <Feed pageType="profilePosts" userId={user._id} />
        </div>
      )}
      {tab === "favorites" && (
        <div className="tabs__view">
          <Feed pageType="profileFavorites" userId={user._id} />
        </div>
      )}
      {tab === "following" && (
        <div className="tabs__view">
          <div className="heading-tertiary">Following</div>
          <Feed pageType="profileFavorites" userId={user._id} />
        </div>
      )}
    </div>
  );
};

ProfileBody.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.users,
});

export default connect(mapStateToProps, null)(ProfileBody);
