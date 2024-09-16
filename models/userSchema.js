import mongoose from 'mongoose';
import validator from 'validator';

const VerseSchema = new mongoose.Schema(
	{
		verse: { type: Number, required: true },
		chapter: { type: Number, required: true },
	},
	{ _id: true }
); // Ensure _id is added

const ChapterSchema = new mongoose.Schema(
	{
		chapter: { type: Number, required: true },
	},
	{ _id: true }
);

const HadithSchema = new mongoose.Schema(
	{
		hadith: { type: Number, required: true },
		book: { type: String, required: true },
	},
	{ _id: true }
);

const PageSchema = new mongoose.Schema(
	{
		page: { type: Number, required: true },
	},
	{ _id: true }
);

const HadithBooksSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		metadata_name: {
			type: String,
			default: '',
		},
	},
	{ _id: true }
);

const QuranBooksSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true },

	},
	{ _id: true }
);

const TafsirBooksSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true },
	},
	{ _id: true }
);

const HadithSectionSchema = new mongoose.Schema(
	{
		section: { type: Number, required: true },
		book: { type: String, required: true },
	},
	{ _id: true }
);

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
		default: [],
	},
	fav_chapters: {
		type: [ChapterSchema],
		default: [],
	},
	fav_pages: {
		type: [PageSchema],
		default: [],
	},
	fav_hadiths: {
		type: [HadithSchema],
		default: [],
	},
	fav_books_hadiths: {
		type: [HadithBooksSchema],
		default: [],
	},
	fav_books_quran: {
		type: [QuranBooksSchema],
		default: [],
	},
	fav_books_tafsir: {
		type: [TafsirBooksSchema],
		default: [],
	},
	fav_sections_hadith: {
		type: [HadithSectionSchema],
		default: [],
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
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			validator: function (value) {
				return value === this.password;
			},
			message: 'Passwords are not the same',
		},
	},
	email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	photo: {
		type: String,
		default: '',
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
		default: {},
	},
	bookmarks: {
		type: BookmakSchema,
		default: {},
	},
	passwordChangedAt: Date,
	passwordResetExpires: Date,
	passwordResetToken: String,
});

export default userSchema;
