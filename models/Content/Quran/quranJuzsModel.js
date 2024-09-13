import mongoose from 'mongoose';
import {VerseSchema} from '../schemas/QuranSchema.js';

const quranJuzsModel = new mongoose.Schema({
	juz: {
		type: Number,
		required: true,
	},
	content: {
		type: [VerseSchema],
		required: true,
	},
});


// const Juz = mongoose.model('Juzs', quranJuzsModel);
export const JuzHafs = mongoose.model('Quran.Hafs.Juzs', quranJuzsModel);
export const JuzWarsh = mongoose.model('Quran.Warsh.Juzs', quranJuzsModel);
export const JuzEnglish = mongoose.model('Quran.English.Juzs', quranJuzsModel);

export default JuzHafs;

