const express = require('express');
const authController = require('./../controllers/authController');
const reportController = require('./../controllers/reportController');

const router = express.Router();

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router.post(
  '/',
  reportController.setMe,
  reportController.checkDuplicate,
  reportController.validateReport,
  reportController.createOne
);

/* ADMIN ROUTES */
router.use(authController.restrictTo('admin'));

router.route('/').get(reportController.getAll);

router
  .route('/:id')
  .get(reportController.getOne)
  .patch(reportController.resolveReport)
  .delete(reportController.deleteOne);

module.exports = router;
