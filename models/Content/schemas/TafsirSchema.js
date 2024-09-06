import mongoose from 'mongoose';

const AyaSchema = new mongoose.Schema({
    aya: {
        type: Number,
        required: true,
    },
    surah: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

const AyaObjectSchema = new mongoose.Schema({
    ayas: {
        type: [AyaSchema],
        required: true,
    }
});

export const TafsirSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		author_name: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
		ayat: {
			type: [AyaObjectSchema],
			required: true,
		},
	},
	{
		toJson: { virtuals: true },
		toString: { virtuals: true },
	}
);

