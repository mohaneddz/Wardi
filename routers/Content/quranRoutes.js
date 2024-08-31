import express from 'express';
import * as quranController from '../../controllers/Content/quranController.js';

const router = express.Router();

// Define your routes here

router.route('/pages/:page').get(quranController.getPage);
router.route('/juzs/:juz').get(quranController.getJuz);
router.route('/chapter/:chapter').get(quranController.getChapter);

router.route('/pages/').get(quranController.getAllPages);
router.route('/juzs/').get(quranController.getAllJuzs);
router.route('/chapter/').get(quranController.getAllChapters);

router.route('/').get(quranController.getAllChapters);

export default router;
