const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const Comment = require('./../models/commentModel');
const Post = require('./../models/postModel');

exports.getAll = factory.getAll(Comment);
exports.getOne = factory.getOne(Comment);

// MIDDLEWARE
/**
 * @middleware  setPostAndUserId
 * @description Set post and user property on request body
 **/
exports.setPostAndUserId = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * @function  createOne
 * @description Create comment
 **/
exports.createOne = catchAsync(async (req, res, next) => {
  // 1. Find comment by id and delete
  await Comment.create(req.body);

  // 2. Find post given id, populate with comments, and return as response
  const post = await Post.findById(req.params.postId).populate('comments');

  res.status(200).json({
    status: 'success',
    total: post.comments.length,
    results: post.comments.length,
    data: {
      doc: post.comments,
    },
  });
});

/**
 * @function  deleteOne
 * @description Delete comment
 **/
exports.deleteOne = catchAsync(async (req, res, next) => {
  // 1. Find comment by id and delete
  await Comment.findByIdAndDelete(req.params.id);

  // 2. Find post given id, populate with comments, and return as response
  const post = await Post.findById(req.params.postId).populate('comments');

  res.status(200).json({
    status: 'success',
    total: post.comments.length,
    results: post.comments.length,
    data: {
      doc: post.comments,
    },
  });
});

/**
 * @function  likeCommentById
 * @description Like comment
 **/
exports.likeCommentById = catchAsync(async (req, res, next) => {
  // 1. Retrieve comment from id
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No document found with that ID', 404));
  }

  // NOTIFICATION - set doc in req.body so notification can access
  req.body.doc = comment;

  // 2. Check if comment is liked
  if (comment.likedComment(req.user.id)) {
    return next(new AppError('Already liked comment', 400));
  }

  // 3. Add user to likes array and update like count
  const newComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { likeCount: 1 },
      $push: { likes: req.user.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      doc: newComment,
      likes: newComment.likes,
    },
  });
  next();
});

/**
 * @function  unlikeCommentById
 * @description UnLike comment
 **/
exports.unlikeCommentById = catchAsync(async (req, res, next) => {
  // 1. Retrieve comment from id
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No document found with that ID', 404));
  }

  // 2. Check if post is liked
  if (!comment.likedComment(req.user.id)) {
    return next(new AppError('Comment has not been liked yet', 400));
  }

  // 3. Decrement like count
  const newComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { likeCount: -1 },
      $pull: { likes: req.user.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      doc: newComment,
      likes: newComment.likes,
    },
  });
  next();
});
