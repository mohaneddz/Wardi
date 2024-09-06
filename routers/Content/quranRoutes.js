import express from 'express';
import * as quranController from '../../controllers/Content/quranController.js';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

router.route('/page/:page').get(authController.isLoggedIn, quranController.getPageView);
router.route('/juz/:juz/chapter/:chapter?').get(authController.isLoggedIn, quranController.getJuzView);
router.route('/chapter/:chapter').get(authController.isLoggedIn, quranController.getChapterView);

// router.route('/page/').get(authController.isLoggedIn, quranController.getAllPagesView);
// router.route('/juz/').get(authController.isLoggedIn, quranController.get30sView);
// router.route('/chapter/').get(authController.isLoggedIn, quranController.getAllChaptersView);

// router.route('/').get(authController.isLoggedIn, quranController.getAllChaptersView);

export default router;
