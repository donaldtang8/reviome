import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  getFeed,
  getSavedPosts,
  getPostsByUser,
  getSavedPostsByUser,
  getCommunityPosts,
  resetPosts,
} from './../../redux/actions/posts';

import PostForm from './../../components/post/post-form';
import PostItem from '../../components/post/post-item';
import Spinner from '../../components/spinner/spinner';
import ReportForm from './../../components/report/report-form';

import debounce from 'lodash.debounce';

const Feed = ({
  getFeed,
  getSavedPosts,
  getPostsByUser,
  getSavedPostsByUser,
  getCommunityPosts,
  resetPosts,
  pageType,
  userId,
  auth: { user },
  posts: { posts, loading, page, nextPage, errors },
  match,
}) => {
  //  if posts state has been reset, we can then retrieve posts for feed
  const [stateReset, setStateReset] = useState(false);
  // reportOpen will toggle report form
  const [reportOpen, setReportOpen] = useState(false);
  // item refers to the item object in ReportForm
  const [reportItem, setReportItem] = useState(null);
  // itemType refers to the type of item being reported
  const [reportItemType, setReportItemType] = useState(null);

  useEffect(() => {
    resetPosts();
    setStateReset(true);
  }, []);

  // we only want useEffect to fire when nav link for feed has been clicked
  useEffect(() => {
    if (stateReset) {
      if (pageType === 'feed') {
        getFeed(page);
      } else if (pageType === 'favorites') {
        getSavedPosts(page);
      } else if (pageType === 'profilePosts') {
        getPostsByUser(page, userId);
      } else if (pageType === 'profileFavorites') {
        getSavedPostsByUser(page, userId);
      } else if (pageType === 'community') {
        getCommunityPosts(page, userId);
      }
    }
  }, [stateReset]);

  // Callback to toggle report open property
  const reportOpenCallback = (open) => {
    setReportOpen(open);
  };

  // Callback to return post object from post dropdown component
  const reportItemCallback = (itemData) => {
    setReportItem(itemData);
  };

  // Callback to return post object from post dropdown component
  const reportItemTypeCallback = (itemType) => {
    setReportItemType(itemType);
  };

  const handlePopup = (e) => {
    const popup = document.querySelector('#popupPost');
    const popupContent = document.querySelector('#popupPostContent');
    popup.style.opacity = '1';
    popup.style.visibility = 'visible';
    // popupContent.opacity = "1";
    // popupContent.transform = "translate(-50%, -50%) scale(1)";
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (pageType === 'feed') {
      getFeed(page);
    } else if (pageType === 'favorites') {
      getSavedPosts(page);
    } else if (pageType === 'profilePosts') {
      getPostsByUser(page, userId);
    } else if (pageType === 'profileFavorites') {
      getSavedPostsByUser(page, userId);
    } else if (pageType === 'community') {
      getCommunityPosts(page);
    }
  };

  return page === 1 && loading ? (
    <Spinner />
  ) : (
    <div
      className={
        pageType !== 'feed' && pageType !== 'favorites'
          ? 'profile-posts__container'
          : 'section__container'
      }
    >
      {pageType === 'feed' && (
        <div className="posts__container--form">
          <img src={user.photo} alt={user.fullName} />
          <div className="input__btn" onClick={handlePopup}>
            Create a post
          </div>
          <PostForm />
        </div>
      )}
      {page === 1 && loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <div className="center padding-small">No posts here!</div>
      ) : (
        <div className="posts__container">
          {posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              reportOpenCallback={reportOpenCallback}
              reportItemCallback={reportItemCallback}
              reportItemTypeCallback={reportItemTypeCallback}
            />
          ))}
          {nextPage &&
            (page > 1 && loading ? (
              <div className="btn__load-more">Loading...</div>
            ) : (
              <div className="btn__load-more" onClick={handleClick}>
                Load More
              </div>
            ))}
        </div>
      )}
      {posts.length > 0 && !nextPage && (
        <div className="posts__container--end">No more posts</div>
      )}
      {reportItem && (
        <ReportForm
          item={reportItem}
          type={reportItemType}
          reportOpen={reportOpen}
          reportItemCallback={reportItemCallback}
          reportOpenCallback={reportOpenCallback}
        />
      )}
    </div>
  );
};

Feed.propTypes = {
  auth: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  getFeed: PropTypes.func.isRequired,
  getSavedPosts: PropTypes.func.isRequired,
  getPostsByUser: PropTypes.func.isRequired,
  getSavedPostsByUser: PropTypes.func.isRequired,
  getCommunityPosts: PropTypes.func.isRequired,
  resetPosts: PropTypes.func,
  pageType: PropTypes.string,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  posts: state.posts,
  categories: state.categories,
});

export default connect(mapStateToProps, {
  getFeed,
  getSavedPosts,
  getPostsByUser,
  getSavedPostsByUser,
  getCommunityPosts,
  resetPosts,
})(withRouter(Feed));
