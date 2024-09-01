import { Schema } from 'mongoose';
import VerseSchema from '../schemas/VerseSchema.js';

const quranPagesModel = new Schema({
	pageNumber: {
		type: Number,
		required: true,
	},
	verses: {
		type: [VerseSchema],
		required: true,
	},
});

const Page = connections.quran.model('Pages', quranPagesModel);

export default Page;
