import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { logout } from './../../redux/actions/auth';

import sprite from './../../assets/sprite.svg';

const HeaderDropdown = ({
  auth: { isAuthenticated },
  logout,
  user,
  match,
  history,
}) => {
  const [visible, setVisible] = useState(false);
  const [refs, setRefs] = useState({
    btnRef: React.createRef(),
    menuRef: React.createRef(),
    itemRef: React.createRef(),
  });

  const { btnRef, menuRef, itemRef } = refs;

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', hideDropdown);
    } else {
      document.removeEventListener('mousedown', hideDropdown);
    }
  }, [visible]);

  // 'Initialize' theme to dark if no theme is set yet
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      const toggleSwitch = document.querySelector(
        '.toggle-switch--item input[type="checkbox"]'
      );
      toggleSwitch.checked = true;
    }
  }, []);

  // 'Preload' theme if set in local storage already
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
    logout(history);
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
        {isAuthenticated ? (
          <Fragment>
            <Link
              to={`/profile/${user.uName}`}
              className="dropdown__menu--item"
              ref={itemRef}
            >
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-user`}></use>
                </svg>
              </div>
              <div className="dropdown__menu--text">Profile</div>
            </Link>
            <Link to="/account" className="dropdown__menu--item" ref={itemRef}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-cog`}></use>
                </svg>
              </div>
              <div className="dropdown__menu--text">Account</div>
            </Link>
            <div className="dropdown__menu--item">
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-moon`}></use>
                </svg>
              </div>
              <div className="dropdown__menu--text">Dark Mode</div>
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
              <div className="dropdown__menu--text">Logout</div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="dropdown__menu--item">
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-moon`}></use>
                </svg>
              </div>
              <div className="dropdown__menu--text">Dark Mode</div>
              <div className="toggle-switch__container">
                <label className="toggle-switch--item" htmlFor="checkbox">
                  <input type="checkbox" id="checkbox" onChange={handleTheme} />
                  <div className="slider round"></div>
                </label>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

HeaderDropdown.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(withRouter(HeaderDropdown));
