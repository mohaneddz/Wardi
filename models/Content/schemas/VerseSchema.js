import { connections } from '../../../server.js'; // Use named import
import { Schema } from 'mongoose';

export const VerseSchema = new Schema({
    chapter: {
        type: Number,
    },
    verse: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

export default VerseSchema;