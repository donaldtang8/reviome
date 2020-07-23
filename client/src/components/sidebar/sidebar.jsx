import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Sidebar = ({ auth }) => {
  const [nav, setNav] = useState('feed');

  // const handleClick = (e, item) => {
  //   e.preventDefault();
  //   setNav(item);
  // };

  return (
    <div className="sidebar__container">
      <div className="sidebar__nav">
        <Link to="/" onClick={() => setNav('feed')}>
          <div
            className={
              nav === 'feed'
                ? 'sidebar__nav--item sidebar__nav--selected'
                : 'sidebar__nav--item'
            }
          >
            Feed
          </div>
        </Link>
        <Link to="/explore" onClick={() => setNav('explore')}>
          <div
            className={
              nav === 'explore'
                ? 'sidebar__nav--item sidebar__nav--selected'
                : 'sidebar__nav--item'
            }
          >
            Explore
          </div>
        </Link>
        <Link to="/favorites" onClick={() => setNav('favorites')}>
          <div
            className={
              nav === 'favorites'
                ? 'sidebar__nav--item sidebar__nav--selected'
                : 'sidebar__nav--item'
            }
          >
            Favorites
          </div>
        </Link>
        {auth.user.role === 'admin' && (
          <Fragment>
            <Link to="/reports" onClick={() => setNav('reports')}>
              <div
                className={
                  nav === 'reports'
                    ? 'sidebar__nav--item sidebar__nav--selected'
                    : 'sidebar__nav--item'
                }
              >
                Reports
              </div>
            </Link>
            <Link to="/manage/categories" onClick={() => setNav('categories')}>
              <div
                className={
                  nav === 'categories'
                    ? 'sidebar__nav--item sidebar__nav--selected'
                    : 'sidebar__nav--item'
                }
              >
                Categories
              </div>
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Sidebar);
