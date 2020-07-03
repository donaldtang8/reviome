import React, { useEffect } from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  getCategoryBySlug,
  getSubcategoriesBySlug,
} from './../../redux/actions/categories';

import CategoryItem from './category-item';

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
  }, []);

  return (
    <div className="category__container">
      <div className="category__container--title">
        {category && category.name}
      </div>
      <div className="category__container--body">
        {categories.map((cat) => (
          <CategoryItem
            key={cat._id}
            category={cat}
            origin="category"
            history={history}
          />
        ))}
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
