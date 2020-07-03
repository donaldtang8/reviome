import React from 'react';

const Error = () => {
  return (
    <div className="error__container">
      <img
        className="error__container--image"
        src="https://i.imgur.com/Q2BAOd2.png"
      />
      <div className="error__container--text">404 - Page Not Found</div>
    </div>
  );
};

export default Error;
