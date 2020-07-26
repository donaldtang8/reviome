import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const SplashHeader = () => {
  return (
    <header className="splash__header">
      <div className="splash__navbar">
        <Link to="/" className="splash__navbar--brand">
          <div className="logo">REVIO</div>
        </Link>
        <ul className="splash__navbar--nav">
          <Link to="/login" className="splash__navbar--nav-item">
            <li>Login</li>
          </Link>
          <Link to="/register" className="splash__navbar--nav-item">
            <li>Register</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default SplashHeader;
