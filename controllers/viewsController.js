// import catchAsync from '../utils/catchAsync.js';
// import AppError from '../utils/appError.js';

// import { get } from 'core-js/core/dict';
// import e from 'express';

const getHome = (req, res) => {
	res.status(200).render('base', {
		title: 'Home',
	});
};

export default { getHome };
