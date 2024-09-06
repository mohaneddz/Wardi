import express from 'express';
import * as userController from './../controllers/userController.js';
import * as authController from './../controllers/authController.js';

const router = express.Router();

// Just like an API, we can create a route for the user ( I can't be more creative ) -------------------------

// Basic Auth Routes ------------------------------------------------

router.get('/signup', userController.signupView).post('/signup', authController.signup);
router.get('/login', userController.loginView).post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/bookmarks', authController.isLoggedIn, userController.addBookmark).delete('/bookmarks', authController.isLoggedIn, userController.removeBookmark);
// router.get('/bookmarks', userController.getBookmarksView).post('/bookmarks', authController.isLoggedIn, userController.addBookmark);
// Password Reset Routes ------------------------------------------------

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware ------------------------------------------------

router.use(authController.protect); // user must be logged in to access the routes below

// Update Password ------------------------------------------------

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getMeView);

// for API -----
// router.get('/me', userController.getMe, userController.getUser); 
// router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe); // for API

// Delete User ------------------------------------------------

// router.delete('/deleteMe', userController.deleteMe);

// Admin Routes ⚡ ---------------------------------------------------------------------------------------------

// router.use(authController.restrictTo('admin'));

// router.route('/').get(userController.getAllUsers).post(userController.createUser);
// router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;