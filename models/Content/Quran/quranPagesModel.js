import mongoose from 'mongoose';
import VerseSchema from '../schemas/VerseSchema.js';
import connections from '../../../server.js';

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

const Page = mongoose.model('Pages', quranPagesModel);

export default Page;