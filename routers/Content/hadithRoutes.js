// @ts-ignore
import express from 'express';
import * as hadithController from '../../controllers/Content/hadithController.js';
import * as authController from '../../controllers/authController.js';
const router = express.Router();

// router.route('/book/:book/page/:page').get(hadithController.getPageView);
router.route('/book/:book/hadith/:hadith').get(hadithController.getHadithView);
router.route('/book/:book/section/:section').get(hadithController.getSectionView);

router.route('/').get( hadithController.getBooksView);

export default router;