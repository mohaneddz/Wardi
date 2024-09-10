import { ChaptersSearch } from '../models/Content/Quran/quranChaptersModel.js';
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
	const query = 'قل هو'; // The search query

	// MongoDB text search filter
	const filter = {
		$text: { $search: query, $caseSensitive: false, $diacriticSensitive: false },
	};

	// Perform the search
	const result = await ChaptersSearch.find(filter)
		.select({ score: { $meta: 'textScore' }, _id: 0, name: 1, verses: 1 })
		.sort({ score: { $meta: 'textScore' } })
		// .limit(10)
		.lean();

	// Filter only the verses that include the query
	const filteredResults = result.map((chapter) => {
		return {
			name: chapter.name,
			verses: chapter.verses
				.filter((verse) => verse.text.includes(query))
				.filter((verse) => verse.text?.length > 0), // Only include verses containing the query
		};
	});

	// Return the filtered results
	res.status(200).json({
		status: 'success',
		results: filteredResults.length,
		data: filteredResults,
	});
});

export const searchView = catchAsync(async (req, res, next) => {
	res.status(200).render('Search_Page', {
		title: 'Search',
	});
});
