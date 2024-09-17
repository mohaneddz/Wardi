import { ChapterEnglish, ChapterWarsh, ChapterHafs } from '../../models/Content/Quran/quranChaptersModel.js';
import { PageEnglish, PageWarsh, PageHafs } from '../../models/Content/Quran/quranPagesModel.js';
import { JuzEnglish, JuzWarsh, JuzHafs } from '../../models/Content/Quran/quranJuzsModel.js';
import Info from '../../models/Content/Quran/quranInfoModel.js';
import ChapterInfo from '../../models/Content/Quran/quranChapterInfo.js';

import Books from '../../models/Content/Quran/quranBooksModel.js';

import catchAsync from '../../utils/catchAsync.js';
import * as factory from '../handlerFactory.js';
import AppError from '../../utils/appError.js';

// Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

export const getInfo = factory.getOne(Info);

export const getChapter = factory.getOne(ChapterHafs);
export const getPage = factory.getOne(PageHafs);
export const getJuz = factory.getOne(JuzHafs);

// Get all
export const getAllChapters = factory.getAll(ChapterHafs);
export const getAllPages = factory.getAll(PageHafs);
export const get30s = factory.getAll(JuzHafs);
export const getAllInfos = factory.getAll(Info);

// For the Single Views--------------------------------------------------------------------------------------------

// For the Quran Chapter View --------------------------------------------
export const getChapterView = catchAsync(async (req, res, next) => {
	let all_chapters;
	const chapterNumber = parseInt(req.params.chapter, 10);

	const this_book = req.params.book;
	let { language } = await Books.findOne({ slug: this_book }).select('language').lean();
	let this_chapter;
	let Chapter;
	switch (this_book) {
		case 'warsh': {
			Chapter = ChapterWarsh;
			break;
		}
		case 'hafs': {
			Chapter = ChapterHafs;
			break;
		}
		case 'mustafakhattaba': {
			Chapter = ChapterEnglish;
			break;
		}
	}

	this_chapter = await Chapter.findOne({ chapter: chapterNumber }).lean();
	all_chapters = await Chapter.find().select('name chapter').lean();

	const user = req.user;
	const fav_verses = user?.bookmarks?.fav_verses
		?.filter((aya) => aya.chapter === chapterNumber)
		.map((aya) => aya.verse);
	const fav_chapters = user?.bookmarks?.fav_chapters?.map((chapter) => chapter.chapter);

	if (!this_chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}
	res.status(200).render('Reading_Quran', {
		title: `${this_chapter.info.arabicname}`,
		user,
		this_chapter,
		language,
		this_book,
		all_chapters,
		chapterNumber,
		readerTitle: this_chapter.name,
		fav_verses,
		fav_chapters,
		Ltitle: 'السور',
		Rtitle: 'الآيات',
		mode: 'QuranChapter',
	});
});

// For the Quran Juz View --------------------------------------------
export const getJuzView = catchAsync(async (req, res, next) => {
	
	const this_book = req.params.book;
	const juzNumber = parseInt(req.params.juz, 10);
	
	
	let Juz, Chapter;
	switch (this_book) {
		case 'warsh': {
			Juz = JuzWarsh;
			Chapter = ChapterWarsh;
			break;
		}
		case 'hafs': {
			Juz = JuzHafs;
			Chapter = ChapterHafs;
			break;
		}
		case 'mustafakhattaba': {
			Juz = JuzEnglish;
			Chapter = ChapterEnglish;
			break;
		}
	}
	
	let  language  = await Books.findOne({ slug: this_book }).select('language').lean();
	language = language?.language || 'ara';

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
		language,
		chapterNumber,
		chapters,
		info,
		this_book,
		chapterNumber,
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
	const this_book = req.params.book;
	
	let Page;
	switch (this_book) {
		case 'warsh': {
			Page = PageWarsh;
			break;
		}
		case 'hafs': {
			Page = PageHafs;
			break;
		}
		case 'mustafakhattaba': {
			Page = PageEnglish;
			break;
		}
	}
	// TODO Add 604+ pages to English Quran
	const this_page = await Page.findOne({ page_number: pageNumber }).sort({ chapter: 1, verses: 1 }).lean();
	const allpages = await Page.find().select('page_number').sort({ page_number: 1 }).lean();
	const chapter_info = await ChapterInfo.find().sort({ number: 1 }).lean();
	let { language } = await Books.findOne({ slug: this_book }).select('language').lean();

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
		this_book,
		language,
		fav_verses,
		chapter_info,
		allpages,
		readerTitle: `Page ${this_page.page_number}`,
		Ltitle: 'الصفحات',
		Rtitle: 'الآيات',
		mode: 'QuranPage',
	});
});

export const getBooksView = catchAsync(async (req, res, next) => {
	const user = req.user;
	const fav_books = user?.bookmarks?.fav_books_quran?.map((book) => book.name) || [];

	const books = await Books.find().lean();

	res.status(200).render('Books_Quran', {
		title: 'Quran Books',
		fav_books,
		books,
	});
});
