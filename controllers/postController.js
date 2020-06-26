const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const mongoose = require('mongoose');
const Post = require('./../models/postModel');
const Comment = require('./../models/commentModel');
const User = require('./../models/userModel');
const Category = require('./../models/categoryModel');

exports.getAll = factory.getAll(Post, { path: 'comments' });
exports.getOne = factory.getOne(Post, { path: 'comments' });
exports.createOne = factory.createOne(Post);
exports.deleteOne = factory.deleteOne(Post);

// MIDDLEWARES
exports.setCategoryToDelete = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const category = await Category.findById(post.category);

  if (!category) {
    return next(new AppError('No category found', 400));
  }

  req.body.category = category._id;
  next();
});

// ALIASES
/**
 * @function getTopPosts
 * @description Get top posts within a certain time period
 **/
exports.getTopPosts = catchAsync(async (req, res, next) => {
  let days;
  // check time param to calculate time period we will be aggregating for
  switch (req.params.time) {
    case 'daily':
      days = 1;
      break;
    case 'weekly':
      days = 7;
      break;
    case 'monthly':
      days = 30;
      break;
    case 'yearly':
      days = 365;
      break;
    default:
      days = 0;
  }

  if (days === 0) {
    return next(
      new AppError(
        'Can only sort top posts by: daily, weekly, monthly, or yearly',
        400
      )
    );
  }

  const cat = await Category.findById(req.params.id);

  if (!cat) {
    return next(new AppError('No document found with that ID', 400));
  }

  const posts = await Post.aggregate([
    {
      // match all documents with a ratings average greater or equal than 4.5
      $match: {
        $and: [
          { category: mongoose.Types.ObjectId(req.params.id) },
          {
            createdAt: {
              $gte: new Date(new Date() - days * 60 * 60 * 24 * 1000),
            },
          },
        ],
      },
    },
    {
      $sort: { upvoteCount: -1 },
    },
    // {
    //   $limit: 20
    // }
  ]);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      doc: posts,
    },
  });
});

/**
 * @function  getFeed
 * @description Find all posts where: the creator of the post is in user's following array, is not in user's blocked list, and is not being blocked by
 **/
exports.getFeed = catchAsync(async (req, res) => {
  // 1. Get self document for access to following list
  const self = await User.findById(req.user.id);

  // 2. Execute request without APIFeatures object to find total number of results
  const posts = await Post.find({
    $or: [
      {
        $and: [
          { user: { $in: self.following } },
          { user: { $nin: self.block_to } },
          { user: { $nin: self.block_from } },
        ],
      },
      { category: { $in: self.categories_following } },
      { user: { $eq: req.user.id } },
    ],
  });

  // 3. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      $or: [
        {
          $and: [
            { user: { $in: self.following } },
            { user: { $nin: self.block_to } },
            { user: { $nin: self.block_from } },
          ],
        },
        {
          $and: [
            { category: { $in: self.categories_following } },
            { user: { $nin: self.block_to } },
            { user: { $nin: self.block_from } },
          ],
        },
        { user: { $eq: req.user.id } },
      ],
    }).populate('comments'),
    req.query
  )
    .sort()
    .paginate();

  // 4. Execute query
  const doc = await postsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  getPostsByCategoryId
 * @description Find all posts with the category id specified
 **/
exports.getPostsByCategoryId = catchAsync(async (req, res, next) => {
  // 1. Find category with given ID
  const cat = await Category.findById(req.params.id);

  if (!cat) {
    return next(
      new AppError('There is no category associated with that ID', 400)
    );
  }

  // 2. Execute request without APIFeatures object to find total number of results
  const posts = await Post.find({ category: cat }).populate('comments');

  // 3. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      category: cat,
    }).populate('comments'),
    req.query
  ).paginate();

  // 4. Execute query
  const doc = await postsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  getPostsByCategorySlug
 * @description Find all posts with the category slug specified
 **/
