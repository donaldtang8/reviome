import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPostById } from './../../redux/actions/posts';
import PostItem from './../../components/post/post-item';

import Spinner from './../../components/spinner/spinner';
import ReportForm from './../../components/report/report-form';

import sprite from '../../assets/sprite.svg';

const Post = ({ getPostById, posts: { post, loading }, match, history }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById]);

  // reportOpen will toggle report form
  const [reportOpen, setReportOpen] = useState(false);
  // item refers to the item object in ReportForm
  const [reportItem, setReportItem] = useState(null);

  // Callback to toggle report open property
  const reportOpenCallback = (open) => {
    setReportOpen(open);
  };

  // Callback to return post object from post dropdown component
  const reportItemCallback = (itemData) => {
    setReportItem(itemData);
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="section__container posts__container">
      <div className="btn__icon" onClick={() => history.goBack()}>
        <svg className="btn__icon--svg">
          <use xlinkHref={`${sprite}#icon-back`}></use>
        </svg>
      </div>
      {post === null ? (
        <div>No post found.</div>
      ) : (
        <Fragment>
          <PostItem
            key={post._id}
            post={post}
            reportOpenCallback={reportOpenCallback}
            reportItemCallback={reportItemCallback}
          />
          {reportItem && (
            <ReportForm
              item={reportItem}
              type="Post"
              reportOpen={reportOpen}
              reportItemCallback={reportItemCallback}
              reportOpenCallback={reportOpenCallback}
            />
          )}
        </Fragment>
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

export default connect(mapStateToProps, { getPostById })(withRouter(Post));
