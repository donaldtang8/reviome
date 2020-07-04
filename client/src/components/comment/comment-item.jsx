import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  deleteCommentById,
  likeCommentById,
  unlikeCommentById,
} from '../../redux/actions/posts';

import sprite from '../../assets/sprite.svg';

const CommentItem = ({
  auth: { user },
  deleteCommentById,
  likeCommentById,
  unlikeCommentById,
  comment,
}) => {
  return (
    <div className="comment__container">
      <div className="comment__container--header">
        <Link to={`/profile/${comment.user.uName}`}>
          <img src={comment.user.photo} alt={comment.user.fullName} />
        </Link>
      </div>
      <div className="comment__container--main">
        <div className="comment__container--name">
          <Link to={`/profile/${comment.user.uName}`}>
            {comment.user.fullName}
          </Link>
        </div>
        <div className="comment__container--text">{comment.text}</div>
      </div>
      <div className="comment__container--actions">
        {user._id === comment.user._id ? (
          <div
            className="comment__container--action"
            onClick={() => deleteCommentById(comment.post, comment._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-trash`}></use>
              </svg>
            </div>
          </div>
        ) : comment.likes.some((userLiked) => userLiked._id === user._id) ? (
          <div className="comment__container--action">
            <div onClick={() => unlikeCommentById(comment.post, comment._id)}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-heart`}></use>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="comment__container--action">
            <div onClick={() => likeCommentById(comment.post, comment._id)}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-heart-outlined`}></use>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  deleteCommentById: PropTypes.func.isRequired,
  likeCommentById: PropTypes.func.isRequired,
  unlikeCommentById: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deleteCommentById,
  likeCommentById,
  unlikeCommentById,
})(CommentItem);
