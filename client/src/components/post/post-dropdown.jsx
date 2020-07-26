import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deletePostById } from './../../redux/actions/posts';
import { blockUserById } from './../../redux/actions/users';

import sprite from '../../assets/sprite.svg';

const PostDropdown = ({
  deletePostById,
  blockUserById,
  auth: { user },
  post,
  reportOpenCallback,
  reportItemCallback,
  reportItemTypeCallback,
}) => {
  // visible refers to the toggle of the dropdown menu
  const [visible, setVisible] = useState(false);
  // refs
  const [refs, setRefs] = useState({
    btnRef: React.createRef(),
    menuRef: React.createRef(),
  });
  const { btnRef, menuRef } = refs;

  // whenever dropdown visible state is toggled, add or remove listener to hide dropdown
  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', hideDropdownHandler);
    } else {
      document.removeEventListener('mousedown', hideDropdownHandler);
    }
  }, [visible]);

  const hideDropdownHandler = (e) => {
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

  // handleClick will handle the toggling of the visible state of the dropdown menu when the dropdown menu dots are pressed
  const handleDropdownClick = (e) => {
    e.preventDefault();
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const handleBlock = (e) => {
    e.preventDefault();
    blockUserById(post.user._id);
    setVisible(false);
  };

  // When report option is clicked:
  // 1. Call report callback function to set item property of report
  // 2. Check if report toggle is false - If so, set report toggle to open and dropdown toggle to close
  // 3. Set dropdown visible toggle to false to close dropdown
  const handleReportClick = (e) => {
    reportOpenCallback(true);
    reportItemCallback(post);
    reportItemTypeCallback('Post');
    setVisible(false);
  };

  return (
    <div className={visible ? 'dropdown dropdown__menu--show' : 'dropdown'}>
      <div
        ref={btnRef}
        id="dropdown-btn"
        className="dropdown__btn"
        onClick={handleDropdownClick}
      >
        <span className="dropdown__dot dropdown-dot"></span>
        <span className="dropdown__dot dropdown-dot"></span>
        <span className="dropdown__dot dropdown-dot"></span>
      </div>
      <div
        ref={menuRef}
        className="dropdown__menu"
        tabIndex="-1"
        aria-labelledby="dropdown-btn"
        aria-hidden="true"
      >
        <Link to={`/post/${post._id}`} className="dropdown__menu--item">
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-share-alternitive`}></use>
            </svg>
          </div>
          <div className="dropdown__menu--text">Open</div>
        </Link>
        {user._id !== post.user._id ? (
          <Fragment>
            <div className="dropdown__menu--item" onClick={handleReportClick}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-flag`}></use>
                </svg>
              </div>
              <div className="dropdown__menu--text">Report</div>
            </div>
            <div className="dropdown__menu--item" onClick={handleBlock}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-block`}></use>
                </svg>
              </div>
              <div className="dropdown__menu--text">Block</div>
            </div>
          </Fragment>
        ) : (
          <div
            className="dropdown__menu--item"
            onClick={() => deletePostById(post._id, post.category._id)}
          >
            <div className="btn__dropdown">
              <svg className="btn__dropdown--svg">
                <use xlinkHref={`${sprite}#icon-trash`}></use>
              </svg>
            </div>
            <div className="dropdown__menu--text">Delete</div>
          </div>
        )}
      </div>
    </div>
  );
};

PostDropdown.propTypes = {
  deletePostById: PropTypes.func.isRequired,
  blockUserById: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  reportOpenCallback: PropTypes.func,
  reportItemCallback: PropTypes.func,
  reportItemTypeCallback: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePostById, blockUserById })(
  PostDropdown
);
