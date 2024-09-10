import mongoose from 'mongoose';
import { VerseSchema } from '../schemas/QuranSchema.js';
import { ChapterInfoSchema } from '../schemas/QuranSchema.js';

const ChapterSchema = new mongoose.Schema(
	{
		chapter: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		verses: {
			type: [VerseSchema],
			required: true,
		},
		info: {
			type: ChapterInfoSchema,
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual property for versesCount ✅
ChapterSchema.virtual('versesCount').get(function () {
	return this.verses.length;
});

// Indexing for search ✅
ChapterSchema.index({ 'verses.text': 'text' });

const Chapter = mongoose.model('Chapter', ChapterSchema);

export default Chapter;
