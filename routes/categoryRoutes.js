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

router.route('/').get(categoryController.getAll);

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router.patch('/follow/:id', categoryController.followCategoryById);
router.patch('/unfollow/:id', categoryController.unfollowCategoryById);

router.use(authController.restrictTo('admin'));

router.patch('/id/:id', categoryController.updateCategoryById);

router
  .route('/')
  .post(categoryController.getAncestorsAndParent, categoryController.createOne);

module.exports = router;
