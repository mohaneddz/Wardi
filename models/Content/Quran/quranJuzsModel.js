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


const Juz = mongoose.model('Juzs', quranJuzsModel);

export default Juz;

