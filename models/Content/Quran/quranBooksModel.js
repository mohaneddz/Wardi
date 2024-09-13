import mongoose from 'mongoose';

const quranBooksSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	language: {
		type: String,
		required: true,
	},
});

const QuranBooks = mongoose.model('Quran.Books', quranBooksSchema);

export default QuranBooks;