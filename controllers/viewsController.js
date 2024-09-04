import Chapter from '../models/Content/Quran/quranChaptersModel.js';
import Page from '../models/Content/Quran/quranPagesModel.js';
import Juz from '../models/Content/Quran/quranJuzsModel.js';
import Info from '../models/Content/Quran/quranInfoModel.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getLanding = catchAsync(async (req, res, next) => {
	
	const chapters = await Chapter.find().lean();
	if (!chapters) {
		return next(new AppError('There are currently no Chapters??.', 404));
	}
	res.status(200).render('Home', {
		title: 'Landing',
		chapters,
	});
});

export const getChapter = catchAsync(async (req, res, next) => {

	const chapter = await Chapter.findOne({ chapter: req.params.chapter });

	if (!chapter) {
		return next(new AppError('There is no Chapter with that Number.', 404));
	}

	res.status(200).render('Quran_Reading', {
		title: `${chapter.info.arabicname}`,
		chapter,
	});
});

export const getJuz = catchAsync(async (req, res, next) => {
	const juz = await Juz.findOne({ juz: req.params.juz });
	const juzInfo = await Info.findOne({ juzs: juz.juz });

	if (!juz) {
		return next(new AppError('There is no Juz with that Number.', 404));
	}

	res.status(200).render('Quran_Reading', {
		title: `${juzInfo.name}`,
		juz,
		juzInfo,
	});
});

export const getPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ pageNumber: req.params.page });

  if (!page) {
    return next(new AppError('There is no Page with that Number.', 404));
  }

  res.status(200).render('Quran_Reading', {
    title: `Page ${page.pageNumber}`,
    page,
  });
});

// export const getLoginForm = (req, res) => {
//   res.status(200).render('Login', {
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