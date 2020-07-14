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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  updateMe,
  updateSocials,
  updatePassword,
})(Account);
