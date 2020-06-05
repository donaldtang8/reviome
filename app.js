const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();

/* UTILITY IMPORTS */
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController');

/* ROUTE IMPORTS*/
const categoryRouter = require('./routes/categoryRoutes');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

/* GLOBAL MIDDLEWARES */

// set security HTTP headers
app.use(helmet());

// rate limiting - 100 requests per hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 50 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// body parser - reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// cookie parser
app.use(cookieParser());

// data sanitization - protect against NoSQL query injection
app.use(mongoSanitize());

// data sanitization - protect against XSS attacks
app.use(xss());

// prevent porameter population - if url contains ?sort=duration&sort-price , hpp() will set it such that it will sort by the last parameter
app.use(
  hpp({
    // whitelist is an array of parameters that we allow duplicates of
    whitelist: [],
  })
);

/* TEST MIDDLEWARE */
app.use((req, res, next) => {
  next();
});

/* ROUTES */
app.use('/api/categories', categoryRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// for any routes that we have not caught
app.all('*', (req, res, next) => {
  // use error middleware to handle error
  // if next function receives an error argument, express will automatically know it has received an error
  // it will then skip all other middlewares in the stack and go straight to the error middleware
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

/* ERROR HANDLING*/
app.use(globalErrorHandler);

module.exports = app;
