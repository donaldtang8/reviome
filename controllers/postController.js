const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const mongoose = require('mongoose');
const Post = require('./../models/postModel');
const Comment = require('./../models/commentModel');
const User = require('./../models/userModel');
const Category = require('./../models/categoryModel');
const NotificationController = require('./notificationController');

exports.getAll = factory.getAll(Post, { path: 'comments' });
exports.deleteOne = factory.deleteOne(Post);

// MIDDLEWARES
/**
 * @middleware setCategoryToDelete
 * @description Get top posts within a certain time period
 **/
exports.setCategoryToDelete = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const category = await Category.findById(post.category);

  if (!category) {
    return next(new AppError('No category found', 400));
  }

  req.body.category = category._id;
  next();
});

/**
 * @middleware setCommunityCategory
 * @description Set category of a community post to 'community'
 **/
exports.setCommunityPostCategoryandUser = catchAsync(async (req, res, next) => {
  req.body.category = '5f09674d0639e61c78e22e26';
  req.body.user = req.user.id;

  const user = await User.findById(req.user.id);
  // since a link is required for a post, we will just provide a placeholder url
  req.body.link = 'https://www.google.com';
  next();
});

// ALIASES
/**
 * @alias getTopPosts
 * @description STILL IN PROGRESS
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
              $gt: new Date(new Date() - days * 60 * 60 * 24 * 1000),
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

exports.createOne = catchAsync(async (req, res, next) => {
  // 1. Check if category is valid
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // 2. Create post document
  let doc = await Post.create(req.body);

  // 3. Increment category post countU
  await Category.findByIdAndUpdate(req.body.category, {
    $inc: { num_posts: 1 },
  });

  // 4. Populate 'user' property and 'comments' property
  let popDoc = await Post.findById(doc._id)
    .populate({
      path: 'user',
      select: '-__v -passwordChangedAt',
    })
    .populate('comments');

  req.body.doc = popDoc;

  // 5. Return response
  res.status(201).json({
    status: 'success',
    data: {
      doc: popDoc,
    },
  });
});

/**
 * @function  getOne
 * @description Find and return post given postId
 **/
