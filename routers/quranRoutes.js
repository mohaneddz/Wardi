import express from 'express';
// import quranController from '../controllers/quranController.js';

const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
	res.send('Quran Routes');
});

module.exports = router;
