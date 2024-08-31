import mongoose from 'mongoose';
import VerseSchema from './VerseSchema.js';

const quranPagesModel = new mongoose.Schema({
	pageNumber: {
		type: Number,
		required: true,
	},
	verses: {
		type: [VerseSchema],
		required: true,
	},
});

const Page = mongoose.model('Page', quranPagesModel);

export default Page;