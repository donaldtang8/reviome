const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');
const userController = require('./../controllers/userController');
const notificationController = require('./../controllers/notificationController');
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
    notificationController.addPostNotification
  );

router.route('/user/:userId/saves').get(postController.getSavedPostsByUser);
router.route('/user/:userId').get(postController.getPostsByUser);

router.route('/feed').get(postController.getFeed);

router.route('/category/:id/:time').get(postController.getTopPosts);
router.route('/category/id/:id').get(postController.getPostsByCategoryId);
router
  .route('/category/slug/:slug*')
  .get(postController.getPostsByCategorySlug);

router
  .route('/:id/like')
  .patch(
    postController.likePostById,
    notificationController.addLikeNotification
  );
router
  .route('/:id/unlike')
  .patch(
    postController.unlikePostById,
    notificationController.removeLikeNotification
  );

router.route('/saves').get(postController.getSavedPosts);
router.route('/:id/save').patch(postController.savePostById);
router.route('/:id/unsave').patch(postController.unsavePostById);

router
  .route('/:id')
  .get(postController.getOne)
  .delete(
    authController.restrictToMe(Post),
    notificationController.setNotif,
    postController.removePostComments,
    postController.deleteOne,
    notificationController.removePostNotification
  );

module.exports = router;
