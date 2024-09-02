import Chapter from '../../models/Content/Quran/quranChaptersModel.js';
import Page from '../../models/Content/Quran/quranPagesModel.js';
import Juz from '../../models/Content/Quran/quranJuzsModel.js';
import Info from '../../models/Content/Quran/quranInfoModel.js';

import catchAsync from '../../utils/catchAsync.js';
import * as factory from '../handlerFactory.js';
import AppError from '../../utils/appError.js';

// Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

// export const getInfo = factory.getOne(Info);

// export const getChapter = factory.getOne(Chapter);
// export const getPage = factory.getOne(Page);
// export const getJuz = factory.getOne(Juz);

// // Get all
// export const getAllChapters = factory.getAll(Chapter);
// export const getAllPages = factory.getAll(Page);
// export const getAllJuzs = factory.getAll(Juz);
// export const getAllInfos = factory.getAll(Info);

// |.....|---------------------------------------------

export const getPageView = catchAsync(async (req, res, next) => {
	// page_number = req.params.page
	const page = await Page.findOne({ page_number: req.params.page }).lean();
	if (!page) {
		return next(new AppError('There is no Page with that Number.', 404));
	}
	res.status(200).render('quranReading', {
		title: `Page ${page.pageNumber}`,
		page,
	});
});
export const getJuzView = catchAsync(async (req, res, next) => {
	const alljuzs = await Juz.aggregate([
		// Unwind the content array
		{ $unwind: '$content' },
		// Group by chapter and collect verses
		{
			$group: {
				_id: '$content.chapter',
				verses: { $push: '$content.verse' },
			},
		},
	]);

	const juz = alljuzs[req.params.juz - 1];

	if (!juz) {
		return next(new AppError('There is no Juz with that Number.', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			alljuzs,
		},
	});

	// res.status(200).render('quranReading', {
	// 	title: `Juz ${juz.juz}`,

	// 	Ltilte: 'الاجزاء',
	// 	Rtitle: 'السور',

	// 	Lelement: 'Juz',
	// 	Relement: 'Chapter',

	// 	Llist: juzInfo,
	// 	Rlist: juz.chapters,

	// 	Lselector: 'juz',
	// 	Rselector: 'chapter',

	// 	Lname: 'juz',
	// 	Rname: 'name',

	// 	Lslug: '/quran/juz/',
	// 	Rslug: '/quran/chapter/',

	// 	Lmatching: true,
	// 	Rmatching: false,

	// 	Lparam: 'juz',
	// 	Rparam: 'chapter',

	// 	juz,
	// 	readerTitle: `Juz ${juz.juz}`,
	// });
});

export const getChapterView = catchAsync(async (req, res, next) => {
	const allchapters = await Chapter.find();
	const chapter = allchapters[req.params.chapter - 1];

	if (!chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}
	res.status(200).render('quranReading', {
		title: `${chapter.name}`,

		Ltitle: 'السور',
		Rtitle: 'الأيات',

		Lelement: 'Chapter',
		Relement: 'Verse',

		Llist: allchapters,
		Rlist: chapter.verses,

		Lselector: 'chapter',
		Rselector: 'verse',

		Lname: 'name',
		Rname: 'verse',

		Lslug: '/quran/chapter/',
		Rslug: '/quran/verse/',

		Lmatching: true,
		Rmatching: false,

		Lparam: 'chapter',
		Rparam: 'verse',

		chapter,
		readerTitle: `${chapter.name}`,
	});
});

export const getAllPagesView = catchAsync(async (req, res, next) => {
	const pages = await getAllPages(req, res, next);
	if (!pages) {
		return next(new AppError('There are currently no Pages.', 404));
	}
	res.status(200).render('quranReading', {
		title: 'All Pages',
		pages,
	});
});
export const getAllJuzsView = catchAsync(async (req, res, next) => {
	const juzs = await getAllJuzs(req, res, next);
	if (!juzs) {
		return next(new AppError('There are currently no Juzs.', 404));
	}
	res.status(200).render('quranReading', {
		title: 'All Juzs',
		juzs,
	});
});
export const getAllChaptersView = catchAsync(async (req, res, next) => {
	const chapters = await getAllChapters(req, res, next);
	if (!chapters) {
		return next(new AppError('There are currently no Chapters.', 404));
	}
	res.status(200).render('landing', {
		title: 'Landing',
		chapters,
	});
});
