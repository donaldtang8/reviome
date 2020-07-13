import React, { Component } from 'react';

// this component will be rendered if any of the children components throw an error so that the UI does not display the default react error page,
// and rather a custom error page
class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = {
      hasErrored: false,
      error: null,
      info: null,
    };
  }

  // catches all errors thrown in children components and passes error to function
  static getDerivedStateFromError(error) {
    // process the error
    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      info: info,
    });
  }

  render() {
    if (this.state.hasErrored) {
      return (
        <div className="error-boundary">
          <img
            className="error-boundary__image"
            src="https://i.imgur.com/Q2BAOd2.png"
          />
          <div className="error-boundary__text">Something went wrong</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
