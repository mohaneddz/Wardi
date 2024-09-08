import Chapter from '../models/Content/Quran/quranChaptersModel.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getLanding = catchAsync(async (req, res, next) => {
	const chapters = await Chapter.aggregate([
		{
			$project: {
				chapter: 1,
				name: 1,
				verses: {
					length: 1,
				},
				info: {
					revelation: 1,
				},
			},
		},
	]);
	if (!chapters) {
		return next(new AppError('There are currently no Chapters??.', 404));
	}
	res.status(200).render('Home', {
		title: 'Landing',
		chapters,
	});
});
