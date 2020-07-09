import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import CommentDropdown from './comment-dropdown';

import { likeCommentById, unlikeCommentById } from '../../redux/actions/posts';

import sprite from '../../assets/sprite.svg';

const CommentItem = ({
  auth: { user },
  likeCommentById,
  unlikeCommentById,
  post,
  comment,
  reportOpenCallback,
  reportItemCallback,
  reportItemTypeCallback,
}) => {
  return (
    <div className="comment__container">
      <div className="comment__container--header">
        <Link to={`/profile/${comment.user.uName}`}>
          <img src={comment.user.photo} alt={comment.user.fullName} />
        </Link>
      </div>
      <div className="comment__container--main">
        <div className="comment__container--top">
          <div className="comment__container--name">
            <Link to={`/profile/${comment.user.uName}`}>
              {comment.user.fullName}
            </Link>
          </div>
          <CommentDropdown
            post={post}
            comment={comment}
            reportOpenCallback={reportOpenCallback}
            reportItemCallback={reportItemCallback}
            reportItemTypeCallback={reportItemTypeCallback}
          />
        </div>
        <div className="comment__container--text">{comment.text}</div>
      </div>
      <div className="comment__container--actions">
        {comment.likes.some((userLiked) => userLiked._id === user._id) ? (
          <div
            className="comment__container--action"
            onClick={() => unlikeCommentById(post._id, comment._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-heart`}></use>
              </svg>
            </div>
            {comment.likes.length}
          </div>
        ) : (
          <div
            className="comment__container--action"
            onClick={() => likeCommentById(post._id, comment._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-heart-outlined`}></use>
              </svg>
            </div>
            {comment.likes.length}
          </div>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  likeCommentById: PropTypes.func.isRequired,
  unlikeCommentById: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  reportOpenCallback: PropTypes.func,
  reportItemCallback: PropTypes.func,
  reportItemTypeCallback: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  likeCommentById,
  unlikeCommentById,
})(CommentItem);
