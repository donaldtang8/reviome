import React from 'react';

import img1 from './../../assets/img/splash/gallery-1.jpg';
import img2 from './../../assets/img/splash/gallery-2.jpg';
import img3 from './../../assets/img/splash/gallery-3.jpg';

const SplashStory = () => {
  return (
    <div className="splash__story">
      <div className="splash__story--pictures">
        <figure className="splash__story--pictures-item splash__story--pictures-item-1">
          <img src={img1} alt="Pic 1" className="splash__story--pictures-img" />
        </figure>
        <figure className="splash__story--pictures-item splash__story--pictures-item-2">
          <img src={img2} alt="Pic 2" className="splash__story--pictures-img" />
        </figure>
        <figure className="splash__story--pictures-item splash__story--pictures-item-3">
          <img src={img3} alt="Pic 3" className="splash__story--pictures-img" />
        </figure>
      </div>
      <div className="splash__story--content">
        <h3 className="heading-3">
          A Note To Creators Looking for a Place to Call Home
        </h3>
        <h2 className="heading-2">
          &ldquo;The best community for digital creators&rdquo;
        </h2>
        <p className="splash__story--text">
          Whether you love recording videos, writing novels, to producing songs,
          theres a space in this community for you. Share and promote your work
          to others, leave feedback for others to motivate them, and explore new
          ideas.
        </p>
      </div>
    </div>
  );
};

export default SplashStory;
