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

	const alljuz = await Juz.find();
	const this_juz = await Juz.find({ jus: req.params.juz });
	const this_chapter = req.params.chapter;

	const chapters = await Juz.aggregate([
		{
			$match: { juz: Number(req.params.juz) },
		},
		{
			$unwind: '$content',
		},
		{
			$group: {
				_id: '$content.chapter',
				chapter: { $first: '$content.chapter' },
				text: { $push: '$content.text' },
			},
		},
		{
			$sort: {
				chapters: 1,
			},
		},
		{
			$project: {
				_id: 0,
				chapter: 1,
				text: 1,
			},
		},
	]);

	const info = await Info.findOne();

	if (!this_juz) {
		return next(new AppError('There is no Juz with that Number.', 404));
	}
	res.status(200).render('quranReading', {
		title: `Juz ${req.params.juz}`,
		this_juz,
		alljuz,
		chapters,
		info,
		Ltitle: 'الجزء',
		Rtitle: 'السور',
		mode: 'QuranJuz',
	});
});

export const getChapterView = catchAsync(async (req, res, next) => {

	const allchapters = await Chapter.find().lean();
	const this_chapter = allchapters[req.params.chapter - 1];

	if (!this_chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}
	res.status(200).render('quranReading', {
		title: `${this_chapter.info.arabicname}`,
		this_chapter,
		allchapters,
		readerTitle: this_chapter.name,
		Ltitle: 'السور',
		Rtitle: 'الآيات',
		mode: 'QuranChapter',
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