exports.getPostsByCategorySlug = catchAsync(async (req, res, next) => {
  // Build slug string
  let slugString = req.params['slug'];
  if (req.params[0]) slugString += req.params[0];

  // 1. Find category by slug
  const cat = await Category.findOne({ slug: slugString });

  if (!cat) {
    return next(
      new AppError('There is no category associated with that ID', 400)
    );
  }

  // 2. Execute request without APIFeatures object to find total number of results
  const posts = await Post.find({
    category: cat,
  }).populate('comments');

  // 3. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      category: cat,
    }).populate('comments'),
    req.query
  ).paginate();

  // 4. Execute query
  const doc = await postsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  getPostsByUser
 * @description Find all posts created by user given by userID
 **/
exports.getPostsByUser = catchAsync(async (req, res) => {
  // 1. Get user document to check if user exists
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  // 2. Execute request without APIFeatures object to find total number of results
  const posts = await Post.find({
    user: req.params.userId,
  });

  // 3. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      user: req.params.userId,
    }).populate('comments'),
    req.query
  ).paginate();

  // 4. Execute query
  const doc = await postsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  getSavedPosts
 * @description Retrieved all saved posts
 **/
exports.getSavedPosts = catchAsync(async (req, res, next) => {
  // 1. Get user object
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }
  // 2. Execute request without APIFeatures object to find total number of results
  const posts = await Post.find({
    saves: { $elemMatch: { $eq: user._id } },
  });

  // 3. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      saves: { $elemMatch: { $eq: user._id } },
    }).populate('comments'),
    req.query
  ).paginate();

  // 4. Execute query
  const doc = await postsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  getSavedPostsByUser
 * @description Retrieved all saved posts given userID
 **/
exports.getSavedPostsByUser = catchAsync(async (req, res, next) => {
  // 1. Get user object
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  // 2. Execute request without APIFeatures object to find total number of results
  const posts = await Post.find({
    saves: { $elemMatch: { $eq: user._id } },
  });

  // 3. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      saves: { $elemMatch: { $eq: user._id } },
    }).populate('comments'),
    req.query
  ).paginate();

  // 4. Execute query
  const doc = await postsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  likePostById
 * @description Like post
 **/
exports.likePostById = catchAsync(async (req, res, next) => {
  // 1. Retrieve post from id
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No document found with that ID', 400));
  }

  // NOTIFICATION - set doc in req.body so notification can access
  req.body.doc = post;

  // 2. Check if user already liked post
  if (post.likedPost(req.user.id)) {
    return next(new AppError('Already liked post', 400));
  }

  // 3. Add user to likes array and update like count
  const newPost = await Post.findByIdAndUpdate(
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
      doc: newPost.likes,
    },
  });
  next();
});

/**
 * @function  unlikePostById
 * @description Unlike post
 **/
exports.unlikePostById = catchAsync(async (req, res, next) => {
  // 1. Retrieve post from id
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No document found with that ID', 400));
  }

  // 2. Check if post is liked
  if (!post.likedPost(req.user.id)) {
    return next(new AppError('Post has not been liked yet', 400));
  }

  // 3. Decrement like count
  const newPost = await Post.findByIdAndUpdate(
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
      doc: newPost.likes,
    },
  });
  next();
});

/**
 * @function  savePostById
 * @description Find post by given post ID and add user to its save array
 **/
exports.savePostById = catchAsync(async (req, res, next) => {
  // 1. Retrieve post from id
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No document found with that ID', 400));
  }

  // 2. Check if user already liked post
  if (post.savedPost(req.user.id)) {
    return next(new AppError('Already saved post', 400));
  }

  // 3. Find post by id and update save list
  const newPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { saveCount: 1 },
      $push: { saves: req.user.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      doc: newPost.saves,
    },
  });
});

/**
 * @function  savePostById
 * @description Find post by given post ID and add user to its save array
 **/
exports.unsavePostById = catchAsync(async (req, res, next) => {
  // 1. Retrieve post from id
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No document found with that ID', 400));
  }

  // 2. Check if user already liked post
  if (!post.savedPost(req.user.id)) {
    return next(new AppError('Post has not been saved yet', 400));
  }

  // 1. Find post by id and update save list
  const newPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { saveCount: -1 },
      $pull: { saves: req.user.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      doc: newPost.saves,
    },
  });
});

/**
 * @function  removePostComments
 * @description Remove all comments associated with post before removing the post
 **/
exports.removePostComments = catchAsync(async (req, res, next) => {
  // 1. Find and delete all comments with post id of post to be deleted
  await Comment.deleteMany({ post: req.params.id });
  next();
});
