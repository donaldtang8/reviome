import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [nav, setNav] = useState('feed');

  const handleClick = (e, item) => {
    e.preventDefault();
    setNav(item);
  };

  return (
    <div className="sidebar__container">
      <div className="sidebar__nav">
        <Link to="/" onClick={() => setNav('feed')}>
          <div
            className={
              nav === 'feed'
                ? 'sidebar__nav--item sidebar__nav--selected'
                : 'sidebar__nav--item'
            }
          >
            Feed
          </div>
        </Link>
        <Link to="/explore" onClick={() => setNav('explore')}>
          <div
            className={
              nav === 'explore'
                ? 'sidebar__nav--item sidebar__nav--selected'
                : 'sidebar__nav--item'
            }
          >
            Explore
          </div>
        </Link>
        <Link to="/favorites" onClick={() => setNav('favorites')}>
          <div
            className={
              nav === 'favorites'
                ? 'sidebar__nav--item sidebar__nav--selected'
                : 'sidebar__nav--item'
            }
          >
            Favorites
          </div>
        </Link>
      </div>
      <div className="sidebar__toggle">Collapse</div>
    </div>
  );
};

export default Sidebar;
