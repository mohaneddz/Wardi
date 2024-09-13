import * as viewsController from '../controllers/viewsController.js';
import express from 'express';

const router = express.Router();

router.get('/', viewsController.getLanding);
router.get('/about', viewsController.getAbout);
router.route('/search/:type?').get(viewsController.searchView).post(viewsController.getSearch);

export default router;
