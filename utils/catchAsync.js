/**
 * @function  fn
 * @description Wrapper function that wraps our controller functions to catch any errors
 * @return  Returns an anonymous function that catches any errors and passes the error in our error handling middleware
 **/
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
