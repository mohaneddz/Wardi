import express from 'express';
import userController from './../controllers/userController';
import authController from './../controllers/authController';

const router = express.Router();

// Just like an API, we can create a route for the user ( I can't be more creative ) -------------------------

// Basic Auth Routes ------------------------------------------------

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Password Reset Routes ------------------------------------------------

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware ------------------------------------------------
router.use(authController.protect);

// Update Password ------------------------------------------------

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

// Delete User ------------------------------------------------
router.delete('/deleteMe', userController.deleteMe);

// Admin Routes ⚡ ---------------------------------------------------------------------------------------------
router.use(authController.restrictTo('admin'));

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
