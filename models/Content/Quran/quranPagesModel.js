import mongoose from 'mongoose';
import {VerseSchema} from '../schemas/QuranSchema.js';

const quranPagesModel = new mongoose.Schema({
	page_number: {
		type: Number,
		required: true,
	},
	verses: {
		type: [VerseSchema],
		required: true,
	},
});

export const PageHafs = mongoose.model('Quran.Hafs.Pages', quranPagesModel);
export const PageWarsh = mongoose.model('Quran.Warsh.Pages', quranPagesModel);
export const PageEnglish = mongoose.model('Quran.English.Pages', quranPagesModel);

export default PageHafs;
