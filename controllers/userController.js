import User from '../models/userModel.js';

import multer from 'multer';
import sharp from 'sharp';

import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';
import { updatePassword } from './authController.js';
import { info } from 'sass';

// export const uploadUserPhoto = upload.single('photo');

// // Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

// export const getUser = factory.getOne(User);
// export const getAllUsers = factory.getAll(User);
export const createUser = factory.createOne(User);
// export const updateUser = factory.updateOne(User);
// export const deleteUser = factory.deleteOne(User);

// // |.....|---------------------------------------------

export const getMe = (req, res, next) => {
	if (req.user) req.params.id = req.user.id;
	next();
};

// View Functions ------------------------------------------------

export const signupView = (req, res) => {
	res.status(200).render('Signup_Page', {
		title: 'Create your account',
		h1: 'Sign Up',
	});
};

export const loginView = (req, res) => {
	res.status(200).render('Login_Page', {
		title: 'Log into your account',
		h1: 'Login',
	});
};

export const accountView = (req, res) => {
	res.status(200).render('User_Page', {
		title: 'Your account',
	});
};

export const getUserPage = catchAsync(async (req, res) => {
	const user = req.user;

	if (!user) {
		signupView(req, res);
	} else {
		accountView(req, res);
	}
});

export const redirect = (req, res, next) => {
	if (req.user) return res.redirect('/user/me');
	else next();
};

// Basic Auth Functions ------------------------------------------------

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((key) => {
		if (allowedFields.includes(key)) newObj[key] = obj[key];
	});
	return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		return next(new AppError('User not found', 404));
	}

	const filteredBody = filterObj(req.body, 'username');
	if (req.file) filteredBody.photo = req.file.filename;

	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

export const newPasswordView = (req, res) => {
	if (!req.user)
		return res.status(200).json({
			status: 'success',
			data: {
				message: 'Check your email for the reset link',
			},
		});

	res.status(200).render('NewPassword_Page', {
		title: 'Forgot your password?',
		h1: 'Forgot Password',
	});
};

// Bookmarks ----------------------------------------------

export const addBookmark = catchAsync(async (req, res, next) => {
	if (!req.user) return next(new AppError('Please login to add bookmarks', 400));

	const { type, object } = req.body;

	if (!type || !object) {
		return next(new AppError('Please provide type and object', 400));
	}

	const user = await User.findOne({ username: req.user.username });

	// Pass type and object as separate arguments
	await user.addBookmark(type, object);

	res.status(200).json({
		status: 'success',
		data: {
			bookmark: user.bookmarks,
		},
	});
});

export const removeBookmark = catchAsync(async (req, res, next) => {
	if (!req.user) return next(new AppError('Please login to remove bookmarks', 400));

	const { type, object } = req.body;
	const user = await User.findOne({ name: req.user.name });

	if (type === 'All') await user.removeBookmarkAll();
	else {
		if (!type || !object) return next(new AppError('Please provide type and object', 400));

		await user.removeBookmark(type, object);
	}

	res.status(201).json({
		status: 'success',
		data: {
			bookmark: user.bookmarks,
		},
	});
});

// Image Upload ----------------------------------------------

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please upload only images.', 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	const filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${filename}`);

	req.file.filename = filename;

	next();
});

export const bookmarksView = (req, res) => {
	const user = req.user;
	if (!user) return signupView(req, res);

	// Quran
	const fav_chapters = user.bookmarks.fav_chapters.map((chapter) => chapter.chapter);
	const fav_verses = user.bookmarks.fav_verses.map((verse) => verse.verse);
	const fav_pages = user.bookmarks.fav_pages.map((page) => page.page);

	// Hadith
	const fav_hadiths = user.bookmarks.fav_hadiths.map((hadith) => hadith.hadith);
	const fav_books_hadiths = user.bookmarks.fav_books_hadiths.map((book) => book.book);
	const fav_sections_hadith = user.bookmarks.fav_sections_hadith.map((section) => section.section);

	// Tafsir
	const fav_books_tafsir = user.bookmarks.fav_books_tafsir.map((book) => book.book);

	res.status(200).render('Bookmarks_Page', {
		title: 'Your bookmarks',
		fav_chapters,
		fav_verses,
		fav_pages,
		fav_hadiths,
		fav_books_hadiths,
		fav_sections_hadith,
		fav_books_tafsir,
	});
};

