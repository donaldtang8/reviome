import React, { useEffect, useState } from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getPostsByCategorySlug,
  resetPosts,
} from './../../redux/actions/posts';
import {
  setGenre,
  getCategoryBySlug,
  followCategoryById,
  unfollowCategoryById,
} from './../../redux/actions/categories';

import ExplorePost from './../../components/explore/explore-post';
import Spinner from '../../components/spinner/spinner';

import debounce from 'lodash.debounce';

const ExploreFeed = ({
  getPostsByCategorySlug,
  getCategoryBySlug,
  resetPosts,
  setGenre,
  followCategoryById,
  unfollowCategoryById,
  auth: { user },
  posts: { posts, loading, page, nextPage, errors },
  categories: { category, genre },
  history,
}) => {
  let { url } = useRouteMatch();

  const [genreIsSet, toggleGenreIsSet] = useState(false);

  // set genre by parsing url
  useEffect(() => {
    setGenre(url.split('/explore/')[1]);
    getCategoryBySlug(url.split('/explore/')[1]);
    toggleGenreIsSet(true);
    resetPosts();
  }, []);

  // if genre has been set, send api call to retrieve posts
  useEffect(() => {
    if (genreIsSet) {
      getPostsByCategorySlug(page, genre);
    }
  }, [genreIsSet]);

  window.onscroll = debounce(() => {
    // when users scroll, if the inner height is smaller than the window height we still call get feed
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight &&
      nextPage
    ) {
      if (loading || errors.length > 0) return;
      getPostsByCategorySlug(page, genre);
    }
  }, 100);

  return loading ? (
    <Spinner />
  ) : (
    <div className="explore-posts__container wide__container">
      <div className="explore-posts__container--header">
        <div className="explore-posts__container--title">
          {category && category.name}
        </div>
        <div className="explore-posts__container--info">
          {category && category.followers} followers -{' '}
          {category && category.num_posts} posts
        </div>
        {category && (
          <div className="explore-posts__container--actions">
            {user.categories_following.some(
              (categoryFollowing) => categoryFollowing === category._id
            ) ? (
              <div
                className="btn__action btn__action--inactive"
                onClick={() => unfollowCategoryById(category._id)}
              >
                Unfollow
              </div>
            ) : (
              <div
                className="btn__action btn__action--active"
                onClick={() => followCategoryById(category._id)}
              >
                Follow
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <div>No posts here. Please check out the explore page!</div>
      ) : (
        <div className="explore-feed__container">
          {posts.map((post) => (
            <ExplorePost key={post._id} post={post} history={history} />
          ))}
        </div>
      )}
      {posts.length > 0 && !nextPage && (
        <div className="exlore-feed__container--end"> No more posts</div>
      )}
    </div>
  );
};

ExploreFeed.propTypes = {
  auth: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  getPostsByCategorySlug: PropTypes.func.isRequired,
  getCategoryBySlug: PropTypes.func.isRequired,
  followCategoryById: PropTypes.func.isRequired,
  unfollowCategoryById: PropTypes.func.isRequired,
  resetPosts: PropTypes.func,
  setGenre: PropTypes.func.isRequired,
  pageType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  posts: state.posts,
  categories: state.categories,
});

export default connect(mapStateToProps, {
  getPostsByCategorySlug,
  getCategoryBySlug,
  followCategoryById,
  unfollowCategoryById,
  resetPosts,
  setGenre,
})(withRouter(ExploreFeed));
