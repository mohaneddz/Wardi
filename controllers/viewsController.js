import Chapter from '../models/Content/Quran/quranChaptersModel.js';
import Hadith from '../models/Content/Hadith/hadithModel.js';
import Tafsir from '../models/Content/Tafsir/tafsirModel.js';

import { queryQuran, queryHadith, queryTafsir } from '../utils/queue/seachQueries.js';

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
	const type = req.params.type;

	switch (type) {
		case 'quran':
			queryQuran(req, res);
			break;
		case 'hadith':
			queryHadith(req, res);
			break;
		case 'tafsir':
			queryTafsir(req, res);
			break;
		default:
			return next(new AppError('Invalid search type.', 400));
	}
});

export const searchView = catchAsync(async (req, res, next) => {
	const search = ' ';

	// Hadiths
	let all_hadith_books = await Hadith.find({ name: { $regex: /^eng/ } })
		.select({ name: 1, 'metadata.name': 1 })
		.lean();

	all_hadith_books = all_hadith_books.map((book) => {
		book.language = book.name.split('-')[0];
		book.name = book.name.split('-')[1];
		return book;
	});

	// Tafsirs
	let all_tafsir_books = await Tafsir.find().select({ name: 1, language_name: 1, slug: 1 }).lean();

	all_tafsir_books = all_tafsir_books.map((book) => {
		book.language = book.language_name === 'arabic' ? 'ara' : 'eng';
		book.name, 
		// remove the first part only 
		book.slug = book.slug.replace(/^[a-z]+-/, '');
		return book;
	});

	res.status(200).render('Search_Page', {
		all_hadith_books,
		all_tafsir_books,
		title: 'Search',
		search,
	});
});
