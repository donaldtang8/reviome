const express = require('express');
const authController = require('./../controllers/authController');
const notificationController = require('./../controllers/notificationController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(notificationController.getAll)
  .post(notificationController.setUserId, notificationController.createOne);

router.route('/me').get(notificationController.getUserNotifications);

router.route('/:id/open').patch(notificationController.setOpen);
router.route('/:id/read').patch(notificationController.setRead);

router
  .route('/:id')
  .get(notificationController.getOne)
  .delete(notificationController.deleteOne);

module.exports = router;
