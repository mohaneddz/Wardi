import Chapter from '../models/Content/Quran/quranChaptersModel.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getLanding = catchAsync(async (req, res, next) => {
	const user = req.user;
	const fav_chapters = user?.bookmarks?.fav_chapters?.map((chapter) => chapter.chapter) || [];

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
		fav_chapters,
	});
});

export const getSearch = catchAsync(async (req, res, next) => {

	const query = "الله"; 
	const searchResults = await Chapter.find({ $text: { $search: query } }).select('name').lean();
  
	// Return the results
	res.status(200).json({
	  status: 'success',
	  results: searchResults.length,
	  data: {
		search: searchResults,
	  },
	});
  });