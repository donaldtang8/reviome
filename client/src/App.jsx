import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="body__container">
          <div className="main__container">
            <div className="content__container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
