import React from 'react';

import SplashHeader from './splash-header';
import SplashJumbotron from './splash-jumbotron';
import SplashStory from './splash-story';
import SplashFeatures from './splash-features';
import SplashFooter from './splash-footer';

const Splash = () => {
  return (
    <div className="splash__container">
      <div className="splash__main">
        <SplashHeader />
        <SplashJumbotron />
      </div>
      <SplashStory />
      <SplashFeatures />
      <SplashFooter />
    </div>
  );
};

export default Splash;
