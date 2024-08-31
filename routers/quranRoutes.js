import express from 'express';
import quranController from '../controllers/quranController.js';

const router = express.Router();

// Define your routes here
router.route('/').get(quranController.getAllChapters);
router.route('/pages/:page').get(quranController.getPage);
router.route('/juzs/:juz').get(quranController.getJuz);

module.exports = router;
