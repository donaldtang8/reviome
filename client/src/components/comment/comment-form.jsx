import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { createComment } from './../../redux/actions/posts';

const CommentForm = ({ postId, createComment }) => {
  const [formData, setFormData] = useState({
    text: '',
  });

  const { text } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createComment(postId, formData);
    setFormData({ text: '' });
  };

  return (
    <div className="comment-form__form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="text"
          placeholder="Post a comment"
          value={text}
          onChange={handleChange}
          required
        />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
};

export default connect(null, { createComment })(CommentForm);
