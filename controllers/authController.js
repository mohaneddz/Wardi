import crypto, { verify } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import Email from './../utils/email.js';

// Token Related Functions ------------------------------------------------

export const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRES_IN}d` });
};

export const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user._id);

	res.cookie('jwt', token, {
		expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	});

	// Remove password from output
	user.password = undefined;
	// res.status(statusCode).json({
	// 	status: 'success',
	// 	token,
	// 	data: {
	// 		user,
	// 	},
	// });
};

// Basic Auth Functions ------------------------------------------------

export const signup = async (req, res, next) => {
	// Trying to create a new user 🤷‍♂️
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) return next(new AppError('User already exists', 400));

		const { username, email, password, passwordConfirm } = req.body;
		const newUser = await User.create({
			username,
			email,
			password,
			passwordConfirm,
			isActive: false,
		});

		// Generate a token for email verification (or other purposes)
		const token = signToken(newUser._id);

		// Create the verification URL
		const url = `${req.protocol}://${req.get('host')}/user/verifyEmail?token=${token}`;

		// Send a welcome email with the verification link
		await new Email(newUser, url).Confirmation();

		console.log('Email Sent!');

		res.status(200).json({
			status: 'success',
			data: {
				user: newUser,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}

	// 2) Check if user exists && password is correct
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// 3) If everything ok, send token to client
	res.locals.user = user;
	createSendToken(user, 200, req, res);

	res.status(200).json({
		status: 'success',
	});
});

export const logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};

export const verifyEmail = catchAsync(async (req, res, next) => {
	// 1) Get the token from the query parameters
	const { token } = req.query;

	// 2) Verify the token
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// 3) Find the user and activate them, bypassing the isActive check
	const user = await User.findById(decoded.id).setOptions({ bypassMiddleware: true });

	if (!user) return next(new AppError('User not found', 404));

	user.isActive = true;
	await user.save({ validateBeforeSave: false }); // just in case

	const url = `${req.protocol}://${req.get('host')}/login`;
	await new Email(user, url).sendWelcome();

	createSendToken(user, 201, req, res);
	res.redirect('/user/login');
});

export const protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and check of it's there
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
		token = req.headers.authorization.split(' ')[1];
	else if (req.cookies.jwt) token = req.cookies.jwt;

	if (!token) return next(new AppError('You are not logged in! Please log in to get access.', 401));

	// 2) Verification token ( decoded contains the id of the user btw )
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await User.findById(decoded.id);

	if (!currentUser) return next(new AppError('The user belonging to this token does no longer exist.', 401));

	// 4) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat))
		return next(new AppError('User recently changed password! Please log in again.', 401));

	// GRANT ACCESS TO PROTECTED ROUTE 🎉
	req.user = currentUser; // updating the request user ( for next middlewares )
	res.locals.user = currentUser;

	next();
});

// Only for rendered pages, no errors! ( no CatchAsync )
export const isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			// 1) verify token
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

			// 2) Check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) return next();

			// 3) Check if user changed password after the token was issued
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}

			// THERE IS A LOGGED IN USER
			req.user = currentUser;
			res.locals.user = currentUser;

			return next();
		} catch (err) {
			return next();
		}
	}

	next();
};

export const restrictTo = (...roles) => {
	return (req, res, next) => {
		// Not sure If I need it for a Quran app yet
		// roles ['admin', 'user', 'visitor'] | role='user' example
		if (!roles.includes(req.user.role))
			return next(new AppError('You do not have permission to perform this action', 403));

		next();
	};
};

// // Password Reset Functions ------------------------------------------------

export const forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with email address.', 404));
	}

	// 2) Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false }); // just in case

	// 3) Send it to user's email
	try {
		const resetURL = `${req.protocol}://${req.get('host')}/user/resetPassword?token=${resetToken}`;
		await new Email(user, resetURL).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (err) {
		// Reset the token and the expires date if there is an error
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email. Try again later!'), 500);
	}
});

export const resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token [ Creating the Hash - Updating it with token - Turns it into Hex]
	let user = req.user;
	const token = req.query.token;
	if (!user) {
		if (!token) return next(new AppError('Please provide a token', 400));
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

		user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		// 2) If token has not expired, and there is user, set the new password
		if (!user) return next(new AppError('Token is invalid or has expired', 400));
		else{
			createSendToken(user, 200, req, res);
			res.locals.user = user;
			res.status(200).render('NewPassword_Page', {
				title: 'Reset Password',
				h1: 'Reset Password',
			});
		} 

	} else {
		// Updating the user credentials
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		// reset the passwordResetToken and passwordResetExpires again
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		user.passwordChangedAt = Date.now();
		await user.save({ validateBeforeSave: false });

		createSendToken(user, 200, req, res);
		res.status(200).json({
			status: 'success',
			message: 'Password updated successfully!',
		});
	}
});

export const updatePassword = catchAsync(async (req, res, next) => {
	if (!req.body.password || !req.body.newPassword) return next();

	const user = await User.findById(req.user.id).select('+password');

	if (!(await user.correctPassword(req.body.password, user.password)))
		return next(new AppError('Your current password is wrong.', 401));

	user.password = req.body.newPassword;
	user.passwordConfirm = req.body.newPassword;
	await user.save();

	createSendToken(user, 200, req, res);

	res.status(200).json({
		status: 'success',
		message: 'Password updated successfully!',
	});
});
