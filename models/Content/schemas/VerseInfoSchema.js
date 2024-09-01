import { Schema } from 'mongoose';

export const VerseInfoSchema = new Schema({
	verse: {
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
	}
});

export default VerseInfoSchema;
