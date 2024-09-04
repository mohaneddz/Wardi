import mongoose from 'mongoose';

const AyahSchema = new mongoose.Schema({
    ayah: {
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

const AyahObjectSchema = new mongoose.Schema({
    ayahs: {
        type: [AyahSchema],
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
			type: [AyahObjectSchema],
			required: true,
		},
	},
	{
		toJson: { virtuals: true },
		toString: { virtuals: true },
	}
);

