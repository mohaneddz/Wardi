import express from 'express';
import * as quranController from '../../controllers/Content/quranController.js';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

router.route('/book/:book/page/:page').get(authController.isLoggedIn, quranController.getPageView);
router.route('/book/:book/juz/:juz/chapter/:chapter?').get(authController.isLoggedIn, quranController.getJuzView);
router.route('/book/:book/chapter/:chapter').get(authController.isLoggedIn, quranController.getChapterView);
router.route('/').get(quranController.getBooksView);

export default router;
