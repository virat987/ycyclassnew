const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { uploadFileManager} = require("../s3");
const router = express.Router();








router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  uploadFileManager,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router
  .route('/view-students')
  .get(authController.restrictTo('admin'), userController.getAllUsers);
router
  .route('/view-teachers')
  .get(authController.restrictTo('admin'), userController.getAllUsers);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
