import React, { useState } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { updateMe, updateSocials } from './../../redux/actions/users';
import { updatePassword } from './../../redux/actions/auth';

const Account = ({
  updateMe,
  updateSocials,
  updatePassword,
  auth: { user, loading },
  match,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.fName,
    lastName: user.lName,
    username: user.uName,
    photo: null,
  });

  const [modified, setModified] = useState(false);

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

  const handleUserChange = (e) => {
    setModified(true);
    if (e.target.name === 'photo') {
      if (!e.target.files[0].type.startsWith('image')) {
        alert('Only image files are allowed');
      } else {
        setFormData({ ...formData, photo: e.target.files[0] });
        let reader = new FileReader();
        reader.onload = function (ev) {
          let img = document.getElementById('form__image');
          img.src = ev.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
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
    if (modified) {
      updateMe(formData);
    }
    setFormData({ ...formData, photo: null });
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
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={handleUserChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={handleUserChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleUserChange}
        />
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
        <input className="input__submit" type="submit" value="Submit" />
      </form>
      <form className="form__container" onSubmit={handlePasswordSubmit}>
        <div className="heading-1 padding-small">Password</div>
        <input
          type="password"
          name="passwordCurrent"
          placeholder="Current Password"
          value={passwordCurrent}
          onChange={handlePasswordChange}
          minLength="8"
        />
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={password}
          onChange={handlePasswordChange}
          minLength="8"
        />
        <input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm New Password"
          value={passwordConfirm}
          onChange={handlePasswordChange}
          minLength="8"
        />
        <input className="input__submit" type="submit" value="Submit" />
      </form>
      <form className="form__container" onSubmit={handleSocialSubmit}>
        <div className="heading-1 padding-small">Social Links</div>
        <div className="p-small italic padding-small">
          Ex. https://website.com/username
        </div>
        <input
          type="url"
          name="youtube"
          placeholder="Youtube"
          value={youtube}
          onChange={handleSocialChange}
        />
        <input
          type="url"
          name="instagram"
          placeholder="Instagram"
          value={instagram}
          onChange={handleSocialChange}
        />
        <input
          type="url"
          name="soundcloud"
          placeholder="Soundcloud"
          value={soundcloud}
          onChange={handleSocialChange}
        />
        <input
          type="url"
          name="spotify"
          placeholder="Spotify"
          value={spotify}
          onChange={handleSocialChange}
        />
        <input
          type="url"
          name="twitch"
          placeholder="Twitch"
          value={twitch}
          onChange={handleSocialChange}
        />
        <input className="input__submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};

Account.propTypes = {
  updateMe: PropTypes.func.isRequired,
  updateSocials: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  updateMe,
  updateSocials,
  updatePassword,
})(Account);
