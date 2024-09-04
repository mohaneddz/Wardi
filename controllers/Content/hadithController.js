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
	const books = await Hadith.aggregate([
		{
			$project: {
				book: 1,
				number: 1,
				name: 1,
			},
			name: 1,
		},
		{
			$match: { name: req.params.book, hadith_number: { $gte: section_start, $lte: section_end } },
		},
		{
			$sort: { 'metadata.name': 1 },
		},
	]);

	res.status(200).render('Hadith_Books', {
		title: 'Hadith Books',
		books,
	});
});

export const getSectionView = catchAsync(async (req, res) => {
	const lang = req.params.book.split('-')[0];

	
	const sectionNumber = parseInt(req.params.section);
	
	const section_range = await Hadith.findOne({ name: req.params.book }).select('metadata').lean();
	const section_start = section_range.metadata.section_details[String(sectionNumber)].hadithnumber_first;
	const section_end = section_range.metadata.section_details[String(sectionNumber)].hadithnumber_last;
	
	const thisbook = await Hadith.findOne({ name: req.params.book }).select('metadata').lean();
	const hadithRaw = await Hadith.aggregate([
		{
			$match: { name: req.params.book },
		},
		{
			$project: {
				metadata: 1,
				name: 1,
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
	const sectionsCount = Object.keys(thisbook.metadata.section_details).length;
	console.log(sectionsCount);
	
	res.status(200).render('hadithReading', {
		title: `Hadith ${this_hadith.metadata.name}`,
		this_hadith,
		sectionsCount,
		sectionNumber,
		hadith_counts,
		sectionsCount,
		lang,
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
		},
		{
			$project: {
				metadata: {
					name: 1,
				},
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
				hadith: { $arrayElemAt: ['$hadiths', hadithNumber - 1] },
			},
		},
	]);
	const this_hadith = hadithRaw[0];

	res.status(200).render('hadithReading', {
		title: `Hadith ${this_hadith.metadata.name}`,
		this_hadith,
		all_books,
		Ltitle: 'الكتاب',
		Rtitle: 'الحديث',
		lang,
		mode: 'HadithChapter',
	});
});
