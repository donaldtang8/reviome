const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const factory = require('./handlerFactory');
const Category = require('./../models/categoryModel');

// exports.getAll = factory.getAll(Category);
exports.getOne = factory.getOne(Category);
exports.createOne = factory.createOne(Category);

// MIDDLEWARE
/**
 * @middleware  getAncestorsAndParent
 * @description Automatically update req.body and set parents and ancestors of category based on parentString
 **/
exports.getAncestorsAndParent = catchAsync(async (req, res, next) => {
  if (req.body.parentString) {
    // 1. Get parent category
    const category = await Category.findOne({
      name: req.body.parentString,
      genre: false,
    });
    // 2. Add all ancestors of parent to current ancestor list
    let ancestors = category.ancestors;
    // 2. Add parent to ancestors
    ancestors.push(category._id);
    // 3. Set ancestor array in request body
    req.body.ancestors = ancestors;

    // 4. Set parent to parent id
    req.body.parent = category._id;
  }
  next();
});

/**
 * @function  getOne
 * @description Queries and finds category with given ID
 **/
exports.getAll = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      doc: categories,
    },
  });
});

/**
 * @function  getOneById
 * @description Queries and finds category with given ID
 **/
exports.getOneById = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID
  const category = await Category.findById(req.params.id);
  // 2. Throw error if no category found
  if (!category)
    return next(new AppError('There is no document with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      doc: category,
    },
  });
});

/**
 * @function  getOneBySlug
 * @description Queries and finds category with given slug
 **/
exports.getOneBySlug = catchAsync(async (req, res, next) => {
  // 1. Find category with given slug
  const category = await Category.findOne({ slug: req.params.slug });
  // 2. Throw error if no category found
  if (!category)
    return next(new AppError('There is no document with that slug', 404));

  res.status(200).json({
    status: 'success',
    data: {
      doc: category,
    },
  });
});

/**
 * @function  getTopCategories
 * @description Retrieves all top level categories
 **/
exports.getTopCategories = catchAsync(async (req, res, next) => {
  // 1. Find all categories where 'parent' is null
  const categories = await Category.find({ parent: null });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      doc: categories,
    },
  });
});

/**
 * @function  getSubcategoriesById
 * @description Queries and finds subcategories with given ID
 **/
exports.getSubcategoriesById = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('There is no category with that ID', 400));
  }

  // 2. Find all categories with parent as 'category'
  const subcategories = await Category.find({ parent: category });

  res.status(200).json({
    status: 'success',
    results: subcategories.length,
    data: {
      doc: subcategories,
    },
  });
});

/**
 * @function  getSubcategoriesBySlug
 * @description Queries and finds subcategories with given slug
 **/
exports.getSubcategoriesBySlug = catchAsync(async (req, res, next) => {
  // Build slug string
  let slugString = req.params['slug'];
  if (req.params[0]) slugString += req.params[0];

  // 1. Find category with given ID
  const category = await Category.findOne({ slug: slugString });

  if (!category) {
    return next(new AppError('There is no category with that slug', 400));
  }

  // 2. Find all categories with parent as 'category'
  const subcategories = await Category.find({ parent: category });

  res.status(200).json({
    status: 'success',
    results: subcategories.length,
    data: {
      doc: subcategories,
    },
  });
});
