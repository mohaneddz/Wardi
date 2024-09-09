import express from 'express';
import * as quranController from '../../controllers/Content/quranController.js';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

router.route('/page/:page').get(authController.isLoggedIn, quranController.getPageView);
router.route('/juz/:juz/chapter/:chapter?').get(authController.isLoggedIn, quranController.getJuzView);
router.route('/chapter/:chapter').get(authController.isLoggedIn, quranController.getChapterView);

export default router;
