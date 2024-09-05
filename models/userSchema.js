import mongoose from 'mongoose';
import validator from 'validator';

const VerseSchema = new mongoose.Schema({
	verse: {
		type: Number,
		required: true,
	},
	chapter: {
		type: Number,
		required: true,
	},
});

const ChapterSchema = new mongoose.Schema({
	chapter: {
		type: Number,
		required: true,
	},
});

const HadithSchema = new mongoose.Schema({
	hadith: {
		type: Number,
		required: true,
	},
	book: {
		type: Number,
		required: true,
	},
});

const PageSchema = new mongoose.Schema({
	page: {
		type: Number,
		required: true,
	},
});

const HadithBooksSchema = new mongoose.Schema({
	book: {
		type: Number,
		required: true,
	},
});

const QuranBooksSchema = new mongoose.Schema({
	book: {
		type: Number,
		required: true,
	},
});

const TafsirBooksSchema = new mongoose.Schema({
	book: {
		type: Number,
		required: true,
	},
});

const PrefrencesSchema = new mongoose.Schema({
	theme: {
		type: String,
		enum: ['light', 'dark'],
		default: 'dark',
	},
	language: {
		type: String,
		enum: ['en', 'ar'],
		default: 'ar',
	},
});

const BookmakSchema = new mongoose.Schema({
	fav_verses: {
		type: [VerseSchema],
		default: '',
	},
	fav_chapters: {
		type: [ChapterSchema],
		default: '',
	},
	fav_pages: {
		type: [PageSchema],
		default: '',
	},
	fav_hadiths: {
		type: [HadithSchema],
		default: '',
	},
	fav_books_hadiths: {
		type: [HadithBooksSchema],
		default: '',
	},
	fav_books_quran: {
		type: [QuranBooksSchema],
		default: '',
	},
	fav_books_tafsir: {
		type: [TafsirBooksSchema],
		default: '',
	},
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 8,
		select: false,
	},
	confirmpassword: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: [pass === this.password, 'Passwords are not the same'],
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validator: [validator.isEmail, 'Please provide a valid email'],
		message: 'Invalid email',
	},
	photo: {
		type: String,
		default: 'default.jpg',
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'visitor'],
		default: 'user',
	},
	prefrences: {
		type: PrefrencesSchema,
	},
	bookmarks: {
		type: BookmakSchema,
		default: [],
	},
	passwordChangedAt: Date,
	passwordResetExpires: Date,
	passwordResetToken: String
});

export default userSchema;
