import { Schema } from 'mongoose';
import VerseInfoSchema from './VerseInfoSchema.js';

export const ChapterInfoSchema = new Schema({
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
    verses_info: {
        type: [VerseInfoSchema],
        required: true,
    },
});

export default ChapterInfoSchema;