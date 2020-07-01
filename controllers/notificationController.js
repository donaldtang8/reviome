const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const Notification = require('./../models/notificationModel');
const Post = require('./../models/postModel');
const User = require('./../models/userModel');

exports.getAll = factory.getAll(Notification);
exports.getOne = factory.getOne(Notification);
exports.createOne = factory.createOne(Notification);
exports.deleteOne = factory.deleteOne(Notification);

/**
 * @helper countUnreadNotifications
 * @description Set notif property in req.body to true for factory createOne to call next()
 **/
const countUnreadNotifications = (notificationArray) => {
  let count = 0;
  for (let i = 0; i < notificationArray.length; i++) {
    if (!notificationArray[i].read) {
      count++;
    }
  }
  return count;
};

/**
 * @middleware setNotif
 * @description Set notif property in req.body to true for factory createOne to call next()
 **/
exports.setNotif = (req, res, next) => {
  req.body.notif = true;
  next();
};

/**
 * @middleware setMe
 * @description Populate id property in req.params to the user that made the request
 **/
exports.setMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 * @middleware setUserId
 * @description Populate user_from property in body to the user that made the request
 **/
exports.setUserId = (req, res, next) => {
  if (!req.body.user_from) req.body.user_from = req.user.id;
  next();
};

/**
 * @function getNotificationsByUser
 * @description Retrieve all notifications to specified user
 **/
exports.getNotificationsByUserId = catchAsync(async (req, res) => {
  // 1. Get self document for access to block list
  const self = await User.findById(req.params.id);

  // 2. Execute request without APIFeatures object to find total number of results
  const notifications = await Notification.find({
    $or: [
      {
        $and: [
          { user_to: { $eq: req.params.id } },
          { user_from: { $nin: self.block_to } },
          { user_from: { $nin: self.block_from } },
        ],
        $and: [
          { user_to: { $eq: req.params.id } },
          { user_from: { $nin: self.block_to } },
          { user_from: { $nin: self.block_from } },
          { user_from: { $in: self.following } },
          { type: { $eq: 'Post' } },
        ],
      },
    ],
  });

  // 3. Create new APIFeatures object and pass in query
  // we want to display all notifications where user_to is the user and where user_from is not blocked or is blocking user_from
  // we only want to display notifications of type 'Post' if user is following user_from
  const notificationsPaginate = new APIFeatures(
    Notification.find({
      $or: [
        {
          $and: [
            { user_to: { $eq: req.params.id } },
            { user_from: { $nin: self.block_to } },
            { user_from: { $nin: self.block_from } },
          ],
          $and: [
            { user_to: { $eq: req.params.id } },
            { user_from: { $nin: self.block_to } },
            { user_from: { $nin: self.block_from } },
            { user_from: { $in: self.following } },
            { type: { $eq: 'Post' } },
          ],
        },
      ],
    }),
    req.query
  )
    .sort()
    .paginate();

  const doc = await notificationsPaginate.query;

  let count = countUnreadNotifications(doc);

  // we need to retrieve the number of unread notifications in doc array
  res.status(200).json({
    status: 'success',
    total: notifications.length,
    results: doc.length,
    data: {
      doc,
      count: count,
    },
  });
});

/**
 * @function addPostNotification
 * @description Create a notification for followers of post creator
 **/
exports.addPostNotification = catchAsync(async (req, res) => {
  // 1. Retrieve self user object
  const self = await User.findById(req.user.id);

  // 2. Retrieve all users that are following post creator
  const followingUsers = await User.find({
    following: { $all: [req.body.doc.user] },
  });

  // 3. Map through list and create new notification object for each follower
  await Promise.all(
    followingUsers.map(async (user) => {
      await Notification.create({
        user_from: req.user.id,
        user_to: user._id,
        primary_id: req.body.doc.id,
        type: 'Post',
        message: self.fullName + ' has created a new post',
        link: `/post/${req.body.doc.id}`,
      });
    })
  );
});

/**
 * @function removePostNotification
 * @description Find notification corresponding to the post creation notification and delete it
 **/
