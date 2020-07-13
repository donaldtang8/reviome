import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { createCommunityPost } from './../../redux/actions/posts';

const ProfilePostForm = ({ createCommunityPost, history }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
  });

  const { title, text } = formData;

  const [visible, setVisible] = useState(true);
  const [refs, setRefs] = useState({
    popupPostRef: React.createRef(),
  });

  const { popupPostRef } = refs;

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleCheckPopup);
    } else {
      document.removeEventListener('mousedown', handleCheckPopup);
    }
  }, [visible]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCommunityPost(formData);
    setFormData({ title: '', text: '' });
    handlePopup();
  };

  const handlePopup = (e) => {
    const popup = document.querySelector('#popupPost');
    const popupContent = document.querySelector('#popupPostContent');
    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';
    setVisible(false);
    // popupContent.opacity = "0";
    // popupContent.transform = "translate(0, 0) scale(0)";
  };

  const handleCheckPopup = (e) => {
    if (popupPostRef.current) {
      if (popupPostRef.current.contains(e.target)) {
        return;
      }
      handlePopup();
    }
  };

  return (
    <div className="popup popupPost" id="popupPost">
      <div
        ref={popupPostRef}
        className="popup__content popupPost__content"
        id="popupPost__content"
      >
        <div className="popup__header">
          <div className="popup__header--title">Create Community Post</div>
          <div className="popup__close" id="popup__close" onClick={handlePopup}>
            &times;
          </div>
        </div>
        <div className="popup__main post-form__container">
          <form className="post-form__container--form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="text"
              placeholder="Description"
              value={text}
              onChange={handleChange}
              required
            />
            <input className="input__submit" type="submit" value="Post" />
          </form>
        </div>
      </div>
    </div>
  );
};

ProfilePostForm.propTypes = {
  createCommunityPost: PropTypes.func.isRequired,
};

export default connect(null, { createCommunityPost })(
  withRouter(ProfilePostForm)
);
