const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const Report = require('./../models/reportModel');
const Comment = require('./../models/commentModel');
const Post = require('./../models/postModel');
const User = require('./../models/userModel');

exports.getAll = factory.getAll(Report);
exports.getOne = factory.getOne(Report);
exports.createOne = factory.createOne(Report);
exports.deleteOne = factory.deleteOne(Report);

/* MIDDLEWARES */

/**
 * @middlewawre setMe
 * @description Set user_from property of report to user that made request
 **/
exports.setMe = (req, res, next) => {
  req.body.user_from = req.user.id;
  next();
};

/**
 * @middlewawre checkDuplicate
 * @description Check to see if there already exist a duplicate report
 **/
exports.checkDuplicate = catchAsync(async (req, res, next) => {
  const report = await Report.findOne({
    user_from: req.body.user_from,
    user_to: req.body.user_to,
    item_id: req.body.item_id,
    item_type: req.body.item_type,
  });

  if (report) {
    return next(new AppError('Report has already been sent', 400));
  }

  next();
});

/**
 * @middlewawre validateReport
 * @description Validate report fields to make sure report is valid
 **/
exports.validateReport = catchAsync(async (req, res, next) => {
  // 1. First, we want to validate the user fields to ensure that the user exists
  if (req.body.item_type === 'User') {
    const user = await User.findById(req.body.item_id);
    if (!user) {
      return next(new AppError('Please provide a valid user', 400));
    }
  } else if (req.body.item_type === 'Comment') {
    const comment = await Comment.findById(req.body.item_id);
    if (!comment) {
      return next(new AppError('Please provide a valid comment', 400));
    }
  } else if (req.body.item_type === 'Post') {
    const post = await Post.findById(req.body.item_id);
    if (!post) {
      return next(new AppError('Please provide a valid post', 400));
    }
  }

  next();
});

/**
 * @function  filterObj
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
 * @function setStatus
 * @description Set resolved property of report to true
 **/
exports.setStatus = catchAsync(async (req, res, next) => {
  // 1. Find report given ID and update
  const report = await Report.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });

  // 2. Return updated document
  res.status.json({
    status: 'success',
    data: {
      doc: report,
    },
  });
});

/**
 * @function resolveReport
 * @description Update and resolve report
 **/
exports.resolveReport = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'status', 'action', 'statusMessage');
  // 1. Find report given ID and update
  const report = await Report.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!report) {
    return next(new AppError('No document found with that ID', 400));
  }

  // 2. Return updated document
  res.status(200).json({
    status: 'success',
    data: {
      doc: report,
    },
  });
});
