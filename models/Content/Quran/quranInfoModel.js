import mongoose from 'mongoose'; // Import the mongoose instance
import { Schema } from 'mongoose';

const quranInfoSchema = new Schema({
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

const Info = connections.quran.model('Infos', quranInfoSchema);

export default Info;
