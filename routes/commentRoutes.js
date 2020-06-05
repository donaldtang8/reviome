const express = require('express');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');
const notificationController = require('./../controllers/notificationController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(commentController.getAll)
  .post(
    commentController.setPostAndUserId,
    notificationController.setNotif,
    commentController.createOne,
    notificationController.addCommentNotification
  );

router
  .route('/:id/like')
  .patch(
    commentController.likeCommentById,
    notificationController.addCommentLikeNotification
  );
router
  .route('/:id/unlike')
  .patch(
    commentController.unlikeCommentById,
    notificationController.removeCommentLikeNotification
  );

router
  .route('/:id')
  .get(commentController.getOne)
  .delete(
    notificationController.setNotif,
    commentController.deleteOne,
    notificationController.removeCommentNotification
  );

router.use(authController.restrictTo('admin'));

module.exports = router;
