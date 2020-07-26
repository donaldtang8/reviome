import React from 'react';

import sprite from './../../assets/sprite.svg';

const SplashFeatures = () => {
  return (
    <div className="splash__features">
      <div className="splash__features--list">
        <div className="splash__feature">
          <svg className="splash__feature--icon">
            <use xlinkHref={`${sprite}#icon-flash`}></use>
          </svg>
          <div className="splash__feature--title">Promote your work</div>
          <div className="splash__feature--detail">
            Post your content for others to view, share, and critique. Increase
            exposure to your content, and gain feedback from other creators.
          </div>
        </div>
        <div className="splash__feature">
          <svg className="splash__feature--icon">
            <use xlinkHref={`${sprite}#icon-rocket`}></use>
          </svg>
          <div className="splash__feature--title">Explore New Creators</div>
          <div className="splash__feature--detail">
            Whether you're a creator seeking inspiration for a specific niche or
            an enthusiast looking to explore new content, our broad array of
            niches will keep you covered.
          </div>
        </div>
        <div className="splash__feature">
          <svg className="splash__feature--icon">
            <use xlinkHref={`${sprite}#icon-heart`}></use>
          </svg>
          <div className="splash__feature--title">Grow your Community</div>
          <div className="splash__feature--detail">
            Create a coalition of supporters, build a community and create your
            brand.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashFeatures;
