import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from './../../redux/actions/alert';

import PropTypes from 'prop-types';

import { updateMe, updateSocials } from './../../redux/actions/users';
import { updatePassword } from './../../redux/actions/auth';

import CropBox from './../../components/crop-image/index';

import Resizer from 'react-image-file-resizer';

const Account = ({
  updateMe,
  updateSocials,
  updatePassword,
  setAlert,
  auth: { user, loading },
  match,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.fName,
    lastName: user.lName,
    username: user.uName,
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

  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const [socialData, setSocialData] = useState({
    youtube: user.links && user.links.youtube ? user.links.youtube : '',
    instagram: user.links && user.links.instagram ? user.links.instagram : '',
    soundcloud:
      user.links && user.links.soundcloud ? user.links.soundcloud : '',
    spotify: user.links && user.links.spotify ? user.links.spotify : '',
    twitch: user.links && user.links.twitch ? user.links.twitch : '',
  });

  const { firstName, lastName, username, photo } = formData;

  const { passwordCurrent, password, passwordConfirm } = passwordData;

  const { youtube, instagram, soundcloud, spotify, twitch } = socialData;

  // when image is modified (toggled when cropped image passed to callback) show preview of cropped image in img tag
  useEffect(() => {
    if (imageModified) {
      let img = document.getElementById('form__image');
      img.src = formData.photoPreview;
    }
  }, [imageModified]);

  // const readFile = async (file) => {
  //   let reader = new FileReader();
  //   reader.onload = function (ev) {
  //     let img = document.getElementById('form__image');
  //     img.src = ev.target.result;
  //   };
  //   reader.readAsDataURL(file);
  // };

  // callback function passed to crop box object that will return the cropped image in a blob object
  const imageCallback = (blobUrl, blobObj) => {
    // show photoPreview of cropped image
    setFormData({ ...formData, photoPreview: blobUrl, photo: blobObj });
    setImageModified(true);
    setImageModified(false);
  };

  // when original image is uploaded, set 'imageData' in state to the uploaded image and show preview of image in img tag
  const readFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = function (ev) {
      setImageData(reader.result);
      // show preview of uploaded image before cropping
      // let img = document.getElementById('form__image');
      // img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // updates formData
  const handleUserChange = (e) => {
    setModified(true);
    if (e.target.name === 'photo') {
      if (!e.target.files[0].type.startsWith('image')) {
        alert('Only image files are allowed');
      } else {
        setFormData({
          ...formData,
          photo: e.target.files[0],
          photoName: `user-${user._id}-${Date.now()}.jpeg`,
        });
        readFile(e.target.files[0]);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setSocialData({
      ...socialData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    // we only want to call updateMe action if user data was actually modified
    if (modified) {
      // if user uploaded a new profile image, check to see if image was cropped before submitting
      if (formData.photo) {
        // we check if formData.photoPreview exists because it will only be set if the original image was cropped
        if (formData.photoPreview) {
          updateMe(formData);
          setFormData({
            ...formData,
            photoPreview: null,
            photo: null,
            photoName: null,
          });
          setModified(false);
          setImageData(null);
        } else {
          setAlert('Please crop the image before uploading!', 'fail');
        }
      } else {
        updateMe(formData);
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    updatePassword(passwordData);
    setPasswordData({ passwordCurrent: '', password: '', passwordConfirm: '' });
  };

  const handleSocialSubmit = (e) => {
    e.preventDefault();
    updateSocials(socialData);
  };

  return (
    <div className="section__container account__container">
      <form className="form__container" onSubmit={handleUserSubmit}>
        <div className="heading-1 padding-small">General</div>
        <input
          className="form__input"
          type="text"
          name="firstName"
          id="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={handleUserChange}
        />
        <label className="form__label" htmlFor="firstName">
          First Name
        </label>
        <input
          className="form__input"
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={handleUserChange}
        />
        <label className="form__label" htmlFor="lastName">
          Last Name
        </label>
        <input
          className="form__input"
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={handleUserChange}
        />
        <label className="form__label" htmlFor="username">
          Username
        </label>
        <div className="account__container--img">
          <img id="form__image" src={user.photo} />
        </div>
        <input
          className="form__container--file"
          type="file"
          accept="image/*"
          name="photo"
          id="photo"
          onChange={handleUserChange}
        />
        <label className="form__container--label" htmlFor="photo">
          {!photo ? 'Choose a photo' : photo.name}
        </label>
        {imageData !== null && (
          <CropBox image={imageData} callback={imageCallback} />
        )}
        <input className="input__submit" type="submit" value="Submit" />
      </form>
      <form className="form__container" onSubmit={handlePasswordSubmit}>
        <div className="heading-1 padding-small">Password</div>
        <input
          className="form__input"
          type="password"
          name="passwordCurrent"
          id="passwordCurrent"
          placeholder="Current Password"
          value={passwordCurrent}
          onChange={handlePasswordChange}
          minLength="8"
        />
        <label className="form__label" htmlFor="passwordCurrent">
          Current Password
        </label>
        <input
          className="form__input"
          type="password"
          name="password"
          id="password"
          placeholder="New Password"
          value={password}
          onChange={handlePasswordChange}
          minLength="8"
        />
        <label className="form__label" htmlFor="password">
          New Password
        </label>
        <input
          className="form__input"
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          placeholder="Confirm New Password"
          value={passwordConfirm}
          onChange={handlePasswordChange}
          minLength="8"
        />
        <label className="form__label" htmlFor="passwordConfirm">
          Confirm New Password
        </label>
        <input className="input__submit" type="submit" value="Submit" />
      </form>
      <form className="form__container" onSubmit={handleSocialSubmit}>
        <div className="heading-1 padding-small">Social Links</div>
        <div className="p-small italic padding-small">
          Ex. https://website.com/username
        </div>
        <input
          className="form__input"
          type="url"
          name="youtube"
          id="youtube"
          placeholder="Youtube"
          value={youtube}
          onChange={handleSocialChange}
        />
        <label className="form__label" htmlFor="youtube">
          Youtube
        </label>
        <input
          className="form__input"
          type="url"
          name="instagram"
          id="instagram"
          placeholder="Instagram"
          value={instagram}
          onChange={handleSocialChange}
        />
        <label className="form__label" htmlFor="instagram">
          Instagram
        </label>
        <input
          className="form__input"
          type="url"
          name="soundcloud"
          id="soundcloud"
          placeholder="SoundCloud"
          value={soundcloud}
          onChange={handleSocialChange}
        />
        <label className="form__label" htmlFor="soundcloud">
          SoundCloud
        </label>
        <input
          className="form__input"
          type="url"
          name="spotify"
          id="spotify"
          placeholder="Spotify"
          value={spotify}
          onChange={handleSocialChange}
        />
        <label className="form__label" htmlFor="spotify">
          Spotify
        </label>
        <input
          className="form__input"
          type="url"
          name="twitch"
          id="twitch"
          placeholder="Twitch"
          value={twitch}
          onChange={handleSocialChange}
        />
        <label className="form__label" htmlFor="twitch">
          Twitch
        </label>
        <input className="input__submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};

Account.propTypes = {
  updateMe: PropTypes.func.isRequired,
  updateSocials: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  setAlert: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  updateMe,
  updateSocials,
  updatePassword,
  setAlert,
})(Account);
