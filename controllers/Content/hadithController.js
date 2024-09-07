import Hadith from '../../models/Content/Hadith/HadithModel.js';

import catchAsync from '../../utils/catchAsync.js';
import * as factory from '../handlerFactory.js';
import AppError from '../../utils/appError.js';

// // Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

// // export const getHadith = factory.getOne(Hadith);
// // export const getAllHadiths = factory.getAll(Hadith);
// // export const createHadith = factory.createOne(Hadith);
// // export const updateHadith = factory.updateOne(Hadith);
// // export const deleteHadith = factory.deleteOne(Hadith);

// // |.....|---------------------------------------------

export const getBooksView = catchAsync(async (req, res) => {
	const user = req.user;
	const fav_books = user?.bookmarks?.fav_books_hadiths?.map((book) => book.book) || [];

	console.log(user);
	console.log(user.bookmarks);
	console.log(user.bookmarks.fav_books_hadiths);

	const books = await Hadith.aggregate([
		{
			$project: {
				book: 1,
				number: 1,
				name: 1,
				image: 1,
				'metadata.name': 1,
				hadith_counts: { $size: '$hadiths' },
			},
		},
		{
			$match: {
				name: { $not: /1$/ },
			},
		},
		{
			$sort: { 'metadata.name': 1 },
		},
	]);

	res.status(200).render('Books_Hadith', {
		title: 'Hadith Books',
		fav_books,
		books,
	});
});

export const getSectionView = catchAsync(async (req, res) => {
	
	const lang = req.params.book.split('-')[0];
	const sectionNumber = parseInt(req.params.section);

	const section_range = await Hadith.findOne({ name: req.params.book })?.select('metadata').lean();
	const section_start = section_range?.metadata.section_details[String(sectionNumber)].hadithnumber_first;
	const section_end = section_range?.metadata.section_details[String(sectionNumber)].hadithnumber_last;

	const this_book = await Hadith.findOne({ name: req.params.book }).select('metadata number').lean();

	const user = req.user;
	
	const fav_sections =
		user?.bookmarks?.fav_sections_hadith
			.filter((section) => section.book === this_book.number)
			.map((section) => section.section) || [];

	const fav_hadiths =
		user?.bookmarks?.fav_hadiths
			.filter((hadith) => hadith.book === this_book.number)
			.map((hadith) => hadith.hadith) || [];

	const hadithRaw = await Hadith.aggregate([
		{
			$match: { name: req.params.book },
		},
		{
			$project: {
				metadata: 1,
				name: 1,
				number: 1,
				hadiths: {
					$filter: {
						input: '$hadiths',
						as: 'hadith',
						cond: {
							$and: [
								{ $gte: ['$$hadith.hadithnumber', section_start] }, // greater than or equal to section_start
								{ $lte: ['$$hadith.hadithnumber', section_end] }, // less than or equal to section_end
								{ $ne: ['$$hadith.text', ''] }, // Ensure hadith text is not empty
							],
						},
					},
				},
			},
		},
	]);

	const hadith_counts = hadithRaw[0].hadiths.length;
	const this_hadith = hadithRaw[0];
	const sectionsCount = Object.keys(this_book.metadata.section_details).length;

	res.status(200).render('Reading_Hadith', {
		title: `Hadith ${this_hadith.metadata.name}`,
		this_hadith,
		sectionsCount,
		sectionNumber,
		hadith_counts,
		sectionsCount,
		lang,
		fav_hadiths,
		fav_sections,
		Ltitle: 'القسم',
		Rtitle: 'الحديث',
		mode: 'HadithSection',
	});
});

export const getHadithView = catchAsync(async (req, res) => {
	// check if it is english or arabic
	const lang = req.params.book.split('-')[0];

	const hadithNumber = req.params.hadith;
	const all_books = await Hadith.aggregate([
		{
			// check if it starts with lang and not end with the number 1
			$match: { name: { $regex: lang, $not: /1$/ } },
			// $match: { name: { $regex: lang, $not: /1$/ } }, // Older version for same language
		},
		{
			$project: {
				metadata: {
					name: 1,
				},
				number: 1,
				name: 1,
			},
		},
	]);

	const hadithRaw = await Hadith.aggregate([
		{
			$match: { name: req.params.book },
		},
		{
			$addFields: { hadith_counts: { $size: '$hadiths' } },
		},
		{
			$project: {
				metadata: {
					name: 1,
				},
				hadith_counts: 1,
				name: 1,
				number: 1,
				hadith: { $arrayElemAt: ['$hadiths', hadithNumber - 1] },
			},
		},
	]);

	const this_book = hadithRaw[0];

	const user = req.user;
	const fav_books = user?.bookmarks?.fav_books_hadiths?.map((book) => book.book) || [];
	const fav_hadiths =
		user?.bookmarks?.fav_hadiths
			.filter((hadith) => hadith.book === this_book.number)
			.map((hadith) => hadith.hadith) || [];

	res.status(200).render('Reading_Hadith', {
		title: `Hadith ${this_book.metadata.name}`,
		this_book,
		fav_books,
		fav_hadiths,
		all_books,
		Ltitle: 'الكتاب',
		Rtitle: 'الحديث',
		lang,
		mode: 'HadithChapter',
	});
});
