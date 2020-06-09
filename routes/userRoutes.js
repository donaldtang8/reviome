const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// router middleware
const router = express.Router();

/* NON AUTHENTICATED ROUTES */

// user authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

/* AUTHENTICATED ROUTES */

// all of the routes that come after this line will require authentication
router.use(authController.protect);

router.patch('/follow/:id', userController.followUserById);
router.patch('/unfollow/:id', userController.unfollowUserById);

router.patch('/block/:id', userController.blockUserById);
router.patch('/unblock/:id', userController.unblockUserById);

router.get('/me', userController.getMe, userController.getUserById);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updatePassword', authController.updatePassword);

router.use(authController.restrictTo('admin'));

router.route('/id/:id').get(userController.getUserById);
router.route('/user/:username').get(userController.getUserByUsername);

router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/').get(userController.getAllUsers);

module.exports = router;
