const express = require('express');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(commentController.getAll)
  .post(commentController.setPostAndUserId, commentController.createOne);

router.route('/:id/like').patch(commentController.likeCommentById);
router.route('/:id/unlike').patch(commentController.unlikeCommentById);

router
  .route('/:id')
  .get(commentController.getOne)
  .delete(commentController.deleteOne);

router.use(authController.restrictTo('admin'));

module.exports = router;
