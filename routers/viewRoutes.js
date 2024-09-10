// import authController from '../controllers/authController.js'; // for authentication
import * as viewsController from '../controllers/viewsController.js';
import express from 'express';

const router = express.Router();

router.get('/', viewsController.getLanding);
router.get('/search/:query', viewsController.getSearch);
router.get('/search/', viewsController.searchView);

export default router;
