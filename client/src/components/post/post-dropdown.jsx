import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deletePostById } from './../../redux/actions/posts';
import { blockUserById } from './../../redux/actions/users';

import ReportForm from './../../components/report/report-form';

import sprite from '../../assets/sprite.svg';

const PostDropdown = ({
  deletePostById,
  blockUserById,
  auth: { user },
  post,
  reportOpenCallback,
  reportItemCallback,
}) => {
  // visible refers to the toggle of the dropdown menu
  const [visible, setVisible] = useState(false);
  // popupVisible refers to the toggle of the report popup
  const [popupVisible, setPopupVisible] = useState(false);
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

  const forceHide = () => {
    setVisible(false);
  };

  const handleBlock = (e) => {
    e.preventDefault();
    blockUserById(post.user._id);
    forceHide();
  };

  const handleReportPopup = (e) => {
    reportItemCallback(post);
    if (!popupVisible) {
      reportOpenCallback(true);
      setPopupVisible(true);
      forceHide();
    }
    // reset popup visibility state when dropdown is closed
    setPopupVisible(false);
  };

  return (
    <div className={visible ? 'dropdown dropdown__menu--show' : 'dropdown'}>
      <div
        ref={btnRef}
        id="dropdown-btn"
        className="dropdown__btn"
        onClick={handleClick}
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
          Open
        </Link>
        {user._id !== post.user._id ? (
          <Fragment>
            <div className="dropdown__menu--item" onClick={handleReportPopup}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-flag`}></use>
                </svg>
              </div>
              Report
            </div>
            <div className="dropdown__menu--item" onClick={handleBlock}>
              <div className="btn__dropdown">
                <svg className="btn__dropdown--svg">
                  <use xlinkHref={`${sprite}#icon-block`}></use>
                </svg>
              </div>
              Block
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
            Delete
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePostById, blockUserById })(
  PostDropdown
);
