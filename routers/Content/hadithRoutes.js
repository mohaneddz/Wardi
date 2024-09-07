// @ts-ignore
import express from 'express';
import * as hadithController from '../../controllers/Content/hadithController.js';
import * as authController from '../../controllers/authController.js';
const router = express.Router();

// router.route('/book/:book/page/:page').get(hadithController.getPageView);
router.route('/book/:book/hadith/:hadith').get(authController.isLoggedIn ,hadithController.getHadithView);
router.route('/book/:book/section/:section').get(authController.isLoggedIn ,hadithController.getSectionView);

router.route('/').get(authController.isLoggedIn, hadithController.getBooksView);

export default router;