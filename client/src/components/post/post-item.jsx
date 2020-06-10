import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Moment from 'react-moment';

import CommentForm from './../comment/comment-form';
import CommentItem from './../comment/comment-item';
import PostDropdown from './post-dropdown';

import {
  likePostById,
  unlikePostById,
  savePostById,
  unsavePostById,
} from '../../redux/actions/posts';

import sprite from '../../assets/sprite.svg';

const PostItem = ({
  likePostById,
  unlikePostById,
  savePostById,
  unsavePostById,
  post,
  auth: { user },
}) => {
  const [showComments, toggleShowComments] = useState(false);

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
          <PostDropdown post={post} />
        </div>
      </div>
      <div className="post-item__body">
        <div className="post-item__body--title">{post.title}</div>
        <div className="post-item__body--desc">{post.text}</div>
        {/* <blockquote className="embedly-card">
          <h4>
            <a href={post.link}>{post.title.length > 0 && post.title}</a>
          </h4>
          <p>{post.text && post.text}</p>
        </blockquote> */}
      </div>
      <div className="post-item__actions">
        {post.likes.some((userLiked) => userLiked._id === user._id) ? (
          <div
            className="post-item__actions--button"
            onClick={() => unlikePostById(post._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-heart`}></use>
              </svg>
            </div>
            Unlike
          </div>
        ) : (
          <div
            className="post-item__actions--button"
            onClick={() => likePostById(post._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-heart-outlined`}></use>
              </svg>
            </div>
            Like
          </div>
        )}
        <div
          className="post-item__actions--button"
          onClick={() => {
            toggleShowComments(!showComments);
          }}
        >
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-message`}></use>
            </svg>
          </div>
          Comments
        </div>
        {post.saves.some((postSaved) => postSaved._id === user._id) ? (
          <div
            className="post-item__actions--button"
            onClick={() => unsavePostById(post._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-bookmark`}></use>
              </svg>
            </div>
            Unsave
          </div>
        ) : (
          <div
            className="post-item__actions--button"
            onClick={() => savePostById(post._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-bookmark`}></use>
              </svg>
            </div>
            Save
          </div>
        )}
      </div>
      {showComments && (
        <div className="post-item__body--comments">
          <div className="comment-form__container">
            <img src={user.photo} alt={user.fullName} />
            <CommentForm postId={post._id} />
          </div>

          {post.comments.length > 0 ? (
            post.comments.map((com) => (
              <CommentItem key={com._id} comment={com} />
            ))
          ) : (
            <div className="post-item__comments--error">No comments</div>
          )}
        </div>
      )}
    </div>
  );
};

PostItem.propTypes = {
  likePostById: PropTypes.func.isRequired,
  unlikePostById: PropTypes.func.isRequired,
  savePostById: PropTypes.func.isRequired,
  unsavePostById: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  likePostById,
  unlikePostById,
  savePostById,
  unsavePostById,
})(PostItem);
