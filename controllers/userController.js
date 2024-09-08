import User from '../models/userModel.js';

import multer from 'multer';
import sharp from 'sharp';

import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';
import { updatePassword } from './authController.js';

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

	const filteredBody = filterObj(req.body, 'username', 'email');
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

// Bookmarks ----------------------------------------------

export const addBookmark = catchAsync(async (req, res, next) => {
	if (!req.user) return next(new AppError('Please login to add bookmarks', 400));

	const { type, object } = req.body;

	if (!type || !object) {
		return next(new AppError('Please provide type and object', 400));
	}

	const user = await User.findOne({ name: req.user.name });

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

	if (!type || !object) {
		return next(new AppError('Please provide type and object', 400));
	}
	const user = await User.findOne({ name: req.user.name });

	// Pass type and object as separate arguments
	await user.removeBookmark(type, object);

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

	const { type } = req.params;
	let bookmarks = [];
	let title;
	let info1 = '';
	let info2 = '';

	switch (type) {
		case 'fav_chapters': {
			bookmarks = user.bookmarks.fav_chapters.map((chapter) => ({
				info1: chapter.chapter,
				info2: null,
			}));
			title = 'Chapters';
			info1 = 'Chapter';
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
			break;
		}

		case 'fav_pages': {
			bookmarks = user.bookmarks.fav_pages.map((page) => ({
				info1: page.page,
				info2: null,
			}));
			title = 'Pages';
			info1 = 'Page';
			break;
		}

		case 'fav_hadiths': {
			bookmarks = user.bookmarks.fav_hadiths.map((hadith) => ({
				info1: hadith.hadith,
				info2: hadith.book || null,
			}));
			title = 'Hadiths';
			info1 = 'Hadith';
			info2 = 'Book';
			break;
		}

		case 'fav_books_hadiths': {
			bookmarks = user.bookmarks.fav_books_hadiths.map((book) => ({
				info1: book.book,
				info2: null,
			}));
			title = 'Hadith Books';
			info1 = 'Book';
			break;
		}

		case 'fav_sections_hadith': {
			bookmarks = user.bookmarks.fav_sections_hadith.map((section) => ({
				info1: section.section,
				info2: section.book || null,
			}));
			title = 'Hadith Sections';
			info1 = 'Section';
			info2 = 'Book';
			break;
		}

		case 'fav_books_tafsir': {
			bookmarks = user.bookmarks.fav_books_tafsir.map((book) => ({
				info1: book.book,
				info2: null,
			}));
			title = 'Tafsir Books';
			info1 = 'Book';
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

	res.status(200).render('SingleBookmark_Page', {
		title,
		info1,
		info2,
		bookmarks,
	});
});

// Label Removal Bookmarks ----------------------------------------------

export const labelRemovalBookmarks = catchAsync(async (req, res, next) => {
	if (!req.user) return next(new AppError('Please login to remove bookmarks', 400));

	/*
	verse: 'bookmarks.fav_verses',
		chapter: 'bookmarks.fav_chapters',
		page: 'bookmarks.fav_pages',
		hadith: 'bookmarks.fav_hadiths',
		hadith_book: 'bookmarks.fav_books_hadiths',
		quran_book: 'bookmarks.fav_books_quran',
		tafsir_book: 'bookmarks.fav_books_tafsir',
		hadith_section: 'bookmarks.fav_sections_hadith',
	*/

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
			obj.book = info1;
			type = 'hadith_book';
			break;
		}
		case 'fav_sections_hadith': {
			obj.section = info1;
			type = 'hadith_section';
			obj.book = info2;
			break;
		}
		case 'fav_books_quran': {
			obj.book = info1;
			type = 'quran_book';
			break;
		}
		case 'fav_books_tafsir': {
			obj.book = info1;
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
