import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const SplashFooter = () => {
  return (
    <footer className="splash__footer">
      <div className="splash__footer--menu">
        <div className="splash__footer--menu-item">
          <div className="splash__footer--title">Contact Us</div>
          <div className="splash__footer--text">Phone Number: xxx-xxx-xxxx</div>
          <div className="splash__footer--text">Email: turazinyc@gmail.com</div>
        </div>
        <div className="splash__footer--menu-item">
          <div className="splash__footer--title">News</div>
          <div className="splash__footer--text splash__footer--description">
            New features coming soon. Stay posted!
          </div>
        </div>
      </div>

      <div className="splash__footer--copyright">
        &copy; Copyright 2020 by Donald Tang
      </div>
    </footer>
  );
};

export default SplashFooter;
