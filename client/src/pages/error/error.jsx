import React from 'react';
import { Link } from 'react-router-dom';
import image from './../../assets/img/error/oCkEbrA.png';

const Error = () => {
  return (
    <div className="error__container">
      <img className="error__container--image" src={image} alt="Error" />
      <div className="error__container--text">
        <div className="error__container--title">404</div>
        <div className="font-large bold">This page got lost in the wind.</div>
        <div className="heading-3">
          We can't find the page you're looking for...
        </div>
        <Link
          to="/"
          className="btn__action btn__action--active uppercase padding-small margin-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
