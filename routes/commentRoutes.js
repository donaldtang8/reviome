const express = require('express');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');
const notificationController = require('./../controllers/notificationController');

const router = express.Router({ mergeParams: true });

/* AUTHENTICATED ROUTES */

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

// Comment like actions
router.patch(
  '/:id/like',
  commentController.likeCommentById,
  notificationController.addCommentLikeNotification
);
router.patch(
  '/:id/unlike',
  commentController.unlikeCommentById,
  notificationController.removeCommentLikeNotification
);

// Individual comment actions
router
  .route('/:id')
  .get(commentController.getOne)
  .delete(
    notificationController.setNotif,
    commentController.deleteOne,
    notificationController.removeCommentNotification
  );

module.exports = router;
