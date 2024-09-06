import User from '../models/userModel.js';

// import multer from 'multer';
// import sharp from 'sharp';

import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';

// // Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

// // export const getUser = factory.getOne(User);
// // export const getAllUsers = factory.getAll(User);
// // export const createUser = factory.createOne(User);
// // export const updateUser = factory.updateOne(User);
// // export const deleteUser = factory.deleteOne(User);

// // |.....|---------------------------------------------

export const getMe = (req, res, next) => {
	if (req.user) req.params.id = req.user.id;
	next();
};

// View Functions ------------------------------------------------

export const signupView = (req, res) => {
	res.status(200).render('Login_Page', {
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
	res.status(200).render('account', {
		title: 'Your account',
	});
};

export const getMeView = (req, res) => {
	res.status(200).render('User_Page', {
		title: 'Your account',
	});
};

// ----------------------------------------------

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
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
// 	if (file.mimetype.startsWith('image')) {
// 		cb(null, true);
// 	} else {
// 		cb(new AppError('Not an image! Please upload only images.', 400), false);
// 	}
// };

// const upload = multer({
// 	storage: multerStorage,
// 	fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
// 	if (!req.file) return next();

// 	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

// 	await sharp(req.file.buffer)
// 		.resize(500, 500)
// 		.toFormat('jpeg')
// 		.jpeg({ quality: 90 })
// 		.toFile(`public/img/users/${req.file.filename}`);

// 	next();
// });

// const filterObj = (obj, ...allowedFields) => {
// 	const newObj = {};
// 	Object.keys(obj).forEach((el) => {
// 		if (allowedFields.includes(el)) newObj[el] = obj[el];
// 	});
// 	return newObj;
// };

// exports.updateMe = catchAsync(async (req, res, next) => {
// 	// 1) Create error if user POSTs password data
// 	if (req.body.password || req.body.passwordConfirm) {
// 		return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
// 	}

// 	// 2) Filtered out unwanted fields names that are not allowed to be updated
// 	const filteredBody = filterObj(req.body, 'name', 'email');
// 	if (req.file) filteredBody.photo = req.file.filename;

// 	// 3) Update user document
// 	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
// 		new: true,
// 		runValidators: true,
// 	});

// 	res.status(200).json({
// 		status: 'success',
// 		data: {
// 			user: updatedUser,
// 		},
// 	});
// });

// exports.deleteMe = catchAsync(async (req, res, next) => {
// 	await User.findByIdAndUpdate(req.user.id, { active: false });

// 	res.status(204).json({
// 		status: 'success',
// 		data: null,
// 	});
// });

// exports.createUser = (req, res) => {
// 	res.status(500).json({
// 		status: 'error',
// 		message: 'This route is not defined! Please use /signup instead',
// 	});
// };

// exports.getUser = factory.getOne(User);
// exports.getAllUsers = factory.getAll(User);

// // NO updating passwords with these! 🛑
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
