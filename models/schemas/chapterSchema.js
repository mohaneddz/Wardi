import mongoose from 'mongoose';
import VerseSchema from './VerseSchema.js';

const { Schema } = mongoose;

const chapterSchema = new Schema(
	{
		chapter: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		englishName: {
			type: String,
			required: true,
		},
		arabicName: {
			type: String,
			required: true,
		},
		revelation: {
			type: String,
			required: true,
			enum: ['Mecca', 'Madina'],
		},
		verses: {
			type: [VerseSchema],
			required: true,
		},
	},
	{
		toJSON: {
			virtuals: true,
			transform: (_, ret) => {
				delete ret.verses;
			},
		},
		toObject: {
			virtuals: true,
			transform: (_, ret) => {
				delete ret.verses;
			},
		},
	}
);

// Virtual property for versesCount ✅
chapterSchema.virtual('versesCount').get(function () {
	return this.verses.length;
});

const ChapterSchema = mongoose.model('ChapterSchema', chapterSchema);

export default ChapterSchema;
