import mongoose from 'mongoose';

export const VerseSchema = new mongoose.Schema({
	chapter: {
		type: Number,
	},
	verse: {
		type: Number,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
});

export default VerseSchema;