exports.getOne = catchAsync(async (req, res, next) => {
  // 1. Find post given id
  const doc = await Post.findById(req.params.id)
    .populate('user')
    .populate('comments');

  // 2. Throw error if document doesn't exist or document belongs to inactive user
  if (!doc || !doc.user.active) {
    return next(new AppError('No document found with that ID', 400));
  }

  // 3. Get self document
  const self = await User.findById(req.user.id);

  // 4. Loop through comments for any comments from blocked users
  let filteredComments = doc.comments.filter((comment) => {
    // if even one of the values is true, we return false
    const containsBlockTo = self.block_to.some(
      (userBlocked) =>
        userBlocked._id.toString() === comment.user._id.toString()
    );

    const containsBlockFrom = self.block_from.some(
      (userBlocked) =>
        userBlocked._id.toString() === comment.user._id.toString()
    );

    if (containsBlockTo || containsBlockFrom) {
      return false;
    }
    return true;
  });
  doc.comments = filteredComments;

  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

/**
 * @function  getFeed
 * @description Find all posts where: the creator of the post is in user's following array, is not in user's blocked list, and is not being blocked by,
 **/
exports.getFeed = catchAsync(async (req, res, next) => {
  // 1. Get self document for access to following list
  const self = await User.findById(req.user.id);

  // 2. Get community category document and get ID to filter out any community posts
  const comCat = await Category.findOne({ name: 'community' });

  // 3. Create new APIFeatures object without pagination (to find total number of results) and pass in query
  const postsTotal = new APIFeatures(
    Post.find({
      $or: [
        {
          $and: [
            { user: { $in: self.following } },
            { user: { $nin: self.block_to } },
            { user: { $nin: self.block_from } },
            { category: { $ne: comCat._id } },
          ],
        },
        {
          $and: [
            { category: { $in: self.categories_following } },
            { user: { $nin: self.block_to } },
            { user: { $nin: self.block_from } },
          ],
        },
        {
          $and: [
            { user: { $eq: req.user.id } },
            { category: { $ne: comCat._id } },
          ],
        },
      ],
    }).populate('user'),
    req.query
  ).sort();

  // 4. Execute query
  let posts = await postsTotal.query;

  // 5. Filter out any posts from inactive or banned users
  posts = posts.filter((post) => post.user.active === true);

  // 6. Create new APIFeatures object (with pagination) and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      $or: [
        {
          $and: [
            { user: { $in: self.following } },
            { user: { $nin: self.block_to } },
            { user: { $nin: self.block_from } },
            { category: { $ne: comCat._id } },
          ],
        },
        {
          $and: [
            { category: { $in: self.categories_following } },
            { user: { $nin: self.block_to } },
            { user: { $nin: self.block_from } },
          ],
        },
        {
          $and: [
            { user: { $eq: req.user.id } },
            { category: { $ne: comCat._id } },
          ],
        },
      ],
    })
      .populate({
        path: 'user',
        select:
          '-__v -passwordChangedAt -wall -categories_following -following -links',
      })
      .populate('comments'),
    req.query
  )
    .sort()
    .paginate();

  // 7. Execute query
  let doc = await postsPaginate.query;

  // 8. Filter out any posts from inactive or banned users
  doc = doc.filter((post) => post.user.active === true);

  // 9. Loop through posts and filter its comments for any comments from blocked users
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = self.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = self.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

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
      new AppError('There is no category associated with that ID', 404)
    );
  }

  // 2. Get self document
  const self = await User.findById(req.user.id);

  // 3. Create new APIFeatures object without pagination (to find total number of results) and pass in query
  const postsTotal = new APIFeatures(
    Post.find({
      category: cat,
    }).populate('user'),
    req.query
  )
    .filter()
    .sort();

  // 4. Execute query
  let posts = await postsTotal.query;

  // 5. Filter out any posts from inactive or banned users
  posts = posts.filter((post) => post.user.active === true);

  // 6. Create new APIFeatures object (with pagination) and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      category: cat,
    })
      .populate('user')
      .populate('comments'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // 7. Execute query
  let doc = await postsPaginate.query;

  // 8. Filter out any posts from inactive or banned users
  doc = doc.filter((post) => post.user.active === true);

  // 9. Loop through posts and filter its comments for any comments from blocked users
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = self.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = self.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

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
      new AppError('There is no category associated with that slug', 404)
    );
  }

  // 2. Get self document
  const self = await User.findById(req.user.id);

  // 3. Create new APIFeatures object without pagination (to find total number of results) and pass in query
  const postsTotal = new APIFeatures(
    Post.find({
      category: cat,
    }).populate('user'),
    req.query
  )
    .filter()
    .sort();

  // 4. Execute query
  let posts = await postsTotal.query;

  // 5. Filter out any posts from inactive or banned users
  posts = posts.filter((post) => post.user.active === true);

  // 6. Create new APIFeatures object (with pagination) and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      category: cat,
    })
      .populate('user')
      .populate('comments'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // 7. Execute query
  let doc = await postsPaginate.query;

  // 8. Filter out any posts from inactive or banned users
  doc = doc.filter((post) => post.user.active === true);

  // 9. Filter out any blocked comments
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = self.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = self.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

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
exports.getPostsByUser = catchAsync(async (req, res, next) => {
  // 1. Get user document to check if user exists
  const user = await User.findById(req.params.userId);

  // 2. Throw error if user doesn't exist or if user is inactive
  if (!user || !user.active) {
    return next(new AppError('User does not exist', 404));
  }

  // 3. Get community category document and get ID to filter out any community posts
  const comCat = await Category.findOne({ name: 'community' });

  // 4. Find all post documents that are non community posts made by user who initiated request
  let posts = await Post.find({
    $and: [
      { user: { $eq: req.params.userId } },
      { category: { $nin: comCat._id } },
    ],
  });

  // 5. Create new APIFeatures object (with pagination) and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      $and: [
        { user: { $eq: req.params.userId } },
        { category: { $nin: comCat._id } },
      ],
    }).populate('comments'),
    req.query
  )
    .sort()
    .paginate();

  // 6. Execute query
  let doc = await postsPaginate.query;

  // 7. Loop through posts and filter its comments for any comments from blocked users
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = user.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = user.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

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

  // 2. Throw error if user doesn't exist or if user is inactive
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }
  // 3. Find all post documents that are non community posts made by user who initiated request
  let posts = await Post.find({
    saves: { $elemMatch: { $eq: user._id } },
  }).populate('user');

  // 4. Filter out any posts from inactive or banned users
  posts = posts.filter((post) => post.user.active === true);

  // 5. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      saves: { $elemMatch: { $eq: user._id } },
    })
      .populate('user')
      .populate('comments'),
    req.query
  )
    .sort()
    .paginate();

  // 6. Execute query
  let doc = await postsPaginate.query;

  // 7. Filter out any posts from inactive or banned users
  doc = doc.filter((post) => post.user.active === true);

  // 8. Loop through posts and filter its comments for any comments from blocked users
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = user.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = user.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

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

  // 2. Throw error if user doesn't exist or if user is inactive
  if (!user || !user.active) {
    return next(new AppError('User does not exist', 404));
  }
  // 3. Find all post documents that are non community posts made by user who initiated request
  let posts = await Post.find({
    saves: { $elemMatch: { $eq: user._id } },
  }).populate('user');

  // 4. Filter out any posts from inactive or banned users
  posts = posts.filter((post) => post.user.active === true);

  // 5. Create new APIFeatures object and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      saves: { $elemMatch: { $eq: user._id } },
    })
      .populate('user')
      .populate('comments'),
    req.query
  )
    .sort()
    .paginate();

  // 6. Execute query
  let doc = await postsPaginate.query;

  // 7. Filter out any posts from inactive or banned users
  doc = doc.filter((post) => post.user.active === true);

  // 8. Loop through posts and filter its comments for any comments from blocked users
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = user.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = user.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

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
  const post = await Post.findById(req.params.id).populate('user');

  // 2. Throw error if post doesn't exist or post owner is inactive
  if (!post || !post.user.active) {
    return next(new AppError('No document found with that ID', 404));
  }

  // NOTIFICATION - set doc in req.body so notification can access
  req.body.doc = post;

  // 3. Check if user already liked post
  if (post.likedPost(req.user.id)) {
    return next(new AppError('Already liked post', 400));
  }

  // 4. Add user to likes array and update like count
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
  const post = await Post.findById(req.params.id).populate('user');

  // 2. Throw error if post doesn't exist or post owner is inactive
  if (!post || !post.user.active) {
    return next(new AppError('No document found with that ID', 404));
  }

  // 3. Check if post is liked
  if (!post.likedPost(req.user.id)) {
    return next(new AppError('Post has not been liked yet', 400));
  }

  // 4. Decrement like count
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
  const post = await Post.findById(req.params.id).populate('user');

  // 2. Throw error if post doesn't exist or post owner is inactive
  if (!post || !post.user.active) {
    return next(new AppError('No document found with that ID', 404));
  }

  // 3. Check if user already liked post
  if (post.savedPost(req.user.id)) {
    return next(new AppError('Already saved post', 400));
  }

  // 4. Find post by id and update save list
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
 * @function  unsavePostById
 * @description Find post by given post ID and remove user from its save array
 **/
