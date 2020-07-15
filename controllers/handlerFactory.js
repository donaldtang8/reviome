const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

/**
 * @function  createOne
 * @description Creates a new document of the provided schema
 **/
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.create(req.body);

    let popDoc = await Model.findById(doc._id).populate({
      path: 'user',
      select: '-__v -passwordChangedAt',
    });

    req.body.doc = popDoc;

    res.status(201).json({
      status: 'success',
      data: {
        doc: popDoc,
      },
    });

    if (req.body.notif) {
      next();
    }
  });

/**
 * @function  getAll
 * @description Read all documents of the provided schema
 **/
exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // for searching reviews based on postId
    let filter = {};
    if (req.params.postId) filter = { post: req.params.postId };
    let query = Model.find();
    if (popOptions) query = query.populate(popOptions);

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });

/**
 * @function  createOne
 * @description Creates a new document of the provided schema
 **/
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

/**
 * @function  updateOne
 * @description Update document of the provided schema
 **/
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

/**
 * @function  deleteOne
 * @description Delete document of the provided schema
 **/
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });

    if (req.body.notif) {
      next();
    }
  });
