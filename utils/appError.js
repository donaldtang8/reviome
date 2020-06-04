/**
 * @class
 * @description Extended error class with a statusCode, status, and boolean property 'isOperational'
 * @param message Error message
 * @param statusCode Error statusCode
 * @this Current AppError object
 **/
class AppError extends Error {
  constructor(message, statusCode) {
    // message is the only parameter that the built-in error constructor accepts
    super(message);
    this.statusCode = statusCode;
    // errors that start with 4 - 400, 401, 403, 404 - will classify as 'fail', whereas any other errors will classify as errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // is an operational error - this way, we can differentiate it from programming errors
    // make sure we remove this constructor call from the error stack trace so that we don't pollute the stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
