import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { getPostById } from './../../redux/actions/posts';
import PostItem from './../../components/post/post-item';

import Spinner from './../../components/spinner/spinner';

const Post = ({ getPostById, posts: { post, loading }, match }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="section__container posts__container">
      {post === null ? (
        <div>No post found.</div>
      ) : (
        <PostItem key={post._id} post={post} />
      )}
    </div>
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

export default connect(mapStateToProps, { getPostById })(Post);
