import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import CategoryItem from './category-item';

const CategoryOverview = ({
  categories: { categories },
  category,
  history,
}) => {
  return (
    <div className="category-overview__container">
      <div className="category-overview__container--title">
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

export default connect(mapStateToProps, {})(CategoryOverview);
