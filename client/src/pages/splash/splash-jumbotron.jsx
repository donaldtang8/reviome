import React from 'react';
import { Link } from 'react-router-dom';

const SplashJumbotron = () => {
  return (
    <div className="splash__jumbotron">
      <div className="splash-heading-1">A haven for digital creators.</div>
      <Link to="/register">
        <div className="splash__btn">Get Started</div>
      </Link>
    </div>
  );
};

export default SplashJumbotron;
