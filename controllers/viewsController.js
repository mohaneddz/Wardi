import Chapter from '../models/Quran/quranChaptersModel.js';
import Page from '../models/Quran/quranPagesModel.js';
import Juz from '../models/Quran/quranJuzsModel.js';
import Info from '../models/Quran/quranInfoModel.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getLanding = catchAsync(async (req, res, next) => {
	const chapters = await Chapter.find();

	if (!chapters) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			chapters,
		},
	});

	// res.status(200).render('landing', {
	// 	title: 'Landing',
	// 	chapters,
	// });
});

export const getChapter = catchAsync(async (req, res, next) => {
	const chapter = await Chapter.findOne({ chapter: req.params.chapter });
	const chapterInfo = await Info.findOne({ chapters: chapter.content.chapter });

	if (!chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}

	res.status(200).render('quranReading', {
		title: `${chapterInfo.name}`,
		chapter,
		chapterInfo,
	});
});

// export const getLoginForm = (req, res) => {
//   res.status(200).render('login', {
//     title: 'Log into your account'
//   });
// };

// export const getAccount = (req, res) => {
//   res.status(200).render('account', {
//     title: 'Your account'
//   });
// };

// export const getBookmarks = catchAsync(async (req, res, next) => {
//   // 1) Find all bookmarks
//   const bookmarks = await Booking.find({ user: req.user.id });

//   // 2) Find tours with the returned IDs
//   const tourIDs = bookmarks.map(el => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIDs } });

//   res.status(200).render('overview', {
//     title: 'My Tours',
//     tours
//   });
// });

// export const updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email
//     },
//     {
//       new: true,
//       runValidators: true
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser
//   });
// });

// Fetch all chapters
export const getAllData = async (req, res) => {
    try {
      console.log('Fetching data from database...');
      const chapters = await Chapter.find();
      console.log('Chapters fetched:', chapters);
  
      const pages = await Page.find();
      console.log('Pages fetched:', pages);
  
      const juzs = await Juz.find();
      console.log('Juzs fetched:', juzs);
  
      const infos = await Info.find();
      console.log('Infos fetched:', infos);
  
      res.status(200).json({
        status: 'success',
        results: {
          chapters: chapters.length,
          pages: pages.length,
          juzs: juzs.length,
          infos: infos.length,
        },
        data: {
        //   chapters,
        //   pages,
        //   juzs,
        //   infos,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: err.message,
      });
    }
  };