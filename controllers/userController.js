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

	if (req.body.password !== '' && req.body.passwordConfirm !== '') {
		updatePassword(req, res, next);
	}

	const allowedFields = ['email', 'username'];
	const updates = filterObj(req.body, ...allowedFields);

	if (req.file) updates.photo = req.file.filename;

	const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
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

	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${req.file.filename}`);

	next();
});
