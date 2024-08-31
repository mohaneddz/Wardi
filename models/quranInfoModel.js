import mongoose from 'mongoose';
import Chapter from './chapterSchema.js';

const quranInfoSchema = new mongoose.Schema({
  verses: {
    type: Number,
    required: true,
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  }],
});

const Info = mongoose.models.Info || mongoose.model('Info', quranInfoSchema);

export default Info;
