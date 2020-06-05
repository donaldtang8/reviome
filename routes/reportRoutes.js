const express = require('express');
const authController = require('./../controllers/authController');
const reportController = require('./../controllers/reportController');

const router = express.Router();

router.use(authController.protect);

router.route('/').post(reportController.setMe, reportController.createOne);

router.use(authController.restrictTo('admin'));

router.route('/').get(reportController.getAll);

router
  .route('/:id')
  .get(reportController.getOne)
  .patch(reportController.resolveReport);

module.exports = router;
