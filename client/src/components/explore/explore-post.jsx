import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Moment from 'react-moment';

import PostDropdown from './../post/post-dropdown';

const ExplorePost = ({ post, auth: { user }, history }) => {
  // const handleClick = (e) => {
  //   history.push(`/post/${post._id}`);
  // };

  return (
    <div className="post-item__container">
      <div className="post-item__header">
        <Link to={`/profile/${post.user.uName}`}>
          <img className="post-item__header--img" src={post.user.photo} />
        </Link>
        <div className="post-item__header--info">
          <Link to={`/profile/${post.user.uName}`}>
            <div className="post-item__header--name">{post.user.fullName}</div>
            <Moment fromNow>{post.createdAt}</Moment>
          </Link>
        </div>
        <PostDropdown post={post} />
      </div>
      <div className="post-item__body">
        <blockquote className="embedly-card" data-card-via={post.link}>
          <h4>
            <a href={post.link}>{post.title.length > 0 && post.title}</a>
          </h4>
          <p>{post.text && post.text}</p>
        </blockquote>
      </div>
    </div>
  );
};

ExplorePost.propTypes = {
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(ExplorePost);
