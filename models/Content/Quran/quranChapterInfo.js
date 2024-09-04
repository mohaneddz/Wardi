import mongoose from 'mongoose';

const quranChapterInfoModel = new mongoose.Schema({
	name: {
		type: Number,
		required: true,
	},
	number: {
		type: String,
		required: true,
	},
	ayat: {
		type: Number,
		required: true,
	},
});

const ChapterInfo = mongoose.model('Quran.Names', quranChapterInfoModel);

export default ChapterInfo;