exports.unsavePostById = catchAsync(async (req, res, next) => {
  // 1. Retrieve post from id
  const post = await Post.findById(req.params.id).populate('user');

  // 2. Throw error if post doesn't exist or post owner is inactive
  if (!post || !post.user.active) {
    return next(new AppError('No document found with that ID', 404));
  }

  // 3. Check if user already liked post
  if (!post.savedPost(req.user.id)) {
    return next(new AppError('Post has not been saved yet', 400));
  }

  // 4. Find post by id and update save list
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

/**
 * @function  createCommunityPost
 * @description Create a new community post
 **/
exports.createCommunityPost = catchAsync(async (req, res) => {
  let doc = await Post.create(req.body);

  let popDoc = await Post.findById(doc._id)
    .populate({
      path: 'user',
      select: '-__v -passwordChangedAt',
    })
    .populate('comments');

  res.status(201).json({
    status: 'success',
    data: {
      doc: popDoc,
    },
  });
});

/**
 * @function  getCommunityPosts
 * @description Get community posts
 **/
exports.getCommunityPosts = catchAsync(async (req, res) => {
  // 1. Retrieve self user document
  let user = await User.findById(req.user.id);

  // 2. Get community category document and get ID to filter out any community posts
  const comCat = await Category.findOne({ name: 'community' });

  // 3. Create new APIFeatures object without pagination (to find total number of results) and pass in query
  const postsTotal = new APIFeatures(
    Post.find({
      $and: [
        { category: { $eq: comCat._id } },
        { user: { $eq: req.params.id } },
      ],
    }).populate('user'),
    req.query
  ).sort();

  // 4. Execute query
  let posts = await postsTotal.query;

  // 5. Filter out any posts from inactive or banned users
  posts = posts.filter((post) => post.user.active === true);

  // 6. Create new APIFeatures object (with pagination) and pass in query
  const postsPaginate = new APIFeatures(
    Post.find({
      $and: [
        { category: { $eq: comCat._id } },
        { user: { $eq: req.params.id } },
      ],
    })
      .populate('user')
      .populate('comments'),
    req.query
  )
    .sort()
    .paginate();

  // 7. Execute query
  let doc = await postsPaginate.query;

  // 8. Filter out any posts from inactive or banned users
  doc = doc.filter((post) => post.user.active === true);

  // 9. Loop through posts and filter its comments for any comments from blocked users
  for (let i = 0; i < doc.length; i++) {
    let filteredComments = doc[i].comments.filter((comment) => {
      // if even one of the values is true, we return false
      const containsBlockTo = user.block_to.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      const containsBlockFrom = user.block_from.some(
        (userBlocked) =>
          userBlocked._id.toString() === comment.user._id.toString()
      );

      if (containsBlockTo || containsBlockFrom) {
        return false;
      }
      return true;
    });
    doc[i].comments = filteredComments;
  }

  res.status(200).json({
    status: 'success',
    total: posts.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});
