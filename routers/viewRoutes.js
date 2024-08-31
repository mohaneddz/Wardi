// import authController from '../controllers/authController.js'; // for authentication
import * as viewsController from '../controllers/viewsController.js';
import express from 'express';

const router = express.Router();

// router middleware

// router.use(viewsController.alerts);

router.get('/', viewsController.getAllData);
// router.get('/quran/', viewsController.getQuran);
// router.get('/hadith/', viewsController.getHadith);
// router.get('/tafsir/', viewsController.getTafsir);

// router.get('/', (req, res) => {
//     res.send('View Routes');
// });

export default router;
