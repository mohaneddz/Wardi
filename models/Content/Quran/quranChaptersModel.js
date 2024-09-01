import { connections } from '../../../server.js';
import VerseSchema from '../schemas/VerseSchema.js';
import ChapterInfoSchema from '../schemas/ChapterInfoSchema.js';
import { Schema } from 'mongoose';

const ChapterSchema = new Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for versesCount ✅
ChapterSchema.virtual('versesCount').get(function () {
    return this.verses.length;
});

const Chapter = connections.Quran.model('Chapter', ChapterSchema);

export default Chapter;
