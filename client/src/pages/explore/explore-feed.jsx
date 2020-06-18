import React, { useEffect, useState } from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getPostsByCategorySlug,
  resetPosts,
} from './../../redux/actions/posts';
import { setGenre, getCategoryBySlug } from './../../redux/actions/categories';

import PostItem from './../../components/post/post-item';
import Spinner from '../../components/spinner/spinner';

import debounce from 'lodash.debounce';

const ExploreFeed = ({
  getPostsByCategorySlug,
  getCategoryBySlug,
  resetPosts,
  setGenre,
  posts: { posts, loading, page, nextPage, errors },
  categories: { category, genre },
}) => {
  let { url } = useRouteMatch();

  const [genreIsSet, toggleGenreIsSet] = useState(false);

  // set genre by parsing url
  useEffect(() => {
    setGenre(url.split('/explore/')[1]);
    getCategoryBySlug(url.split('/explore/')[1]);
    toggleGenreIsSet(true);
  }, []);

  // if genre has been set, reset post state and send api call to retrieve posts
  useEffect(() => {
    if (genreIsSet) {
      resetPosts();
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
    <div className="wide__container">
      <div className="posts__container--title">{category && category.name}</div>
      <div className="posts__container--info">
        {category && category.followers} followers -{' '}
        {category && category.num_posts} posts
      </div>
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <div>No posts here. Please check out the explore page!</div>
      ) : (
        <div className="test__container">
          <div className="explore-feed__container">
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
      {posts.length > 0 && !nextPage && (
        <div className="exlore-feed__container--end"> No more posts</div>
      )}
    </div>
  );
};

ExploreFeed.propTypes = {
  posts: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  getPostsByCategorySlug: PropTypes.func.isRequired,
  getCategoryBySlug: PropTypes.func.isRequired,
  resetPosts: PropTypes.func,
  setGenre: PropTypes.func.isRequired,
  pageType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  categories: state.categories,
});

export default connect(mapStateToProps, {
  getPostsByCategorySlug,
  getCategoryBySlug,
  resetPosts,
  setGenre,
})(withRouter(ExploreFeed));
