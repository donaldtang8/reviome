import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { getAllCategories } from './../../redux/actions/categories';

import CategoryOverview from './../../components/category/category-overview';

const ExploreOverview = ({
  getAllCategories,
  categories: { categories },
  match,
  history,
}) => {
  useEffect(() => {
    getAllCategories();
  }, [match.url, match.params.category]);

  return (
    <div className="explore__container">
      <div className="explore__categories">
        {categories.map(
          (category) =>
            category.parent === null && (
              <CategoryOverview
                key={category._id}
                category={category}
                history={history}
              />
            )
        )}
      </div>
    </div>
  );
};

ExploreOverview.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, {
  getAllCategories,
})(ExploreOverview);
