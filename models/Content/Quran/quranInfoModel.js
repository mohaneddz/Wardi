import mongoose from 'mongoose';

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

const Info = mongoose.model('Infos', quranInfoSchema);

export default Info;
