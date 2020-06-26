const express = require('express');
const authController = require('./../controllers/authController');
const categoryController = require('./../controllers/categoryController');
const notificationController = require('./../controllers/notificationController');
const postController = require('./../controllers/postController');
const userController = require('./../controllers/userController');
const Post = require('./../models/postModel');

const router = express.Router();
const commentRouter = require('./commentRoutes');

// if we ever encounter comment in the url we will use the reviewRouter
router.use('/:postId/comments', commentRouter);

router.use(authController.protect);

router
  .route('/')
  .get(postController.getAll)
  .post(
    userController.setMe,
    notificationController.setNotif,
    postController.createOne,
    categoryController.incrementPostCount,
    notificationController.addPostNotification
  );

// Retrieve post data based on user
router.get('/user/:userId/saves', postController.getSavedPostsByUser);
router.get('/user/:userId', postController.getSavedPostsByUser);

// Retrieve post data based on category
router.get('/category/:id/:time', postController.getTopPosts);
router.get('/category/id/:id', postController.getPostsByCategoryId);
router.get('/category/slug/:slug*', postController.getPostsByCategorySlug);

// Retrieve feed
router.route('/feed').get(postController.getFeed);

// Post like actions
router.patch(
  '/:id/like',
  postController.likePostById,
  notificationController.addLikeNotification
);
router.patch(
  '/:id/unlike',
  postController.unlikePostById,
  notificationController.removeLikeNotification
);

// Post save actions
router.get('/saves', postController.getSavedPosts);
router.patch('/:id/save', postController.savePostById);
router.patch('/:id/unsave', postController.unsavePostById);

// Individual post actions
router
  .route('/:id')
  .get(postController.getOne)
  .delete(
    authController.restrictToMe(Post),
    notificationController.setNotif,
    postController.removePostComments,
    postController.setCategoryToDelete,
    postController.deleteOne,
    categoryController.decrementPostCount,
    notificationController.removePostNotification
  );

module.exports = router;
