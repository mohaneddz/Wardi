import mongoose from 'mongoose';
import slugify from 'slugify';
const { Schema } = mongoose;

const quranSchema = new Schema({});

export default mongoose.model('Quran', quranSchema);