import express from 'express';
import * as tafsirController from '../../controllers/Content/tafsirController.js';
const router = express.Router();

// router.route('/book/:book/page/:page').get(tafsirController.getPageView);

router.route('/book/:book/chapter/:chapter').get(tafsirController.getTafsirChapterView);
router.route('/book/:book/chapters/:chapter').get(tafsirController.getTafsirBookView);

router.route('/').get(tafsirController.getTafsirBooksView);

export default router;