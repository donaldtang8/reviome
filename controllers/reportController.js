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

/**
 * @middlewawre setMe
 * @description Set user_from property of report to user that made request
 **/
exports.setMe = (req, res, next) => {
  req.body.user_from = req.user.id;
  next();
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
  // 1. Find report given ID and update
  const report = await Report.findByIdAndUpdate(req.params.id, {
    statusMessage: req.body.statusMessage,
    status: 'closed',
    resolvedAt: Date.now(),
  });

  // 2. Return updated document
  res.status(200).json({
    status: 'success',
    data: {
      doc: report,
    },
  });
});
