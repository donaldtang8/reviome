const AppError = require('./../utils/appError');

/**
 * @function  handleCastErrorDB
 * @description Handles errors dealing with invalid values for the database
 * @return  AppError object with new error message
 **/
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * @function  handleDuplicateFieldsDb
 * @description Handles errors dealing with duplicate values for the database
 * @return  AppError object with new error message
 **/
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * @function  handleValidationErrorDB
 * @description Handles errors dealing with validation errors for the database
 * @return  AppError object with new error message
 **/
const handleValidationErrorDB = (err) => {
  // loop over error object to look at other errors
  const errors = Object.values(err.errors).map((elem) => elem.message);
  const message = `${errors.join(', ')}`;
  return new AppError(message, 400);
};

/**
 * @function  handleJWTError
 * @description Handles errors dealing with invalid tokens
 * @return  AppError object with new error message
 **/
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

/**
 * @function  handleJWTExpiredError
 * @description Handles errors dealing with expired tokens
 * @return  AppError object with new error message
 **/
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

/**
 * @function  sendErrorDev
 * @description Send error in developmental environment
 **/
const sendErrorDev = (err, req, res) => {
  // check if error being caught in the global error middleware is an "operational" error
  // operational error - trusted error that we understand
  // non-operational error - error that originates from exterior npm packages

  // if call came from API, we want to show all the error details
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // if call came from website, do not show error stack
  else {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
    });
  }
};

/**
 * @function  sendErrorProd
 * @description Send error in production environment
 **/
const sendErrorProd = (err, req, res) => {
  // if call came from API
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    // A. API - Operational error - trusted error, show error details
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B. API - Developmental error - unknown error, do not leak error details
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
  // if call came from website
  // A. Website - Operational error - trusted error, show error details
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // B. Website - Developmental error - unknown error, do not leak error details
  else {
    res.status(500).json({
      status: 'error',
      message:
        'Something went wrong, please try again or contact our support team',
    });
  }
};

/**
 * @function  Error middleware
 * @description Handles all errors that we pass and show error details. Express will automatically recognize this
 *              function as an error middleware because of the order of the params (err, req, res, next)
 **/
module.exports = (err, req, res, next) => {
  // if there is no statusCode associated with the error, by default it will be set to 500
  err.statusCode = err.statusCode || 500;
  // if there is no status associated with the error, by default it will be set to 'error'
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // if we are in the production environment, we let our helper functions create a user friendly error message before showing it to the user
  if (process.env.NODE_ENV === 'production') {
    // use sendErrorProd function for remaining functions that are not explicitly caught
    sendErrorProd(error, req, res);
  }
  // otherwise, if we are in the developmental environment, we can just show the error details as is
  else {
    sendErrorDev(error, req, res);
  }

  next();
};
