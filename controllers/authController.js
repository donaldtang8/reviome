const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');

const User = require('../models/userModel');

/**
 * @middleware  protect
 * @description Checks that request is being made from authenticated user
 **/
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not authorized to access this page', 401)
    );
  }

  // 2. Decode token and check that user exists
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );

  // 3. Check to see if user is banned
  if (user.banExpires)
    return next(new AppError('This account has been suspended', 401));

  // 4. Check if user changed password after token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // grant access to protected route
  req.user = user;
  next();
});

/**
 * @middleware  restrictTo
 * @description Restricts route to certain roles
 **/
exports.restrictTo = (...roles) => {
  // '...roles' is an array of roles that will define what roles can access the route - ex. ['admin', 'lead-guide']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

/**
 * @middleware  restrictToMe
 * @description Restricts route to owner of document
 **/
exports.restrictToMe = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (req.user.id !== doc.user._id.toString()) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    } else {
      next();
    }
  });

/**
 * @helper  signToken
 * @description Signs JWT token with expires options
 * @param id  Accepts userId as parameter
 * @return  Returns signed JWT token
 **/
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * @helper  createSendToken
 * @description Creates and sends JWT token
 * @param user  User object of the owner of token
 * @param statusCode Response status code
 * @param res Response object
 **/
const createSendToken = (user, statusCode, res) => {
  // sign token with user id
  const token = signToken(user._id);
  // define cookie options with expires time and httpOnly option
  let days = 7;
  const cookieOptions = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // in development mode, http is used, so we do not use the secure option in development mode, only in production mode
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // return jwt in cookie
  res.cookie('jwt', token, cookieOptions);
  // remove password from output
  user.pass = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user,
    },
  });
};

/**
 * @function  signup
 * @description Signup user
 **/
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    fName: req.body.firstName,
    lName: req.body.lastName,
    uName: req.body.username,
    email: req.body.email,
    pass: req.body.password,
    passConfirm: req.body.passwordConfirm,
  });
  const URL = `${req.protocol}://${req.headers['x-forwarded-host']}/login`;
  await new Email(newUser, URL).sendWelcome();
  createSendToken(newUser, 201, res);
});

/**
 * @function  login
 * @description Login user
 **/
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. check if email and passsword exist in request body
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }
  // 2. Find user associated with email
  const user = await User.findOne({ email: email }).select('+pass');
  if (!user) return next(new AppError('Incorrect email or password', 401));
  // 3. Check if user is banned
  if (user.banExpires)
    return next(
      new AppError(
        'This account has been suspended until ' +
          user.banExpires.toLocaleDateString(),
        401
      )
    );
  // 4. Check if password is correct
  // call the instance method "correctPassword" to check if password is correct
  const correct = await user.correctPassword(password, user.pass);
  if (!correct) return next(new AppError('Incorrect email or password', 401));

  // 5. If correct, send token to client
  createSendToken(user, 200, res);
});

/**
 * @function  logout
 * @description Logout user
 **/
exports.logout = (req, res) => {
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};

/**
 * @function  forgotPassword
 * @description Sends forgot password email to email associated with account
 **/
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({
      status: 'success',
      message:
        'If there was an email associated with the account, a reset password email has been sent',
    });
  }
  // 2. Generate random reset password Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.headers['x-forwarded-host']}/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message:
        'If there was an email associated with the account, a reset password email has been sent',
    });
  } catch (err) {
    user.passResetToken = undefined;
    user.passResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Please try again later!',
        500
      )
    );
  }
});

/**
 * @function  resetPassword
 * @description Resets password using password reset token
 **/
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get token from params
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2. Find a user with that reset token and valid password expires at
  const user = await User.findOne({
    passResetToken: hashedToken,
    passResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('There is no user associated with this token', 400)
    );
  }

  // 3. Check that passwords are equal
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Both password fields must match!', 400));
  }

  // 4. Set new password and reset password token and token expires at
  user.pass = req.body.password;
  user.passConfirm = req.body.passwordConfirm;
  user.passResetToken = undefined;
  user.passResetExpires = undefined;
  await user.save();

  // 5. Update passwordChangedAt
  // we automatically do this in the user model now

  // 6. Send JWT Token
  createSendToken(user, 200, res);
});

/**
 * @function  updatePassword
 * @description Updates user's password
 **/
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from request object
  const user = await User.findById(req.user.id).select('+pass');

  // 2. Check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.pass))) {
    return next(new AppError('Your current password is incorrect', 400));
  }

  // 3. If password is correct, check that passwords
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Both password fields must match!', 400));
  }

  // 4. Check that password is not equal to old password
  if (await user.correctPassword(req.body.password, user.pass)) {
    return next(new AppError('Please use a different password', 400));
  }
  user.pass = req.body.password;
  user.passConfirm = req.body.passwordConfirm;
  await user.save();

  // 4. Send JWT Token
  createSendToken(user, 200, res);
});
