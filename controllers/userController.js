const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const User = require('./../models/userModel');

exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

/**
 * @helper  filterObj
 * @param obj The object that we will filter
 * @param allowedFields A list of fields that will be allowed in object
 * @description Utility function used to filter out req.body object and only keep fields we allow
 **/
const filterObj = (obj, ...allowedFields) => {
  // new object will contain the new object with all the allowed fields
  const newObj = {};
  // loop through each key in object and check if they are allowed
  Object.keys(obj).forEach((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem];
  });
  // return new object
  return newObj;
};

/**
 * @middleware  getMe
 * @description Get own user's user document
 **/
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 * @middleware  setMe
 * @description Set user property on request body to user's id
 **/
exports.setMe = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

/**
 * @function  getUserById
 * @description Retrieve user document given ID
 **/
exports.getUserById = catchAsync(async (req, res, next) => {
  let doc = await User.findById(req.params.id);

  if (!doc || !doc.active) {
    return next(new AppError('No account found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

/**
 * @function  getUserByUsername
 * @description Retrieve user document given username
 **/
exports.getUserByUsername = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    uName: req.params.username
  });

  if (!user || !user.active) {
    return next(new AppError('No account found with that username', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc: user,
    },
  });
});

/**
 * @function  updateMe
 * @description Update own user's user document
 **/
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Check that req.body does not contain any password properties
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Please use update password route for any changes to password',
        400
      )
    );
  }
  // 2. Convert object names to schema names
  let convertBody = {};
  if (req.body.firstName) convertBody.fName = req.body.firstName;
  if (req.body.lastName) convertBody.lName = req.body.lastName;
  if (req.body.username) convertBody.uName = req.body.username;
  // FRONT END IMAGE UPLOAD
  if (req.body.photo) convertBody.photo = req.body.photo;

  // 3. Filter out req.body to make sure user does not update properties that are not allowed
  const filteredBody = filterObj(
    convertBody,
    'fName',
    'lName',
    'uName',
    'email',
    'photo'
  );

  // FRONT END IMAGE UPLOAD
  // if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      doc: updatedUser,
    },
  });
});

/**
 * @function  deleteMe
 * @description Set user to inactive
 **/
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * @function  updateSocials
 * @description Update social links
 **/
exports.updateSocials = catchAsync(async (req, res, next) => {
  // 1. Create new social object
  let social = {
    links: {
      youtube: null,
      instagram: null,
      soundcloud: null,
      spotify: null,
      twitch: null,
    },
  };

  // 2. Populate social object with values from request body
  if (req.body.youtube) social.links.youtube = req.body.youtube;
  if (req.body.instagram) social.links.instagram = req.body.instagram;
  if (req.body.soundcloud) social.links.soundcloud = req.body.soundcloud;
  if (req.body.spotify) social.links.spotify = req.body.spotify;
  if (req.body.twitch) social.links.twitch = req.body.twitch;

  // 3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, social, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      doc: updatedUser,
    },
  });
});

/**
 * @function  getUserFollowingList
 * @description Given the id of a user, retrieve the list of users that the user follows
 **/
exports.getUserFollowingList = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('following');

  if (!user) {
    return next(new AppError('No account found with that username', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc: user.following,
    },
  });
});

/**
 * @function  followUserById
 * @description Follow user by id
 **/
exports.followUserById = catchAsync(async (req, res, next) => {
  // 1. Check if user params is user itself
  if (req.user.id === req.params.id) {
    return next(new AppError('Already following user', 400));
  }

  // 2. Retrieve self user object
  let self = await User.findById(req.user.id);

  if (self.isFollowingUser(req.params.id)) {
    return next(new AppError('Already following user', 400));
  }

  // 3. Retrieve user from given id and update follower count
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No account found with that ID', 404));
  }

  // 4. Check if user who made request is blocking user to be followed
  if (self.isBlockingUser(req.params.id)) {
    return next(new AppError('Please unblock user to follow', 400));
  }

  // 5. Check if user to follow is blocking user who made request
  if (user.isBlockingUser(req.user.id)) {
    return next(new AppError('Cannot follow user', 400));
  }

  // 6. Find user from given id and update follower count
  user = await User.findByIdAndUpdate(req.params.id, {
    $inc: {
      followers: 1
    },
  });

  // 7. Add followed user to self's following list
  self.following.push(req.params.id);
  await self.save({
    validateBeforeSave: false
  });

  res.status(200).json({
    status: 'success',
    data: {
      following: self.following,
      followers: user.followers,
    },
  });
});

/**
 * @function  unfollowUserById
 * @description Unfollow user by id
 **/
