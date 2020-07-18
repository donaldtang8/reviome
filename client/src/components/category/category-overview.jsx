import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import CategoryItem from './category-item';

import sprite from '../../assets/sprite.svg';

const CategoryOverview = ({
  categories: { categories },
  category,
  match,
  history,
}) => {
  return (
    <div className="category-overview__container">
      {match.params.category && (
        <div className="btn__icon" onClick={() => history.goBack()}>
          <svg className="btn__icon--svg">
            <use xlinkHref={`${sprite}#icon-back`}></use>
          </svg>
        </div>
      )}

      <div className="heading-1 padding-small">
        <Link to={`/explore/${category.name}`}>{category.name}</Link>
      </div>
      <div className="category-overview__container--body">
        {categories.map(
          (cat) =>
            cat.parent &&
            cat.parent.name === category.name && (
              <CategoryItem key={cat._id} category={cat} history={history} />
            )
        )}
      </div>
    </div>
  );
};

CategoryOverview.propTypes = {
  category: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, {})(withRouter(CategoryOverview));
