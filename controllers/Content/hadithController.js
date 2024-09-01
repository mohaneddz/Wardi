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
                img: 1,
                'metadata.name': 1,
                hadith_counts: { $size: '$hadiths' },
            },
        },
        {
            $match: {
                name: { $not: /1$/ } 
            }
        },
        {
            $sort: { 'metadata.name': 1 }
        }
    ]);

    res.status(200).render('Hadith_Books', {
        title: 'Hadith Books',
        books,
    });
});

export const getPageView = catchAsync(async (req, res, next) => {
	const hadith = await Hadith.findOne({ book: req.params.book, hadith_number: req.params.hadith }).lean();
	if (!hadith) {
		return next(new AppError('There is no Hadith with that Number.', 404));
	}
	res.status(200).render('hadithReading', {
		title: `Hadith ${hadith.hadith_number}`,
		hadith,
	});
});

export const getHadithView = catchAsync(async (req, res, next) => {
	const hadith = await Hadith.findOne({ book: req.params.book, hadith_number: req.params.hadith }).lean();
	if (!hadith) {
		return next(new AppError('There is no Hadith with that Number.', 404));
	}
	res.status(200).render('hadithReading', {
		title: `Hadith ${hadith.hadith_number}`,
		hadith,
	});
});
// export const getChapterView = catchAsync(async (req, res, next) => {
