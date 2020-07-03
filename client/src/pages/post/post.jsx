import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { getPostById } from './../../redux/actions/posts';
import PostItem from './../../components/post/post-item';

import Spinner from './../../components/spinner/spinner';
import ReportForm from './../../components/report/report-form';

const Post = ({ getPostById, posts: { post, loading }, match }) => {
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

export default connect(mapStateToProps, { getPostById })(Post);
