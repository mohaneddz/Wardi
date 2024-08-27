// import authController from '../controllers/authController.js'; // for authentication
import viewsController from '../controllers/viewsController.js';
import express from 'express';

const router = express.Router();

// router middleware

// router.use(viewsController.alerts);

router.get('/', viewsController.getHome);
// router.get('/', (req, res) => {
//     res.send('View Routes');
// });

export default router;
