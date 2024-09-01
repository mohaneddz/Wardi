import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { HadithSchema } from '../schemas/HadithSchema.js';
import { MetadataSchema } from '../schemas/HadithSchema.js';

const HadithBookSchema = new mongoose.Schema(
	{
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// adding a virtual property to the schema
HadithBookSchema.virtual('hadith_counts').get(function () {
    return this.hadiths.length;
});

HadithBookSchema.plugin(mongooseLeanVirtuals);

const Hadith = mongoose.model('hadith.books', HadithBookSchema);

export default Hadith;
