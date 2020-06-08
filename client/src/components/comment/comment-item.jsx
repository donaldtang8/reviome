import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  likeCommentById,
  unlikeCommentById,
  deleteCommentById,
} from '../../redux/actions/posts';

const CommentItem = ({
  auth: { user },
  likeCommentById,
  unlikeCommentById,
  deleteCommentById,
  comment,
}) => {
  return (
    <div className="comment__container">
      <div className="comment__container--header">
        <Link to={`/profile/${comment.user._id}`}>
          <img src={comment.user.photo} alt={comment.user.fullName} />
        </Link>
      </div>
      <div className="comment__container--main">
        {(comment.post, comment.text)}
      </div>
      <div className="comment__container--actions">
        {user._id === comment.user._id ? (
          <div
            className="comment__container--action"
            onClick={() => deleteCommentById(comment.post, comment._id)}
          >
            Delete
          </div>
        ) : comment.likes.some((userLiked) => userLiked._id === user._id) ? (
          <div className="comment__container--action">
            <button
              onClick={() => unlikeCommentById(comment.post, comment._id)}
            >
              Unike
            </button>
          </div>
        ) : (
          <div className="comment__container--action">
            <button onClick={() => likeCommentById(comment.post, comment._id)}>
              Like
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  likeCommentById: PropTypes.func.isRequired,
  unlikeCommentById: PropTypes.func.isRequired,
  deleteCommentById: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  likeCommentById,
  unlikeCommentById,
  deleteCommentById,
})(CommentItem);
