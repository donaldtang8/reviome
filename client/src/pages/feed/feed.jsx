import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  getFeed,
  getSavedPosts,
  getPostsByUser,
  getSavedPostsByUser,
  resetPosts,
} from './../../redux/actions/posts';
import PostItem from '../../components/post/post-item';
import Spinner from '../../components/spinner/spinner';

import debounce from 'lodash.debounce';

const Feed = ({
  getFeed,
  getSavedPosts,
  getPostsByUser,
  getSavedPostsByUser,
  resetPosts,
  pageType,
  userId,
  posts: { posts, loading, page, nextPage, errors },
  match,
}) => {
  // we only want useEffect to fire when nav link for feed has been clicked
  useEffect(() => {
    resetPosts();
    if (pageType === 'feed') {
      getFeed(page);
    } else if (pageType === 'favorites') {
      getSavedPosts(page);
    } else if (pageType === 'profilePosts') {
      getPostsByUser(page, userId);
    } else if (pageType === 'profileFavorites') {
      getSavedPostsByUser(page, userId);
    }
  }, []);

  window.onscroll = debounce(() => {
    // when users scroll, if the inner height is smaller than the window height we still call get feed
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight &&
      nextPage
    ) {
      if (loading || errors.length > 0) return;
      if (pageType === 'feed') {
        getFeed();
      } else if (pageType === 'favorites') {
        getSavedPosts();
      } else if (pageType === 'profilePosts') {
        getPostsByUser(page, userId);
      } else if (pageType === 'profileFavorites') {
        getSavedPostsByUser(page, userId);
      }
    }
  }, 100);

  return (
    <div className="posts__container">
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <div>No posts here. Please check out the explore page!</div>
      ) : (
        posts.map((post) => <PostItem key={post._id} post={post} />)
      )}
      {!nextPage && posts.length > 0 && (
        <div className="posts__container--end">No more posts</div>
      )}
    </div>
  );
};

Feed.propTypes = {
  getFeed: PropTypes.func.isRequired,
  getSavedPosts: PropTypes.func.isRequired,
  getPostsByUser: PropTypes.func.isRequired,
  getSavedPostsByUser: PropTypes.func.isRequired,
  resetPosts: PropTypes.func,
  pageType: PropTypes.string,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

export default connect(mapStateToProps, {
  getFeed,
  getSavedPosts,
  getPostsByUser,
  getSavedPostsByUser,
  resetPosts,
})(withRouter(Feed));
