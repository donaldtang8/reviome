const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');
const userController = require('./../controllers/userController');

const User = require('./../models/userModel');

// router middleware
const router = express.Router();

/* NON AUTHENTICATED ROUTES */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router.get('/id/:id', userController.getUserById);
router.get('/user/:username', userController.getUserByUsername);

router.get('/following/:id', userController.getUserFollowingList);
router.patch('/follow/:id', userController.followUserById);
router.patch('/unfollow/:id', userController.unfollowUserById);

router.patch('/block/:id', userController.blockUserById);
router.patch('/unblock/:id', userController.unblockUserById);

router.get('/me', userController.getMe, userController.getUserById);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateSocials', userController.updateSocials);

/* ADMIN ROUTES */
router.use(authController.restrictTo('admin'));

router.route('/ban/:id').patch(userController.banUserById);
router.route('/unban/:id').patch(userController.unbanUserById);

router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/')
  .get(userController.getAllUsers)
  .patch(userController.updateUser);

module.exports = router;
