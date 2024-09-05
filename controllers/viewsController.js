import Chapter from '../models/Content/Quran/quranChaptersModel.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getLanding = catchAsync(async (req, res, next) => {
	
	const chapters = await Chapter.find().lean();
	if (!chapters) {
		return next(new AppError('There are currently no Chapters??.', 404));
	}
	res.status(200).render('Home', {
		title: 'Landing',
		chapters,
	});
});