import Tafsir from '../../models/Content/Tafsir/TafsirModel.js';
import Chapter from '../../models/Content/Quran/quranChaptersModel.js';

import catchAsync from '../../utils/catchAsync.js';
import * as factory from '../handlerFactory.js';
import AppError from '../../utils/appError.js';
// Remove the following line
// import { all } from 'core-js/fn/promise';

// // Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

// export const getTafsir = factory.getOne(Tafsir);
// export const getAllTafsirs = factory.getAll(Tafsir);
// export const createTafsir = factory.createOne(Tafsir);
// export const updateTafsir = factory.updateOne(Tafsir);
// export const deleteTafsir = factory.deleteOne(Tafsir);

// // |.....|---------------------------------------------

export const getTafsirChapterView = catchAsync(async (req, res) => {

	const chapterNumber = parseInt(req.params.chapter);
	const all_chapters = await Chapter.find().select('name chapter').lean();
	const this_chapter = await Chapter.findOne({ chapter: chapterNumber }).lean();
	
	const user = req.user;
	const fav_chapters = user?.bookmarks?.fav_chapters?.map((chapter) => chapter.chapter) || [];
	const fav_verses = user?.bookmarks?.fav_verses?.map((verse) => verse.verse) || [];

	const tafsir = await Tafsir.aggregate([
		{
			$match: { slug: req.params.book },
		},
		{
			$project: {
				_id: 0,
				name: 1,
				ayat: {
					// the ayat[chapterNumber - 1]
					$arrayElemAt: ['$ayat', chapterNumber - 1],
				},
				slug: 1,
			},
		},
	]);

	res.status(200).render('Reading_Tafsir', {
		title: `${this_chapter.info.arabicname}`,
		all_chapters,
		this_chapter,
		fav_chapters,
		fav_verses,
		tafsir,
		chapterNumber,
		this_book: req.params.book,
		readerTitle: this_chapter.name,
		Ltitle: 'السور',
		Rtitle: 'الآيات',
		mode: 'TafsirChapter',
	});
});

export const getTafsirBookView = catchAsync(async (req, res) => {

	const user = req.user;

	const this_book = req.params.book;
	const chapterNumber = parseInt(req.params.chapter);

	const all_books = await Tafsir.find().select('name slug').lean();
	const all_chapters = await Chapter.find().select('name chapter').lean();
	const this_chapter = await Chapter.findOne({ chapter: chapterNumber }).lean();
	const lang = this_book.split('-')[0];
	
	const fav_books = user?.bookmarks?.fav_books_tafsir?.map((book) => book.slug) || [];
	const fav_chapters = user?.bookmarks?.fav_chapters?.map((chapter) => chapter.chapter) || [];

	const tafsir = await Tafsir.aggregate([
		{
			$match: { slug: req.params.book },
		},
		{
			$project: {
				_id: 0,
				name: 1,
				slug: 1,
				ayat: {
					$arrayElemAt: ['$ayat', chapterNumber - 1],
				},
			},
		},
	]);

	res.
	status(200).render('Reading_Tafsir', {
		title: `${this_chapter.info.arabicname}`,
		all_books,
		all_chapters,
		this_chapter,
		fav_chapters,
		tafsir,
		fav_books,
		lang,
		chapterNumber,
		readerTitle: this_chapter.name,
		this_book,
		Ltitle: 'الكتاب',
		Rtitle: 'السورة',
		mode: 'TafsirBooks',
	});
});

export const getTafsirBooksView = catchAsync(async (req, res) => {
	const user = req.user;
	const fav_books = user?.bookmarks?.fav_books_tafsir?.map((book) => book.slug) || [];
	const all_books = await Tafsir.aggregate([
		{
			$project: {
				name: 1,
				image: 1,
				slug: 1,
				number: 1,
				language_name: 1,
				'metadata.name': 1,
			},
		},
		{
			$match: {
				name: { $not: /1$/ },
			},
		},
		{
			$sort: { slug: 1 },
		},
	]);
	console.log(all_books);
	
	res.status(200).render('Books_Tafsir', {
		title: 'Tafsir Books',
		fav_books,
		all_books,
	});
});
