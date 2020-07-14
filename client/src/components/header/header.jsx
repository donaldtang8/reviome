import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import HeaderDropdown from './header-dropdown';
import NotificationDropdown from './../notification/notification-dropdown';

import { logout } from './../../redux/actions/auth';

const Header = ({ auth: { isAuthenticated, user }, logout, match }) => {
  // check toggles the checkbox for mobile nav
  // 1. True - Mobile nav is opened
  // 2. False - Mobile nav is closed
  const [checked, setChecked] = useState(false);

  const handleMobileNav = (e) => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  return (
    <header className="header">
      <div className="header__nav">
        <div className="header__logo">
          <Link to="/">REVIO</Link>
        </div>
        {/* NAV BAR */}
        {isAuthenticated ? (
          <Fragment>
            <nav className="nav">
              <div className="nav__item">
                <Link to={`/profile/${user.uName}`}>
                  <img className="nav__item--img" src={user.photo} />
                </Link>
              </div>
              <div className="nav__item">
                <NotificationDropdown />
              </div>
              <div className="nav__item">
                <HeaderDropdown user={user} />
              </div>
            </nav>
            {/* NAV MOBILE BUTTON */}
            <input
              type="checkbox"
              className="nav__checkbox"
              id="nav-toggle"
              onChange={handleMobileNav}
              checked={checked}
            />
            <label htmlFor="nav-toggle" className="nav__button">
              <span className="nav__icon"></span>
            </label>
            {/* NAV MOBILE NAVIGATION */}
            <div className="nav__mobile center">
              <Link
                to="/"
                className="nav__mobile--item"
                onClick={handleMobileNav}
              >
                Feed
              </Link>
              <Link
                to="/explore"
                className="nav__mobile--item"
                onClick={handleMobileNav}
              >
                Explore
              </Link>
              <Link
                to="/favorites"
                className="nav__mobile--item"
                onClick={handleMobileNav}
              >
                Favorites
              </Link>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <nav className="nav">
              <Link to="/login" className="nav__item">
                Login
              </Link>
              <div className="nav__item">
                <HeaderDropdown user={user} />
              </div>
            </nav>
          </Fragment>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(withRouter(Header));
