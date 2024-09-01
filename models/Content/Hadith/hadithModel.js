import mongoose from 'mongoose';
import {HadithSchema} from '../schemas/HadithSchema.js';
import {MetadataSchema} from '../schemas/HadithSchema.js';

const HadithBookSchema = new mongoose.Schema({
	book: {
		type: String,
		required: true,
	},
	number: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	metadata: {
		type: MetadataSchema,
		required: true,
	},
	hadiths: {
		type: [HadithSchema],
		required: true,
	},
});

const Hadith = mongoose.model('hadith.books', HadithBookSchema);

export default Hadith;
