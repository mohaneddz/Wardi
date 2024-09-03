import mongoose from 'mongoose';

export const VerseSchema = new mongoose.Schema({
	chapter: {
		type: Number,
	},
	verse: {
		type: Number,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
});

export const VerseInfoSchema = new mongoose.Schema({
	verse: {
		type: Number,
		required: true,
	},
	line: {
		type: Number,
		required: true,
	},
	page: {
		type: Number,
		required: true,
	},
	sajda: {
		type: Boolean,
		required: true,
	},
	juz: {
		type: Number,
		required: true,
	},
});


export const ChapterInfoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	englishName: {
		type: String,
		required: true,
	},
	arabicName: {
		type: String,
		required: true,
	},
	revelation: {
		type: String,
		required: true,
		enum: ['Mecca', 'Madina'],
	},
	verses_info: {
		type: [VerseInfoSchema],
	},
});