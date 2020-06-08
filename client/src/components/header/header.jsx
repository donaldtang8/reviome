import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import HeaderDropdown from './header-dropdown';
import NotificationDropdown from './../notification/notification-dropdown';

import { logout } from './../../redux/actions/auth';

const Header = ({ auth: { isAuthenticated, user }, logout, match }) => {
  return (
    <header className="header">
      <div className="header__nav">
        <div className="header__logo">
          <Link to="/">REVIO</Link>
        </div>
        <nav className="nav">
          {isAuthenticated ? (
            <Fragment>
              <div className="nav__item">
                <Link to={`/profile/${user._id}`}>
                  <img className="nav__item--img" src={user.photo} />
                </Link>
              </div>
              <div className="nav__item">
                <NotificationDropdown />
              </div>
              <div className="nav__item">
                <HeaderDropdown user={user} />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Link to="/login" className="nav__item">
                Login
              </Link>
            </Fragment>
          )}
        </nav>
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
