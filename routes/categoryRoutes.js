const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

router.route('/topcategories').get(categoryController.getTopCategories);

router.route('/sub/id/:id').get(categoryController.getSubcategoriesById);
router.route('/sub/slug/:slug*').get(categoryController.getSubcategoriesBySlug);

router.route('/slug').post(categoryController.getOneBySlug);

router
  .route('/')
  .get(categoryController.getAll)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.getAncestorsAndParent,
    categoryController.createOne
  );

module.exports = router;