exports.unfollowUserById = catchAsync(async (req, res, next) => {
  // 1. Check if user params is user itself
  if (req.user.id === req.params.id) {
    return next(new AppError('Not following user', 400));
  }

  // 2. Retrieve self user object
  let self = await User.findById(req.user.id);

  if (!self.isFollowingUser(req.params.id)) {
    return next(new AppError('Not following user', 400));
  }

  // 2. Find user from given id and update follower count
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No account found with that ID', 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, {
    $inc: {
      followers: -1
    },
  });

  // 3. Remove followed user from self's following list
  self = await User.findByIdAndUpdate(
    req.user.id, {
      $pull: {
        following: req.params.id
      },
    }, {
      new: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      following: self.following,
      followers: user.followers,
    },
  });
});

/**
 * @function  blockUserById
 * @description Block user given id and add to block list
 **/
exports.blockUserById = catchAsync(async (req, res, next) => {
  // 1. Retrieve user by id
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No account found with that ID', 404));
  }

  // 2. Retrieve self user object
  let self = await User.findById(req.user.id);

  // 3. Check if user is already blocked, if so, we throw an error
  if (self.isBlockingUser(req.params.id)) {
    return next(new AppError('Already blocking user', 400));
  }

  // 4. If user who made request is following user to be blocked, remove user who made request from following list and decrement follower count from user to be blocked
  if (self.isFollowingUser(req.params.id)) {
    self = await User.findByIdAndUpdate(
      req.user.id, {
        $pull: {
          following: req.params.id
        },
      }, {
        new: true
      }
    );

    await User.findByIdAndUpdate(
      req.params.id, {
        $inc: {
          followers: -1
        },
      }, {
        new: true
      }
    );
  }

  // 5. If user to be blocked is following user who made request, remove user to be blocked from following list and decrement follower count from user who made request
  if (user.isFollowingUser(req.user.id)) {
    user = await User.findByIdAndUpdate(
      req.params.id, {
        $pull: {
          following: req.user.id
        },
      }, {
        new: true
      }
    );

    await User.findByIdAndUpdate(
      req.user.id, {
        $inc: {
          followers: -1
        },
      }, {
        new: true
      }
    );
  }

  // 6. Add user to self user object's block_to list
  self.block_to.push(req.params.id);
  await self.save({
    validateBeforeSave: false
  });

  // 7. Add self to user object's block_from list
  user.block_from.push(req.user.id);
  await user.save({
    validateBeforeSave: false
  });

  res.status(200).json({
    status: 'success',
    data: {
      doc: self.block_to,
      selfFollowing: self.following,
      userFollowing: user.following,
    },
  });
});

/**
 * @function  unblockUserById
 * @description Unblock user given id and remove from block list
 **/
exports.unblockUserById = catchAsync(async (req, res, next) => {
  // 1. Retrieve user by ID
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('No account found with that ID', 404));
  }

  // 2. Check to see if we are already blocking user
  let self = await User.findById(req.user.id);
  if (!self.isBlockingUser(req.params.id)) {
    return next(new AppError('Not blocking user', 400));
  }

  // 3. Remove followed user from self's following list
  self = await User.findByIdAndUpdate(
    req.user.id, {
      $pull: {
        block_to: req.params.id
      },
    }, {
      new: true
    }
  );

  await User.findByIdAndUpdate(
    req.params.id, {
      $pull: {
        block_from: req.user.id
      },
    }, {
      new: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      doc: self.block_to,
      selfFollowing: self.following,
      userFollowing: user.following,
    },
  });
});

/**
 * @function  banUserById
 * @description Ban user given id and time length
 **/
exports.banUserById = catchAsync(async (req, res, next) => {
  // 1. Retrieve user by ID
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No account found with that ID', 404));
  }

  // 2. Check to see if user is already banned
  if (user.banExpires) {
    return next(new AppError('User is already banned', 400));
  }

  // 3. Calculate and create ban expires time object
  // if no time properties are provided, throw error
  if (!req.body.days && !req.body.hours) {
    return next(new AppError('Time properties must be provided', 400));
  }
  // if there is a days property provided, we use that
  // ex. if no days provided
  let days = req.body.days ? req.body.days : 0;
  // if there is an hours property provided, we use that
  let hours = req.body.hours ? req.body.hours : 0;

  let banExpiresDate = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000
  );

  // 3. Set banExpires property
  user = await User.findByIdAndUpdate(
    req.params.id, {
      banExpires: banExpiresDate,
      active: false,
    }, {
      new: true
    }
  );

  res.clearCookie('jwt');

  res.status(200).json({
    status: 'success',
  });
});

/**
 * @function  unbanUserById
 * @description Unban user
 **/
exports.unbanUserById = catchAsync(async (req, res, next) => {
  // 1. Retrieve user by ID
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No account found with that ID', 404));
  }

  // 2. Check to see if user is already banned
  if (!user.banExpires) {
    return next(new AppError('User is not banned', 400));
  }

  // 3. Set banExpires property
  user = await User.findByIdAndUpdate(
    req.params.id, {
      banExpires: undefined,
      active: true,
    }, {
      new: true
    }
  );

  res.status(200).json({
    status: 'success',
  });
});