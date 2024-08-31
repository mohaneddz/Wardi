import mongoose from 'mongoose';
import VerseSchema from './VerseSchema.js';

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


const Juz = mongoose.model('Juz', quranJuzsModel);

export default Juz;

