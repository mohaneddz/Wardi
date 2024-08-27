import express from 'express';
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
	res.send('User Routes');
});

module.exports = router;
