import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllCategories } from './../../redux/actions/categories';

import CategoryItem from './category-item';

const Categories = ({
  getAllCategories,
  categories: { categories },
  match,
  history,
}) => {
  useEffect(() => {
    getAllCategories();
  }, [match.url, match.params.category]);

  return (
    <div className="large__container">
      <Link
        className="categories__header input__btn"
        to={'/manage/categories/create'}
      >
        Create Category
      </Link>
      <div className="categories__container">
        {categories.map(
          (category, index) =>
            !category.parent && (
              <div
                key={category._id}
                className="categories__container--overview"
              >
                <div className="heading-1 padding-small">{category.name}</div>
                <div className="category-overview__container--body">
                  {categories.map(
                    (subcat) =>
                      subcat.parent &&
                      subcat.parent._id === category._id && (
                        <Link
                          key={subcat._id}
                          to={`/manage/category/${subcat._id}`}
                          className="category__item"
                        >
                          <div className="category__item--title">
                            {subcat.name}
                          </div>
                        </Link>
                      )
                  )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

Categories.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, {
  getAllCategories,
})(Categories);
