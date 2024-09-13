import express from 'express';
import * as userController from './../controllers/userController.js';
import * as authController from './../controllers/authController.js';

const router = express.Router();

// Just like an API, we can create a route for the user ( I can't be more creative ) -------------------------

// Basic Auth Routes ------------------------------------------------
router.delete('/bookmarks/:type/:info1/:info2?', userController.labelRemovalBookmarks);
router.get('/signup', userController.redirect, userController.signupView).post('/signup', authController.signup);
router.get('/login', userController.redirect, userController.loginView).post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/bookmarks/:type', userController.getBookmarks);
router.get('/bookmarks', userController.bookmarksView)
	.post('/bookmarks', userController.addBookmark)
	.delete('/bookmarks', userController.removeBookmark);
router.get('/me', userController.getUserPage).patch(
	'/me',
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	authController.updatePassword,
	userController.updateMe
);
router.get('/verifyEmail', authController.verifyEmail);
router.get('/forgotPassword', userController.newPasswordView).post('/forgotPassword', authController.forgotPassword);
router.get('/resetPassword',authController.resetPassword ).post(
	'/resetPassword',
	authController.isLoggedIn,
	authController.resetPassword,
	userController.newPasswordView
);



// ---------------------------------------------------------------------------------------------------------------- Deprecated Routes ( Not Needed ) 

// router.get('/bookmarks', userController.getBookmarksView).post('/bookmarks', authController.isLoggedIn, userController.addBookmark);
// Password Reset Routes ------------------------------------------------
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
// Protect all routes after this middleware ------------------------------------------------
// router.use(authController.protect); // user must be logged in to access the routes below
// Update Password ------------------------------------------------
// router.patch('/updateMyPassword', authController.updatePassword);
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
