import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { setGenre } from './../../redux/actions/categories';

const CategoryItem = ({ setGenre, category, history, origin }) => {
  let { url } = useRouteMatch();

  const handleClick = (e) => {
    e.preventDefault();
    if (category.genre) {
      setGenre(category.slug);
    }
    if (origin) {
      // category item located in specific category page
      if (origin === 'category') {
        history.push(`${url}/${category.name}`);
      }
    } else {
      history.push(`${url}/${category.slug}`);
    }
  };

  return (
    <div className="category__item" onClick={handleClick}>
      <div className="category__item--title">{category.name}</div>
    </div>
  );
};

CategoryItem.propTypes = {
  setGenre: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  origin: PropTypes.string,
};

export default connect(null, { setGenre })(CategoryItem);
