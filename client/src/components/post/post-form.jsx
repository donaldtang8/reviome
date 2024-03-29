import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// redux
import { connect } from 'react-redux';
import { getAllCategories } from './../../redux/actions/categories';
// components
import { createPost } from './../../redux/actions/posts';
// gtag
import TagManager from 'react-gtm-module';

const PostForm = ({
  getAllCategories,
  createPost,
  auth: { user },
  categories: { categories },
  history,
}) => {
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  let tagManagerArgs = {
    dataLayer: {
      userId: user._id,
      event: 'create_post',
    },
    dataLayerName: 'PageDataLayer',
  };

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    link: '',
    category: '',
  });

  const { title, text, link } = formData;

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
    createPost(formData);
    setFormData({ title: '', text: '', link: '', category: '' });
    document.querySelector('select#categories').selectedIndex = 0;
    handlePopup();
    TagManager.dataLayer(tagManagerArgs);
  };

  const handlePopup = (e) => {
    const popup = document.querySelector('#popupPost');
    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';
    setVisible(false);
    // const popupContent = document.querySelector('#popupPostContent');
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
          <div className="popup__header--title">Create Post</div>
          <div className="popup__close" id="popup__close" onClick={handlePopup}>
            &times;
          </div>
        </div>
        <div className="popup__main post-form__container">
          <form className="form__container" onSubmit={handleSubmit}>
            <input
              className="form__input"
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={handleChange}
              required
            />
            <label className="form__label" htmlFor="title">
              Title
            </label>
            <input
              className="form__input"
              type="text"
              name="text"
              placeholder="Description"
              value={text}
              onChange={handleChange}
              required
            />
            <label className="form__label" htmlFor="text">
              Description
            </label>
            <input
              className="form__input"
              type="text"
              name="link"
              placeholder="Link"
              value={link}
              onChange={handleChange}
              required
            />
            <label className="form__label" htmlFor="link">
              Media Link
            </label>
            <label htmlFor="categories">Choose a category:</label>
            <select
              className="input__select"
              id="categories"
              name="category"
              onChange={handleChange}
              defaultValue=""
              required
            >
              <option value="" disabled>
                Choose a genre
              </option>
              {categories.map(
                (cat) =>
                  cat.parent === null && (
                    <optgroup key={cat._id} label={cat.name}>
                      {categories.map(
                        (subcat) =>
                          subcat.parent &&
                          subcat.parent._id === cat._id && (
                            <option
                              className="post-form__container--option"
                              key={subcat._id}
                              value={subcat._id}
                            >
                              {subcat.name}
                            </option>
                          )
                      )}
                    </optgroup>
                  )
              )}
            </select>
            <input className="input__submit" type="submit" value="Post" />
          </form>
        </div>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  categories: state.categories,
});

export default connect(mapStateToProps, { getAllCategories, createPost })(
  withRouter(PostForm)
);
