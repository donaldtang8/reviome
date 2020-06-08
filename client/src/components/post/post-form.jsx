import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { getAllCategories } from './../../redux/actions/categories';
import { createPost } from './../../redux/actions/posts';

const PostForm = ({
  getAllCategories,
  createPost,
  categories: { categories },
  history,
}) => {
  useEffect(() => {
    getAllCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    link: '',
    category: '',
  });

  const { title, text, link } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(formData);
    setFormData({ title: '', text: '', link: '', category: '' });
    document.querySelector('select#categories').selectedIndex = 0;
    history.push('/');
  };

  return (
    <div className="post-form__container">
      <form className="form__container" onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={link}
          onChange={handleChange}
          required
        />

        <label htmlFor="categories">Choose a category:</label>
        <select
          id="categories"
          name="category"
          onChange={handleChange}
          required
        >
          <option value="" disabled selected>
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
                        <option key={subcat._id} value={subcat._id}>
                          {subcat.name}
                        </option>
                      )
                  )}
                </optgroup>
              )
          )}
        </select>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, { getAllCategories, createPost })(
  withRouter(PostForm)
);
