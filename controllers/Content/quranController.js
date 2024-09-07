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
// export const get30s = factory.getAll(Juz);
// export const getAllInfos = factory.getAll(Info);

// For the Single Views--------------------------------------------------------------------------------------------

// For the Quran Chapter View --------------------------------------------
export const getChapterView = catchAsync(async (req, res, next) => {
	const all_chapters = await Chapter.find().select('name chapter').lean();
	const chapterNumber = parseInt(req.params.chapter, 10);
	const this_chapter = await Chapter.findOne({ chapter: chapterNumber }).lean();

	const user = req.user;
	const fav_verses = user?.bookmarks?.fav_verses
		?.filter((aya) => aya.chapter === chapterNumber)
		.map((aya) => aya.verse);

	if (!this_chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}
	res.status(200).render('Reading_Quran', {
		title: `${this_chapter.info.arabicname}`,
		user,
		this_chapter,
		all_chapters,
		readerTitle: this_chapter.name,
		fav_verses,
		Ltitle: 'السور',
		Rtitle: 'الآيات',
		mode: 'QuranChapter',
	});
});

// For the Quran Juz View --------------------------------------------
export const getJuzView = catchAsync(async (req, res, next) => {
	const juzNumber = parseInt(req.params.juz, 10);
	const this_juz = await Juz.find({ juz: juzNumber });

	const chapterNumber = parseInt(req.params.chapter, 10) || this_juz[0].content[0].chapter;

	let chapter = await Chapter.findOne({ chapter: chapterNumber }).select('name').lean();
	let chapterName = chapter ? chapter.name : null;

	const user = req.user;
	const fav_chapters = user?.bookmarks?.fav_chapters?.map((chapter) => chapter.chapter);

	const chapters = await Juz.aggregate([
		// slow
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
				chapter: 1,
			},
		},
	]).exec();

	const info = await Info.aggregate([
		{
			$project: {
				arabicname: {
					$map: {
						input: '$chapters',
						as: 'chapter',
						in: '$$chapter.arabicname',
					},
				},
			},
		},
	]);

	if (!this_juz) {
		return next(new AppError('There is no Juz with that Number.', 404));
	}

	res.status(200).render('Reading_Quran', {
		title: `Juz ${req.params.juz}`,
		this_juz,
		user,
		juzNumber,
		chapterNumber,
		chapters,
		info,
		readerTitle: chapterName,
		fav_chapters,
		Ltitle: 'الجزء',
		Rtitle: 'السور',
		mode: 'QuranJuz',
	});
});

// For the Quran Page View --------------------------------------------
export const getPageView = catchAsync(async (req, res, next) => {
	const user = req.user;

	// page_number = req.params.page
	const pageNumber = parseInt(req.params.page, 10);
	const this_page = await Page.findOne({ page_number: pageNumber }).sort({ chapter: 1, verses: 1 }).lean();
	const allpages = await Page.find().select('page_number').sort({ page_number: 1 }).lean();
	const chapter_info = await ChapterInfo.find().sort({ number: 1 }).lean();

	const fav_pages = user?.bookmarks?.fav_pages?.map((page) => page.page);
	const fav_verses = user?.bookmarks?.fav_verses
		?.filter((aya) => this_page.verses.some((verse) => verse.verse === aya.verse))
		.map((aya) => aya.verse);

	if (!this_page) {
		return next(new AppError('There is no Page with that Number.', 404));
	}
	res.status(200).render('Reading_Quran', {
		title: `Page ${this_page.page_number}`,
		pageNumber,
		this_page,
		user,
		fav_pages,
		fav_verses,
		chapter_info,
		allpages,
		readerTitle: `Page ${this_page.page_number}`,
		Ltitle: 'الصفحات',
		Rtitle: 'الآيات',
		mode: 'QuranPage',
	});
});

// // For the ALL Views -------------------------------------------------------------------------------------------- No need
// export const getAllPagesView = catchAsync(async (req, res, next) => {
// 	const pages = await getAllPages(req, res, next);
// 	if (!pages) {
// 		return next(new AppError('There are currently no Pages.', 404));
// 	}
// 	res.status(200).render('Reading_Quran', {
// 		title: 'All Pages',
// 		pages,
// 	});
// });
// export const get30sView = catchAsync(async (req, res, next) => {
// 	const juzs = await get30s(req, res, next);
// 	if (!juzs) {
// 		return next(new AppError('There are currently no Juzs.', 404));
// 	}
// 	res.status(200).render('Reading_Quran', {
// 		title: 'All Juzs',
// 		juzs,
// 	});
// });
// export const getAllChaptersView = catchAsync(async (req, res, next) => {
// 	const chapters = await getAllChapters(req, res, next);
// 	if (!chapters) {
// 		return next(new AppError('There are currently no Chapters.', 404));
// 	}
// 	res.status(200).render('Home', {
// 		title: 'Landing',
// 		chapters,
// 	});
// });
