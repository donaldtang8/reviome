const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const factory = require('./handlerFactory');
const Category = require('./../models/categoryModel');
const User = require('./../models/userModel');

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
 * @function  incrementPostCount
 * @description Increment the post count for category
 **/
exports.incrementPostCount = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID and update
  await Category.findByIdAndUpdate(req.body.category, {
    $inc: { num_posts: 1 },
  });

  next();
});

/**
 * @function  decrementPostCount
 * @description Decrement the post count for category
 **/
exports.decrementPostCount = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID and update
  await Category.findByIdAndUpdate(req.body.category, {
    $inc: { num_posts: -1 },
  });

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
  const category = await Category.findOne({ slug: req.body.slug });
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

/**
 * @function  followCategoryById
 * @description Add category to user's categories list and increment category follower account
 **/
exports.followCategoryById = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('There is no category with that ID', 400));
  }

  // 2. Make sure category is a genre
  if (!category.genre) {
    return next(new AppError('Can only follow genres', 400));
  }

  // 2. Retrieve self user object
  const self = await User.findById(req.user.id);

  // 3. Check if user is already following category
  if (self.isFollowingCategory(req.params.id)) {
    return next(new AppError('Already following category', 400));
  }

  // 4. Update category follower count
  category = await Category.findByIdAndUpdate(req.params.id, {
    $inc: { followers: 1 },
  });

  // 5. Add category to user's category list
  self.categories_following.push(req.params.id);
  await self.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      doc: self.categories_following,
    },
  });
});

/**
 * @function  unfollowCategoryById
 * @description Remove category from user's categories list and decrement category follower account
 **/
exports.unfollowCategoryById = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('There is no category with that ID', 400));
  }

  // 2. Retrieve self user object
  let self = await User.findById(req.user.id);

  // 3. Check if user is following category
  if (!self.isFollowingCategory(req.params.id)) {
    return next(new AppError('Not following category', 400));
  }

  // 4. Update category follower count
  category = await Category.findByIdAndUpdate(req.params.id, {
    $inc: { followers: -1 },
  });

  // 5. Remove category from user's category list
  self = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { categories_following: req.params.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      doc: self.categories_following,
    },
  });
});
