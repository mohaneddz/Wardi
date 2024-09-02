import express from 'express';
import * as quranController from '../../controllers/Content/quranController.js';

const router = express.Router();

router.route('/page/:page').get(quranController.getPageView);
router.route('/juz/:juz/chapter/:chapter').get(quranController.getJuzView);
router.route('/chapter/:chapter').get(quranController.getChapterView);

router.route('/page/').get(quranController.getAllPagesView);
router.route('/juz/').get(quranController.getAllJuzsView);
router.route('/chapter/').get(quranController.getAllChaptersView);

router.route('/').get(quranController.getAllChaptersView);

export default router;
