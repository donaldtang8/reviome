const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

// Retrieve categories
router.get('/topcategories', categoryController.getTopCategories);
router.get('/sub/id/:id', categoryController.getSubcategoriesById);
router.get('/sub/slug/:slug*', categoryController.getSubcategoriesBySlug);

// Retrieve individual category
router.post('/slug', categoryController.getOneBySlug);
router.get('/id/:id', categoryController.getOneById);

router
  .route('/')
  .get(categoryController.getAll)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.getAncestorsAndParent,
    categoryController.createOne
  );

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router.patch('/follow/:id', categoryController.followCategoryById);
router.patch('/unfollow/:id', categoryController.unfollowCategoryById);

module.exports = router;
