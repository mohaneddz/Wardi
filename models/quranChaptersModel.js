import mongoose from 'mongoose';
import VerseSchema from './VerseSchema.js';
import slugify from 'slugify';

const quranChaptersSchema = new mongoose.Schema({
	chapter: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	verses: {
		type: [VerseSchema],
		required: true,
	},
});

const Chapter = mongoose.model('Chapters', quranChaptersSchema);

export default Chapter;