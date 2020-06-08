import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deletePostById } from './../../redux/actions/posts';
import { blockUserById } from './../../redux/actions/users';

const PostDropdown = ({
  deletePostById,
  blockUserById,
  auth: { user },
  post,
}) => {
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

  const handleClick = (e) => {
    e.preventDefault();
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const hideDropdown = (e) => {
    if (
      btnRef.current.contains(e.target) ||
      menuRef.current.contains(e.target)
    ) {
      return;
    }
    setVisible(false);
  };

  const handleBlock = (e) => {
    e.preventDefault();
    blockUserById(post.user._id);
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
          Open
        </Link>
        {user._id !== post.user._id ? (
          <Fragment>
            <div className="dropdown__menu--item">Report</div>
            <div className="dropdown__menu--item" onClick={handleBlock}>
              Block
            </div>
          </Fragment>
        ) : (
          <div
            className="dropdown__menu--item"
            onClick={() => deletePostById(post._id)}
          >
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePostById, blockUserById })(
  PostDropdown
);
