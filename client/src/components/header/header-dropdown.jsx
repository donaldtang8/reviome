import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { logout } from './../../redux/actions/auth';

import sprite from './../../assets/sprite.svg';

const HeaderDropdown = ({ logout, user, match }) => {
  const [visible, setVisible] = useState(false);
  const [refs, setRefs] = useState({
    btnRef: React.createRef(),
    menuRef: React.createRef(),
  });

  const { btnRef, menuRef } = refs;

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', hideDropdown);
    } else {
      document.removeEventListener('mousedown', hideDropdown);
    }
  }, [visible]);

  useEffect(() => {
    const toggleSwitch = document.querySelector(
      '.toggle-switch--item input[type="checkbox"]'
    );
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
      }
    }
  }, [match.url]);

  const handleClick = (e) => {
    e.preventDefault();
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const handleTheme = (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  const hideDropdown = (e) => {
    if (btnRef.current || menuRef.current) {
      if (
        btnRef.current.contains(e.target) ||
        menuRef.current.contains(e.target)
      ) {
        return;
      }
      setVisible(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className={visible ? 'dropdown dropdown__menu--show' : 'dropdown'}>
      <div
        ref={btnRef}
        id="dropdown-btn"
        className="dropdown__btn"
        onClick={handleClick}
      >
        <div className="btn__icon">
          <svg className="btn__icon--svg">
            <use xlinkHref={`${sprite}#icon-chevron-down`}></use>
          </svg>
        </div>
      </div>
      <div
        ref={menuRef}
        className="dropdown__menu"
        tabIndex="-1"
        aria-labelledby="dropdown-btn"
        aria-hidden="true"
      >
        <Link to={`/profile/${user._id}`} className="dropdown__menu--item">
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-user`}></use>
            </svg>
          </div>
          Profile
        </Link>
        <Link to="/account" className="dropdown__menu--item">
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-cog`}></use>
            </svg>
          </div>
          Account
        </Link>
        <div className="dropdown__menu--item">
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-moon`}></use>
            </svg>
          </div>
          <div>Dark Mode</div>
          <div className="toggle-switch__container">
            <label className="toggle-switch--item" htmlFor="checkbox">
              <input type="checkbox" id="checkbox" onChange={handleTheme} />
              <div className="slider round"></div>
            </label>
          </div>
        </div>
        <div className="dropdown__menu--item" onClick={handleLogout}>
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-exit`}></use>
            </svg>
          </div>
          Logout
        </div>
      </div>
    </div>
  );
};

HeaderDropdown.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(null, { logout })(withRouter(HeaderDropdown));
