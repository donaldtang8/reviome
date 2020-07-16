import React, { Fragment, useEffect, useState } from 'react';
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

import sprite from '../../assets/sprite.svg';

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
  match,
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
      getPostsByCategorySlug(page, genre, history);
    }
  }, [genreIsSet]);

  const handleSort = (sort) => {
    let queryString;
    if (sort === 'Time') {
      queryString = '?sort=time';
    } else if (sort === 'Likes') {
      queryString = '?sort=likes';
    }
    history.push(match.url + queryString);
    resetPosts();
    getPostsByCategorySlug(1, genre, history);
  };

  return page === 1 && loading ? (
    <Spinner />
  ) : (
    <div className="explore-feed__container large__container">
      <div className="explore-feed__container--top">
        <div className="explore-feed__container--header">
          <div className="explore-feed__container--pic"></div>
          <div className="explore-feed__container--info">
            <div className="heading-2">{category && category.name}</div>
            <div className="explore-feed__container--stats"></div>
            {category && category.followers} followers -{' '}
            {category && category.num_posts} posts
          </div>
        </div>
        {category && (
          <div className="explore-feed__container--actions">
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

      <div className="explore-feed__container--bar">
        <div className="btn__icon-label" onClick={() => handleSort('Time')}>
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-flash`}></use>
            </svg>
          </div>
          Newest
        </div>
        <div className="btn__icon-label" onClick={() => handleSort('Likes')}>
          <div className="btn__dropdown">
            <svg className="btn__dropdown--svg">
              <use xlinkHref={`${sprite}#icon-rocket`}></use>
            </svg>
          </div>
          Popular
        </div>
      </div>

      {page === 1 && loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <div className="center padding-small">
          No posts here. Please check out the explore page!
        </div>
      ) : (
        <Fragment>
          <div className="explore-feed__posts">
            {posts.map((post) => (
              <ExplorePost key={post._id} post={post} history={history} />
            ))}
          </div>
          {nextPage &&
            (page > 1 && loading ? (
              <div className="btn__load-more">Loading...</div>
            ) : (
              <div
                className="btn__load-more"
                onClick={() => getPostsByCategorySlug(page, genre, history)}
              >
                Load More
              </div>
            ))}
        </Fragment>
      )}
      {posts.length > 0 && !nextPage && (
        <div className="exlore-feed__container--end center">No more posts</div>
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
