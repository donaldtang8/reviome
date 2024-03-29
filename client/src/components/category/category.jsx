import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  getCategoryBySlug,
  getSubcategoriesBySlug,
} from './../../redux/actions/categories';

import CategoryOverview from './category-overview';

const Category = ({
  getCategoryBySlug,
  getSubcategoriesBySlug,
  categories: { categories, category },
  match,
  history,
}) => {
  useEffect(() => {
    getCategoryBySlug(match.params.category);
    getSubcategoriesBySlug(match.params.category);
  }, [getCategoryBySlug, getSubcategoriesBySlug, match.params.category]);

  return (
    <div className="explore__container">
      <div className="explore__categories">
        {category && (
          <CategoryOverview
            category={category}
            origin="category"
            history={history}
          />
        )}
      </div>
    </div>
  );
};

Category.propTypes = {
  getCategoryBySlug: PropTypes.func.isRequired,
  getSubcategoriesBySlug: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, {
  getCategoryBySlug,
  getSubcategoriesBySlug,
})(withRouter(Category));