exports.removePostNotification = catchAsync(async (req, res) => {
  // 1. Find notifications pertaining to post and delete
  await Notification.deleteMany({ primary_id: req.params.id });
});

/**
 * @function addLikeNotification
 * @description Create a notification for liking a post
 **/
exports.addLikeNotification = catchAsync(async (req, res) => {
  // 1. Only create notification for non-self-liked actions
  if (req.user.id !== req.body.doc.user.id) {
    // 2. Retrieve self user object
    const self = await User.findById(req.user.id);
    // 3. Create notification object for post creator
    await Notification.create({
      user_from: req.user.id,
      user_to: req.body.doc.user._id,
      primary_id: req.body.doc.id,
      type: 'Like',
      message: self.fullName + ' has liked your post',
      link: `/post/${req.body.doc.id}`,
    });
  }
});

/**
 * @function removelikeNotification
 * @description Find notification corresponding to the like notification and delete it
 **/
exports.removeLikeNotification = catchAsync(async (req, res) => {
  // 1. Find notification and delete
  await Notification.deleteOne({
    type: 'Like',
    user_from: req.user.id,
    primary_id: req.params.id,
  });
});

/**
 * @function addCommentNotification
 * @description Create a notification for commenting on a post
 **/
exports.addCommentNotification = catchAsync(async (req, res) => {
  // 1. Retrieve post object
  const post = await Post.findById(req.params.postId);
  // 2. If post creator commented on own post, we do not create a notification
  if (req.user.id !== post.user._id) {
    // 3. Retrieve self user object
    const self = await User.findById(req.user.id);
    // 4. Create notification object for post creator
    await Notification.create({
      user_from: req.user.id,
      user_to: post.user,
      primary_id: req.params.postId,
      secondary_id: req.body.doc.id,
      type: 'Comment',
      message: self.fullName + ' has commented on your post',
      link: `/post/${req.body.doc.id}`,
    });
  }
});

/**
 * @function removeCommentNotification
 * @description Find notification for commenting on post and delete it
 **/
exports.removeCommentNotification = catchAsync(async (req, res) => {
  // 1. Find all notifications related to comment and delete
  await Notification.deleteMany({
    primary_id: req.params.postId,
    secondary_id: req.params.id,
  });
});

/**
 * @function addCommentLikeNotification
 * @description Create a notification for commenting on a post
 **/
exports.addCommentLikeNotification = catchAsync(async (req, res) => {
  // 1. If comment creator liked own comment, do not create a notification for that
  if (req.user.id !== req.body.doc.user.id) {
    // 2. Retrieve self user object
    const self = await User.findById(req.user.id);
    // 3. Create notification object for comment creator
    await Notification.create({
      user_from: req.user.id,
      user_to: req.body.doc.user._id,
      primary_id: req.params.postId,
      secondary_id: req.body.doc.id,
      type: 'Like',
      message: self.fullName + ' has liked your comment',
      link: `/post/${req.params.id}`,
    });
  }
});

/**
 * @function removeCommentLikeNotification
 * @description Find notification corresponding to the like comment notification and delete it
 **/
exports.removeCommentLikeNotification = catchAsync(async (req, res) => {
  // 1. Find notification and delete
  await Notification.deleteOne({
    type: 'Like',
    user_from: req.user.id,
    primary_id: req.params.postId,
    secondary_id: req.params.id,
  });
});

/**
 * @function setOpen
 * @description Set open property of notification to true
 **/
exports.setOpen = catchAsync(async (req, res, next) => {
  // 1. Find notification given ID and update
  const notification = await Notification.findByIdAndUpdate(req.params.postId, {
    opened: true,
  });

  // 2. Return updated document
  res.status.json({
    status: 'success',
    data: {
      doc: notification,
    },
  });
});

/**
 * @function setRead
 * @description Set read property of notification to true
 **/
exports.setRead = catchAsync(async (req, res, next) => {
  // 1. Find notification given ID and update
  const notification = await Notification.findByIdAndUpdate(req.params.id, {
    read: true,
  });

  // 2. Return updated document
  res.status.json({
    status: 'success',
    data: {
      doc: notification,
    },
  });
});
