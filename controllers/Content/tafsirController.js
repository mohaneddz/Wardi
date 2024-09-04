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

	res.status(200).render('tafsirReading', {
		title: `${this_chapter.info.arabicname}`,
		all_chapters,
		this_chapter,
		tafsir,
		chapterNumber,
        this_book: req.params.book,
		readerTitle: this_chapter.name,
		Ltitle: 'السور',
		Rtitle: 'الآيات',
		mode: 'TafsirChapter',
	});
});

export const getTafsirBooksView = catchAsync(async (req, res) => {

    const this_book = req.params.book;
	const chapterNumber = parseInt(req.params.chapter);
    const allbooks = await Tafsir.find().select('name slug').lean();
	const all_chapters = await Chapter.find().select('name chapter').lean();
	const this_chapter = await Chapter.findOne({ chapter: chapterNumber }).lean();
    const lang = this_book.split('-')[0];

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

	res.status(200).render('tafsirReading', {
		title: `${this_chapter.info.arabicname}`,
        allbooks,
		all_chapters,
		this_chapter,
		tafsir,
        lang,
		chapterNumber,
		readerTitle: this_chapter.name,
        this_book,
		Ltitle: 'الكتاب',
		Rtitle: 'السورة',
		mode: 'TafsirBooks',
	});
});
