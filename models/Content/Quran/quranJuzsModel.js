import VerseSchema from '../schemas/VerseSchema.js';
import { Schema } from 'mongoose';

const quranJuzsModel = new Schema({
	juz: {
		type: Number,
		required: true,
	},
	content: {
		type: [VerseSchema],
		required: true,
	},
});


const Juz = connections.quran.model('Juzs', quranJuzsModel);

export default Juz;

