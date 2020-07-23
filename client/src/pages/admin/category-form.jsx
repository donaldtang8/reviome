import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getAllCategories,
  createCategory,
} from './../../redux/actions/categories';
import { setAlert } from './../../redux/actions/alert';

import CropBox from './../../components/crop-image/index';

const CategoryForm = ({
  getAllCategories,
  createCategory,
  categories: { categories },
  match,
}) => {
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const [formData, setFormData] = useState({
    name: '',
    parentString: '',
    parent: '',
    genre: false,
    photoPreview: null,
    photo: null,
    photoName: null,
  });

  //imageData will store the original image that was uploaded
  const [imageData, setImageData] = useState(null);

  // imageModified will keep track of whether or not a cropped image was passed back from the callback
  const [imageModified, setImageModified] = useState(false);

  const { name, parentString, parent, photoPreview, photo } = formData;

  // when image is modified (toggled when cropped image passed to callback) show preview of cropped image in img tag
  useEffect(() => {
    if (imageModified) {
      let img = document.getElementById('form__image');
      img.src = formData.photoPreview;
    }
  }, [imageModified, formData.photoPreview]);

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

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      if (e.target.files[0]) {
        if (!e.target.files[0].type.startsWith('image')) {
          alert('Only image files are allowed');
        } else {
          setFormData({
            ...formData,
            photo: e.target.files[0],
            photoName: e.target.files[0].name,
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
    if (formData.parent === '') {
      delete formData.parent;
    }
    if (formData.photo) {
      // we check if formData.photoPreview exists because it will only be set if the original image was cropped
      if (formData.photoPreview) {
        createCategory(formData);
        setFormData({
          ...formData,
          name: '',
          parentString: '',
          parent: '',
          genre: false,
          photoPreview: null,
          photo: null,
          photoName: null,
        });
        document.querySelector(`select#categories`).selectedkey = 0;
        setImageData(null);
      } else {
        setAlert('Please crop the image before uploading!', 'fail');
      }
    } else {
      createCategory(formData);
      setFormData({
        ...formData,
        name: '',
        parentString: '',
        parent: '',
        genre: false,
        photoPreview: null,
        photo: null,
        photoName: null,
      });
      setImageData(null);
    }
  };

  return (
    <div className="section__container">
      <form className="form__container" onSubmit={handleSubmit}>
        <div className="heading-1 padding-small">Create Category</div>
        <input
          className="form__input"
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
          required
        />
        <label className="form__label" htmlFor="name">
          Name
        </label>
        <input
          className="form__input"
          type="text"
          name="parentString"
          placeholder="Parent String"
          value={parentString}
          onChange={handleChange}
        />
        <label className="form__label" htmlFor="parentString">
          Parent String
        </label>
        <select
          className="form__input"
          id="categories"
          name="parent"
          onChange={handleChange}
          defaultValue={parent}
        >
          <option value="">No Parent</option>
          {categories.map(
            (cat) =>
              !cat.genre && (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              )
          )}
        </select>
        <select
          className="form__input"
          id="genre"
          name="genre"
          onChange={handleChange}
          defaultValue="false"
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select>

        {(photo || imageData) && (
          <div className="categories__manage--img">
            <img src={photoPreview} id="form__image" alt="Upload" />
          </div>
        )}
        <input
          className="form__input"
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

CategoryForm.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, { getAllCategories, createCategory })(
  CategoryForm
);
