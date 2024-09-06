// @ts-ignore
import express from 'express';
import * as hadithController from '../../controllers/Content/hadithController.js';
import * as userController from '../../controllers/userController.js';
const router = express.Router();

// router.route('/book/:book/page/:page').get(hadithController.getPageView);
router.route('/book/:book/hadith/:hadith').get(userController.getMe ,hadithController.getHadithView);
router.route('/book/:book/section/:section').get(userController.getMe ,hadithController.getSectionView);

router.route('/').get(hadithController.getBooksView);

export default router;