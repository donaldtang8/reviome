import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  resetCategories,
  getCategoryById,
  updateCategoryById,
} from './../../redux/actions/categories';
import { setAlert } from './../../redux/actions/alert';

import Spinner from './../../components/spinner/spinner';
import CropBox from './../../components/crop-image/index';

const CategoryItem = ({
  resetCategories,
  getCategoryById,
  updateCategoryById,
  auth,
  categories: { categories, category },
  match,
  history,
}) => {
  useEffect(() => {
    getCategoryById(match.params.id);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    parent: 'null',
    slug: '',
    photoPreview: null,
    photo: null,
    photoName: null,
  });

  // modified keeps track of whether or not user data was actually modified
  const [modified, setModified] = useState(false);

  //imageData will store the original image that was uploaded
  const [imageData, setImageData] = useState(null);

  // imageModified will keep track of whether or not a cropped image was passed back from the callback
  const [imageModified, setImageModified] = useState(false);

  // when category is loaded, set initial data
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        parent: category.parent,
        slug: category.slug,
      });
    }
  }, [category]);

  const { name, parent, slug, photo } = formData;

  // when image is modified (toggled when cropped image passed to callback) show preview of cropped image in img tag
  useEffect(() => {
    if (imageModified) {
      let img = document.getElementById('form__image');
      img.src = formData.photoPreview;
    }
  }, [imageModified]);

  // callback function passed to crop box object that will return the cropped image in a blob object
  const imageCallback = (blobUrl, blobObj) => {
    // check if crop was canceled
    if (!blobUrl || !blobObj) {
      // if either parameter is null, then crop was canceled, so we clear imageData
      setImageData(null);
      setFormData({ ...formData, photo: null, photoName: null });
    } else {
      // else, upload form data and show photoPreview of cropped image
      setFormData({ ...formData, photoPreview: blobUrl, photo: blobObj });
      setImageModified(true);
      setImageModified(false);
    }
  };

  // when original image is uploaded, set 'imageData' in state to the uploaded image and show preview of image in img tag
  const readFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = function (ev) {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // updates formData
  const handleChange = (e) => {
    setModified(true);
    if (e.target.name === 'photo') {
      if (e.target.files[0]) {
        if (!e.target.files[0].type.startsWith('image')) {
          alert('Only image files are allowed');
        } else {
          setFormData({
            ...formData,
            photo: e.target.files[0],
            photoName: `user-${auth.user._id}-${Date.now()}.jpeg`,
          });
          readFile(e.target.files[0]);
        }
      }
    } else {
      if (e.target.value === 'null') {
        setFormData({ ...formData, parent: null });
      }
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // we only want to call updateMe action if user data was actually modified
    if (modified) {
      // if user uploaded a new profile image, check to see if image was cropped before submitting
      if (formData.photo) {
        // we check if formData.photoPreview exists because it will only be set if the original image was cropped
        if (formData.photoPreview) {
          updateCategoryById(category._id, formData);
          setFormData({
            ...formData,
            photoPreview: null,
            photo: null,
            photoName: null,
          });
          document.querySelector(`select#categories`).selectedkey = 0;
          setModified(false);
          setImageData(null);
        } else {
          setAlert('Please crop the image before uploading!', 'fail');
        }
      } else {
        updateCategoryById(category._id, formData);
        setFormData({
          ...formData,
          photoPreview: null,
          photo: null,
          photoName: null,
        });
        setModified(false);
        setImageData(null);
      }
    }
  };

  return !category ? (
    <Spinner />
  ) : (
    <div className="section__container">
      <form className="form__container" onSubmit={handleSubmit}>
        <input
          className="form__input"
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
        />
        <label className="form__label" htmlFor="name">
          Name
        </label>
        <input
          className="form__input"
          type="text"
          name="slug"
          id="slug"
          placeholder="Slug"
          value={slug}
          onChange={handleChange}
        />
        <label className="form__label" htmlFor="slug">
          Slug
        </label>
        <select
          className="input__select"
          id="categories"
          name="parent"
          onChange={handleChange}
          defaultValue={parent}
          required
        >
          <option value="null">{!parent ? 'No Parent' : parent.name}</option>
          {categories.map(
            (cat) =>
              !cat.genre && (
                <option
                  className="post-form__container--option"
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>
              )
          )}
        </select>
        {(category.photo || imageData) && (
          <div className="categories__manage--img">
            <img src={category.photo} id="form__image" />
          </div>
        )}
        <input
          className="form__container--file"
          type="file"
          accept="image/*"
          name="photo"
          id="photo"
          onChange={handleChange}
        />
        <label className="form__container--label" htmlFor="photo">
          {!photo
            ? 'Choose a photo'
            : !photo.name
            ? 'Photo selected'
            : photo.name}
        </label>
        {imageData !== null && (
          <CropBox shape="rect" image={imageData} callback={imageCallback} />
        )}

        <input className="input__submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};

CategoryItem.propTypes = {
  resetCategories: PropTypes.func.isRequired,
  getCategoryById: PropTypes.func.isRequired,
  updateCategoryById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  categories: state.categories,
});

export default connect(mapStateToProps, {
  resetCategories,
  getCategoryById,
  updateCategoryById,
})(CategoryItem);
