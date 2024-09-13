import { ChaptersSearch, ChapterEnglish } from '../../models/Content/Quran/quranChaptersModel.js';
import Hadith from '../../models/Content/Hadith/HadithModel.js';
import Tafsir from '../../models/Content/Tafsir/TafsirModel.js';

import catchAsync from '../catchAsync.js';
import AppError from '../appError.js';

export const queryQuran = catchAsync(async (req, res, lang) => {
	const query = req.body.query;

	const filter = {
		$text: { $search: query, $caseSensitive: false, $diacriticSensitive: false },
	};
	const Chapter = lang === 'eng' ? ChapterEnglish : ChaptersSearch;

	const result = await Chapter.find(filter)
		.select({ score: { $meta: 'textScore' }, _id: 0, name: 1, verses: 1, chapter: 1 })
		.sort({ score: { $meta: 'textScore' } })
		// .limit(10)
		.lean();

	const filteredResults = result.map((chapter) => {
		return {
			chapter: chapter.chapter,
			name: chapter.name,
			verses: chapter.verses
				.filter((verse) => verse.text.includes(query))
				.filter((verse) => verse.text?.length > 0),
		};
	});

	const counter = filteredResults.reduce((acc, chapter) => {
		return acc + chapter.verses.length;
	}, 0);

	res.status(200).json({
		status: 'success',
		results: counter,
		data: filteredResults,
	});
});

export const queryHadith = catchAsync(async (req, res, lang) => {
	const query = req.body.query;
	const book = req.body.book;

	const filter = {
		$text: { $search: query, $caseSensitive: false, $diacriticSensitive: false },
		name: book,
	};

	const result = await Hadith.find(filter)
		.select({ score: { $meta: 'textScore' }, _id: 0, name: 1, hadiths: 1 })
		.sort({ score: { $meta: 'textScore' } })
		// .limit(10)
		.lean();

	const filteredResults = result.map((hadith) => {
		return {
			name: hadith.name,
			hadiths: hadith.hadiths
				.filter((hadith) => hadith.text.includes(query))
				.filter((hadith) => hadith.text?.length > 0),
		};
	});

	const counter = filteredResults[0]?.hadiths?.length || 0;

	res.status(200).json({
		status: 'success',
		results: counter,
		data: filteredResults[0],
	});
});

export const queryTafsir = catchAsync(async (req, res, lang) => {
	const query = req.body.query;
	const book = req.body.book;

	// MongoDB filter to search text within the specified book
	const filter = {
		$text: { $search: query, $caseSensitive: false, $diacriticSensitive: false },
		slug: book, // Match the specific book slug
	};

	// Perform the database query
	const result = await Tafsir.find(filter)
		.select({ score: { $meta: 'textScore' }, _id: 0, name: 1, slug: 1, ayat: 1 })
		.sort({ score: { $meta: 'textScore' } })
		.lean();

	let counter = 0;

	// Map over the ayat array to filter ayahs that match the query
	const filteredResults = result[0]?.ayat
		?.map((aya) => {
			// Filter the ayahs based on the query within their text
			const filteredAyahs = aya.ayahs.filter((ayah) => ayah.text.includes(query));

			// Increment the counter based on the number of matching ayahs
			counter += filteredAyahs.length;

			// Return only the ayahs that match the query
			return {
				ayahs: filteredAyahs,
				// ...aya, // Include other properties of aya if necessary
			};
		})
		.filter((aya) => aya.ayahs.length > 0); // Filter out ayat without any matching ayahs

	res.status(200).json({
		status: 'success',
		results: counter,
		data: filteredResults,
	});
});
