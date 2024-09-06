import Chapter from '../../models/Content/Quran/quranChaptersModel.js';
import Page from '../../models/Content/Quran/quranPagesModel.js';
import Juz from '../../models/Content/Quran/quranJuzsModel.js';
import Info from '../../models/Content/Quran/quranInfoModel.js';
import ChapterInfo from '../../models/Content/Quran/quranChapterInfo.js';

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

// For the Single Views--------------------------------------------------------------------------------------------

// For the Quran Chapter View --------------------------------------------
export const getChapterView = catchAsync(async (req, res, next) => {

	const user = req.user;
	
	
	const all_chapters = await Chapter.find().lean();
	const this_chapter = all_chapters[req.params.chapter - 1];
	
	if (!this_chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}
	res.status(200).render('Reading_Quran', {
		title: `${this_chapter.info.arabicname}`,
		user,
		this_chapter,
		all_chapters,
		readerTitle: this_chapter.name,
		Ltitle: 'السور',
		Rtitle: 'الآيات',
		mode: 'QuranChapter',
	});
});

// For the Quran Juz View --------------------------------------------
export const getJuzView = catchAsync(async (req, res, next) => {

	const user = req.user;
	
	const alljuz = await Juz.find().sort({ juz: 1 }).lean();
	const this_juz = await Juz.find({ juz: req.params.juz });
	const juzNumber = req.params.juz;
	const this_chapter = req.params.chapter;
	let chapterName = await Chapter.findOne({ chapter: this_chapter }).exec();
	chapterName = chapterName ? chapterName.name : null;

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
				chapter: 1,
			},
		},
		{
			$project: {
				_id: 0,
				chapter: 1,
				text: 1,
			},
		},
	]).exec();

	const info = await Info.findOne();

	if (!this_juz) {
		return next(new AppError('There is no Juz with that Number.', 404));
	}

	res.status(200).render('Reading_Quran', {
		title: `Juz ${req.params.juz}`,
		this_juz,
		user,
		juzNumber,
		this_chapter,
		alljuz,
		chapters,
		info,
		readerTitle: chapterName,
		Ltitle: 'الجزء',
		Rtitle: 'السور',
		mode: 'QuranJuz',
	});
});

// For the Quran Page View --------------------------------------------
export const getPageView = catchAsync(async (req, res, next) => {

	const user = req.user;
	// page_number = req.params.page
	const pageNumber = req.params.page;
	const this_page = await Page.findOne({ page_number: pageNumber }).sort({ chapter: 1, verses: 1 }).lean();
	const allpages = await Page.find().sort({  page_number: 1 }).lean();
	const chapter_info = await ChapterInfo.find().sort({ number: 1 }).lean();

	if (!this_page) {
		return next(new AppError('There is no Page with that Number.', 404));
	}

	res.status(200).render('Reading_Quran', {
		title: `Page ${this_page.page_number}`,
		pageNumber,
		this_page,
		user,
		chapter_info,
		allpages,
		readerTitle: `Page ${this_page.page_number}`,
		Ltitle: 'الصفحات',
		Rtitle: 'الآيات',
		mode: 'QuranPage',
	});

});

// For the ALL Views --------------------------------------------------------------------------------------------
export const getAllPagesView = catchAsync(async (req, res, next) => {
	const pages = await getAllPages(req, res, next);
	if (!pages) {
		return next(new AppError('There are currently no Pages.', 404));
	}
	res.status(200).render('Reading_Quran', {
		title: 'All Pages',
		pages,
	});
});
export const getAllJuzsView = catchAsync(async (req, res, next) => {
	const juzs = await getAllJuzs(req, res, next);
	if (!juzs) {
		return next(new AppError('There are currently no Juzs.', 404));
	}
	res.status(200).render('Reading_Quran', {
		title: 'All Juzs',
		juzs,
	});
});
export const getAllChaptersView = catchAsync(async (req, res, next) => {
	const chapters = await getAllChapters(req, res, next);
	if (!chapters) {
		return next(new AppError('There are currently no Chapters.', 404));
	}
	res.status(200).render('Home', {
		title: 'Landing',
		chapters,
	});
});
