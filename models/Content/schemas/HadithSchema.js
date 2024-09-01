import mongoose from 'mongoose';

export const SectionsDetailsSchema = new mongoose.Schema({
	hadithnumber_first: {
		type: Number,
		required: true,
	},
	hadithnumber_last: {
		type: Number,
		required: true,
	},
	arabicnumber_first: {
		type: Number,
		required: true,
	},
	arabicnumber_last: {
		type: Number,
		required: true,
	},
});

export const MetadataSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	sections: {
		type: [String],
		required: true,
	},
	sections_details: {
		type: [SectionsDetailsSchema],
		required: true,
	},
});

export const HadithRefrenceSchema = new mongoose.Schema({
	book: {
		type: Number,
		required: true,
	},
	hadith: {
		type: Number,
		required: true,
	},
});

export const HadithSchema = new mongoose.Schema({
	number: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	refrence: {
		type: HadithRefrenceSchema,
		required: true,
	},
	grades: {
		type: [String],
		required: true,
	},
});