export const getBookmarks = catchAsync(async (req, res, next) => {
	const user = req.user;
	if (!user) return signupView(req, res);

	let { type } = req.params;
	let bookmarks = [];
	let title;
	let info1 = '';
	let info2 = '';
	let info3 = '';
	let url = '';

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	switch (type) {
		case 'fav_chapters': {
			bookmarks = user.bookmarks.fav_chapters.map((chapter) => ({
				info1: chapter.chapter,
				info2: null,
			}));
			title = 'Chapters';
			info1 = 'Chapter';
			url = `/quran/book/hafs/chapter/info1`;
			break;
		}

		case 'fav_verses': {
			bookmarks = user.bookmarks.fav_verses.map((verse) => ({
				info1: verse.verse,
				info2: verse.chapter || null,
			}));
			title = 'Verses';
			info1 = 'Verse';
			info2 = 'Chapter';
			url = `/quran/book/hafs/chapter/info2`;

			break;
		}

		case 'fav_pages': {
			bookmarks = user.bookmarks.fav_pages.map((page) => ({
				info1: page.page,
				info2: null,
			}));

			title = 'Pages';
			info1 = 'Page';
			url = `/quran/book/hafs/page/info1`;
			break;
		}

		case 'fav_hadiths': {
			bookmarks = user.bookmarks.fav_hadiths.map((hadith) => ({
				info1: hadith.hadith,
				info2: hadith.book || null,
				info3:
					capitalizeFirstLetter(hadith.book.split('-')[1]) +
					' ' +
					capitalizeFirstLetter(hadith.book.split('-')[0]),
			}));
			title = 'Hadiths';
			info1 = 'Hadith';
			info3 = ' ';
			url = `/hadith/book/info2/hadith/info1`;

			break;
		}

		case 'fav_books_hadiths': {
			bookmarks = user.bookmarks.fav_books_hadiths.map((book) => ({
				info1: book.metadata_name,
				info2: book.name,
				info3: book.name.split('-')[0] === 'ara' ? 'Arabic' : 'English',
			}));
			title = 'Hadith Books';
			info1 = ' ';
			info3 = ' ';
			url = `/hadith/book/info2/hadith/1`;
			break;
		}

		case 'fav_sections_hadith': {
			bookmarks = user.bookmarks.fav_sections_hadith.map((section) => ({
				info1: section.section,
				info2: section.book || null,
				info3:
					capitalizeFirstLetter(section.book.split('-')[1]) +
					' ' +
					capitalizeFirstLetter(section.book.split('-')[0]),
			}));
			title = 'Hadith Sections';
			info1 = 'Section';
			info3 = 'from';
			url = `/hadith/book/info2/section/info1`;

			break;
		}

		case 'fav_books_tafsir': {
			bookmarks = user.bookmarks.fav_books_tafsir.map((book) => ({
				info1: book.name,
				info2: book.slug,
			}));
			title = 'Tafsir Books';
			info1 = ' ';
			url = `/tafsir/book/info2/chapters/1`;

			break;
		}

		case 'fav_books_quran': {
			bookmarks = user.bookmarks.fav_books_quran.map((book) => ({
				info1: book.name,
				info2: book.slug,
			}));
			title = 'Quran Books';
			info1 = ' ';
			url = `/quran/book/info2/chapter/1`;

			break;
		}

		default:
			return next(new AppError('Invalid type', 400));
	}
	// sorting
	bookmarks.sort((a, b) => {
		if (a.info1 < b.info1) return -1;
		if (a.info1 > b.info1) return 1;
		return 0;
	});
	// Removing duplicates
	const seen = new Set();
	const uniqueBookmarks = bookmarks.filter((bookmark) => {
		const key = `${bookmark.info1}-${bookmark.info2}-${bookmark.info3}`;
		if (seen.has(key)) {
			return false;
		} else {
			seen.add(key);
			return true;
		}
	});

	res.status(200).render('SingleBookmark_Page', {
		title,
		info1,
		info2,
		info3,
		bookmarks: uniqueBookmarks,
		type,
		url,
	});
});

// Label Removal Bookmarks ----------------------------------------------

export const labelRemovalBookmarks = catchAsync(async (req, res, next) => {
	if (!req.user) return next(new AppError('Please login to remove bookmarks', 400));

	const { info1, info2 } = req.params;
	let obj = {};
	let type = '';

	switch (req.params.type) {
		case 'fav_chapters': {
			obj.chapter = info1;
			type = 'chapter';
			break;
		}
		case 'fav_verses': {
			obj.verse = info1;
			obj.chapter = info2;
			type = 'verse';
			break;
		}
		case 'fav_pages': {
			obj.page = info1;
			type = 'page';
			break;
		}
		case 'fav_hadiths': {
			obj.hadith = info1;
			type = 'hadith';
			obj.book = info2;
			break;
		}
		case 'fav_books_hadiths': {
			obj.name = info2;
			obj.metadata_name = info1;
			type = 'hadith_book';
			break;
		}
		case 'fav_sections_hadith': {
			obj.section = info1;
			obj.book = info2;
			type = 'hadith_section';
			break;
		}
		case 'fav_books_quran': {
			obj.book = info1;
			type = 'quran_book';
			break;
		}
		case 'fav_books_tafsir': {
			obj.name = info1;
			obj.slug = info2;
			type = 'tafsir_book';
			break;
		}
		default: {
			return res.status(400).json({ error: 'Invalid bookmark type' });
		}
	}

	if (!type || !info1) {
		return next(new AppError('Please provide type and info1', 400));
	}

	const user = req.user;

	// Pass type and object as separate arguments
	await user.removeBookmark(type, obj);

	res.status(201).json({
		status: 'success',
		data: {
			bookmark: user.bookmarks,
		},
	});
});
